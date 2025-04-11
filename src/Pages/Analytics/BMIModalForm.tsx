import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Row, Col, message, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';

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
  const [duplicateConfirmVisible, setDuplicateConfirmVisible] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [duplicateRecordId, setDuplicateRecordId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Kiểm tra trùng lặp record theo ngày
  const checkDuplicateRecord = async (childId: string, date: string): Promise<any | null> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Authentication token missing. Please login again.");
        return null;
      }
      
      // Sử dụng endpoint đúng như trong Network tab
      const url = `${import.meta.env.VITE_API_ENDPOINT}/bmi/tracking?childId=${childId}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Xử lý cấu trúc dữ liệu phù hợp với API thực tế
      if (response.data?.value?.data && Array.isArray(response.data.value.data)) {
        // Tìm bất kỳ record nào có cùng ngày (so sánh phần ngày)
        const records = response.data.value.data;
        const duplicateRecord = records.find((record: any) => {
          const recordDate = moment(record.createdAt).format('YYYY-MM-DD');
          return recordDate === date;
        });
        
        return duplicateRecord || null;
      }
      
      return null;
    } catch (error) {
      console.error("Error checking for duplicate records:", error);
      return null;
    }
  };
  
  const showConfirmation = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values before processing:", values);
      
      // Clone values để tránh vấn đề tham chiếu
      const processedValues = { ...values };
      
      // Chuyển đổi Moment object sang string format
      const momentDate = values.doY;
      processedValues.doY = momentDate
        ? momentDate.toISOString()
        : new Date().toISOString();
      
      // Lưu ngày đã định dạng để hiển thị
      const displayDate = momentDate
        ? momentDate.format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD');
      
      setFormattedDate(displayDate);
      
      const childId = selectedChildData?.id || selectedChildData?.childId;
      processedValues.childId = childId;
      processedValues.gender = selectedChildData?.gender;
      
      // Kiểm tra trùng lặp record trước khi lưu
      if (childId) {
        const duplicateRecord = await checkDuplicateRecord(childId, displayDate);
        
        if (duplicateRecord && !isEditMode) {
          // Nếu tìm thấy trùng lặp, hiển thị hộp thoại xác nhận
          setDuplicateRecordId(duplicateRecord.id);
          setFormValues(processedValues);
          setDuplicateConfirmVisible(true);
          return;
        }
      }
      
      console.log("Processed values:", processedValues);
      setFormValues(processedValues);
      setConfirmVisible(true);
    } catch (validationError) {
      console.log("Validation failed:", validationError);
    }
  };
  
  const handleConfirmCancel = () => {
    setConfirmVisible(false);
  };
  
  const handleDuplicateConfirmCancel = () => {
    setDuplicateConfirmVisible(false);
  };
  
  const handleDuplicateConfirmEdit = () => {
    setDuplicateConfirmVisible(false);
    setIsEditMode(true);
    // Hiển thị hộp thoại xác nhận thông thường
    setConfirmVisible(true);
  };
  
  const handleConfirmOk = async () => {
    try {
      setSubmitting(true);
      console.log("Submitting values:", formValues);
      
      try {
        if (isEditMode && duplicateRecordId) {
          // Sử dụng endpoint edit với recordId
          const token = localStorage.getItem("token");
          if (!token) {
            message.error("Authentication token missing. Please login again.");
            return;
          }
          
          // Lấy childId từ selectedChildData
          const childId = selectedChildData?.id || selectedChildData?.childId;
          
          const editData = {
            childId: childId,
            height: formValues.height,
            weight: formValues.weight,
            gender: selectedChildData?.gender,
            createdAt: formValues.doY, // Add the date field
            notes: "" 
          };
          
          console.log("Edit data being sent:", editData);
          
          // Đường dẫn API edit
          await axios.post(
            `${import.meta.env.VITE_API_ENDPOINT}/bmi/edit?recordId=${duplicateRecordId}`, 
            editData,
            {
              headers: { 
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            }
          );
          
          message.success(`BMI record for ${selectedChildData?.name} has been updated successfully!`);
        } else {
          // Sử dụng endpoint save thông thường
          await onSave(formValues);
          message.success(`BMI record for ${selectedChildData?.name} has been saved successfully!`);
        }
        
        setConfirmVisible(false);
        onCancel();
        // Reset form và state sau khi hoàn tất các thao tác
        form.resetFields();
        setIsEditMode(false);
        setDuplicateRecordId(null);
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
  
  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        doY: moment() 
      });
      // Reset edit mode khi modal được mở
      setIsEditMode(false);
      setDuplicateRecordId(null);
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
              {isEditMode ? (
                <EditOutlined style={{ fontSize: '16px', color: '#1e3a8a' }} />
              ) : (
                <PlusOutlined style={{ fontSize: '16px', color: '#1e3a8a' }} />
              )}
            </div>
            <span>{isEditMode ? 'Edit BMI Record' : 'Add New BMI Record'}</span>
          </div>
        }
        visible={visible}
        onCancel={onCancel}
        onOk={showConfirmation}
        okText={isEditMode ? "Update Record" : "Save Record"}
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
              disabledDate={(current) => {
                // Không cho phép chọn ngày trong tương lai
                const today = moment().endOf('day');
                // Không cho phép chọn ngày trước ngày sinh của trẻ
                const birthDate = moment(selectedChildData?.doB, "YYYY-MM-DD");
                
                // Trả về true nếu ngày bị vô hiệu hóa (không chọn được)
                return current && (current > today || current < birthDate);
              }}
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
        okText={isEditMode ? "Yes, Update" : "Yes, Save"}
        cancelText="No, Cancel"
        okButtonProps={{ style: { background: '#1e3a8a' }, loading: submitting }}
      >
        <p>{isEditMode 
          ? `Are you sure you want to update this BMI record for ${selectedChildData?.name}?` 
          : `Are you sure you want to save this BMI record for ${selectedChildData?.name}?`}</p>
        <p>Date: {formattedDate}</p>
        <p>Height: {formValues?.height} cm</p>
        <p>Weight: {formValues?.weight} kg</p>
      </Modal>
      
      {/* Duplicate Record Modal */}
      <Modal
        title="Record Already Exists"
        visible={duplicateConfirmVisible}
        onCancel={handleDuplicateConfirmCancel}
        onOk={handleDuplicateConfirmEdit}
        okText="Yes, Edit Existing Record"
        cancelText="No, Cancel"
        okButtonProps={{ style: { background: '#1e3a8a' } }}
      >
        <p>A BMI record already exists for {selectedChildData?.name} on {formattedDate}.</p>
        <p>Would you like to edit the existing record instead?</p>
      </Modal>
    </>
  );
};

export default BMIModalForm;