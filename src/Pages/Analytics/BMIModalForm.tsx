import React, { useState } from 'react';
import { Modal, Form, Input, Row, Col, message, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

interface Child {
  id: string;
  childId?: string;
  name: string;
  doB: string;
  gender: number;
  weight: number;
  height: number;
  bmi: number;
  bmiPercentile: number;
}

interface BMIModalFormProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: any) => Promise<any>;
  form: any;
  selectedChildData: Child | null;
}

const BMIModalForm: React.FC<BMIModalFormProps> = ({
  visible,
  onCancel,
  onSave,
  form,
  selectedChildData
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);
  
  const showConfirmation = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values before processing:", values); // Debug log
      
      // Clone values to avoid reference issues
      const processedValues = { ...values };
      
      // Convert Moment object to string format for API
      processedValues.doY = values.doY 
        ? values.doY.format('YYYY-MM-DD') 
        : moment().format('YYYY-MM-DD');
      
      processedValues.childId = selectedChildData?.id || selectedChildData?.childId;
      processedValues.gender = selectedChildData?.gender;
      
      console.log("Processed values:", processedValues); // Debug log
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
      console.log("Submitting values:", formValues); // Debug log
      
      try {
        await onSave(formValues);
        message.success(`BMI record for ${selectedChildData?.name} has been saved successfully!`);
        setConfirmVisible(false);
        onCancel();
        // Reset form after all operations are complete
        form.resetFields();
      } catch (error: any) {
        console.error("Full error:", error);
        console.error("Error data:", error.response?.data);

        if (error.response?.status === 500) {
          if (error.response?.data?.message?.includes("BMI Category not found")) {
            message.error("Invalid BMI data: BMI Category not found. Please check height and weight values.");
          } else {
            message.error("Server error occurred. Please try again later.");
          }
        } else {
          message.error(error.response?.data?.message || "Failed to save BMI record");
        }
        setConfirmVisible(false);
        return;
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  React.useEffect(() => {
    if (visible) {
      // Set default date as a Moment object
      form.setFieldsValue({
        doY: moment() // Use moment object directly
      });
    }
  }, [visible, form]);
  
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
              <PlusOutlined style={{ fontSize: '16px', color: '#1e3a8a' }} />
            </div>
            <span>Add New BMI Record</span>
          </div>
        }
        visible={visible}
        onCancel={onCancel}
        onOk={showConfirmation}
        okText="Save Record"
        okButtonProps={{ style: { background: '#1e3a8a' }, loading: submitting }}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Child's Name">
            <Input value={selectedChildData?.name} disabled style={{ background: '#f8fafc' }} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Gender">
                <Input value={selectedChildData?.gender === 0 ? "Male" : "Female"} disabled style={{ background: '#f8fafc' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Age (Months)">
                <Input 
                  value={moment().diff(moment(selectedChildData?.doB, "YYYY-MM-DD"), 'months')} 
                  disabled 
                  style={{ background: '#f8fafc' }} 
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item 
            name="doY" 
            label="BMI Record Date"
            rules={[{ required: true, message: "Please select a BMI record date!" }]}
          >
            <DatePicker 
              format="YYYY-MM-DD" 
              disabledDate={(current) => current && current > moment()}  
              style={{ width: '100%' }} 
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                name="height" 
                label="Height (cm)" 
                rules={[{ required: true, message: "Please enter height!" }]}>
                <Input type="number" placeholder="Enter height" step="0.1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                name="weight" 
                label="Weight (kg)" 
                rules={[{ required: true, message: "Please enter weight!" }]}>
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
        okText="Yes, Save"
        cancelText="No, Cancel"
        okButtonProps={{ style: { background: '#1e3a8a' }, loading: submitting }}
      >
        <p>Are you sure you want to save this BMI record for {selectedChildData?.name}?</p>
        <p>Date: {formValues?.doY}</p>
        <p>Height: {formValues?.height} cm</p>
        <p>Weight: {formValues?.weight} kg</p>
      </Modal>
    </>
  );
};

export default BMIModalForm;