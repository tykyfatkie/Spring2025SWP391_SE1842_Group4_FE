import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Row, Col, message, DatePicker } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

interface ChartData {
  id: string;
  dateTime: string;
  date: string;
  bmi: number;
  weight: number;
  height: number;
  percentile: number;
  ageInMonths?: number;
}

interface Child {
  id: string;
  childId?: string;
  name: string;
  doB: string;
  gender: number;
}

interface BMIEditModalProps {
  visible: boolean;
  onCancel: () => void;
  recordToEdit: ChartData | null;
  selectedChild: Child | null;
  onEditSuccess: () => void;
}

const BMIEditModal: React.FC<BMIEditModalProps> = ({
  visible,
  onCancel,
  recordToEdit,
  selectedChild,
  onEditSuccess
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    if (visible && recordToEdit) {
      form.setFieldsValue({
        doY: moment(recordToEdit.dateTime),
        height: recordToEdit.height,
        weight: recordToEdit.weight
      });
    }
  }, [visible, recordToEdit, form]);

  const showConfirmation = async () => {
    try {
      const values = await form.validateFields();
      
      // Clone values to avoid reference issues
      const processedValues = { ...values };
      
      // Use original record's dateTime instead of form value
      // since we've disabled date editing
      processedValues.doY = recordToEdit?.dateTime;
      
      // Save formatted date for display
      const displayDate = moment(recordToEdit?.dateTime).format('YYYY-MM-DD');
      setFormattedDate(displayDate);
      
      const childId = selectedChild?.id || selectedChild?.childId;
      processedValues.childId = childId;
      processedValues.gender = selectedChild?.gender;
      
      setFormValues(processedValues);
      setConfirmVisible(true);
    } catch (validationError) {
      console.log("Validation failed:", validationError);
    }
  };

  const handleConfirmCancel = () => {
    setConfirmVisible(false);
  };

  const handleConfirmOk = async () => {
    try {
      setSubmitting(true);
      
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Authentication token missing. Please login again.");
        return;
      }
      
      const childId = selectedChild?.id || selectedChild?.childId;
      
      const editData = {
        childId: childId,
        height: formValues.height,
        weight: formValues.weight,
        gender: selectedChild?.gender,
        createdAt: recordToEdit?.dateTime, // Use original dateTime
        notes: ""
      };
      
      // API endpoint for editing the record
      await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/bmi/edit?recordId=${recordToEdit?.id}`,
        editData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      message.success(`BMI record for ${selectedChild?.name} has been updated successfully!`);
      setConfirmVisible(false);
      form.resetFields();
      onEditSuccess();
      onCancel();
    } catch (error: any) {
      console.error("Full error:", error);
      
      if (error.response?.status === 500) {
        if (error.response?.data?.message?.includes("BMI Category not found")) {
          message.error("Invalid BMI data: BMI Category not found. Please check height and weight values.");
        } else {
          message.error("Server error occurred. Please try again later.");
        }
      } else {
        message.error(error.response?.data?.message || "Failed to update BMI record");
      }
      setConfirmVisible(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!recordToEdit || !selectedChild) return null;

  return (
    <>
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: 'rgba(30, 58, 138, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: '16px' 
            }}>
              <EditOutlined style={{ fontSize: '16px', color: '#1e3a8a' }} />
            </div>
            <span>Edit BMI Record</span>
          </div>
        }
        visible={visible}
        onCancel={onCancel}
        onOk={showConfirmation}
        okText="Update Record"
        okButtonProps={{ style: { background: '#1e3a8a' }, loading: submitting }}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Child's Name">
            <Input value={selectedChild?.name} disabled style={{ background: '#f8fafc' }} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Gender">
                <Input value={selectedChild?.gender === 0 ? "Male" : "Female"} disabled style={{ background: '#f8fafc' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Age (Months)">
                <Input 
                  value={moment().diff(moment(selectedChild?.doB, "YYYY-MM-DD"), 'months')} 
                  disabled 
                  style={{ background: '#f8fafc' }} 
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            name="doY" 
            label="BMI Record Date"
          >
            <DatePicker 
              disabled={true}
              format="YYYY-MM-DD" 
              style={{ width: '100%', background: '#f8fafc' }} 
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="height" 
                label="Height (cm)" 
                rules={[{ required: true, message: "Please enter height!" }]}
              >
                <Input type="number" placeholder="Enter height" step="0.1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="weight" 
                label="Weight (kg)" 
                rules={[{ required: true, message: "Please enter weight!" }]}
              >
                <Input type="number" placeholder="Enter weight" step="0.1" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      
      {/* Confirmation Modal */}
      <Modal
        title="Confirmation"
        visible={confirmVisible}
        onCancel={handleConfirmCancel}
        onOk={handleConfirmOk}
        okText="Yes, Update"
        cancelText="No, Cancel"
        okButtonProps={{ style: { background: '#1e3a8a' }, loading: submitting }}
      >
        <p>Are you sure you want to update this BMI record for {selectedChild?.name}?</p>
        <p>Date: {formattedDate}</p>
        <p>Height: {formValues?.height} cm</p>
        <p>Weight: {formValues?.weight} kg</p>
      </Modal>
    </>
  );
};

export default BMIEditModal;