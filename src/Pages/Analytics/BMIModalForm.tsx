import React, { useState } from 'react';
import { Modal, Form, Input, Row, Col, DatePicker, message } from 'antd';
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
  
  const handleSubmit = async () => {
    try {
        setSubmitting(true);
        const values = await form.validateFields();

        // Đặc biệt quan trọng: Chuyển đổi doY thành chuỗi ngày định dạng YYYY-MM-DD
        // Sử dụng phương thức format trực tiếp và không giữ thông tin về timezone
        if (values.doY) {
            // Tách ra thành ngày, tháng, năm để loại bỏ ảnh hưởng múi giờ
            const date = new Date(values.doY);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            values.doY = `${year}-${month}-${day}`;
            
            console.log("Formatted date:", values.doY);
        }

        values.childId = selectedChildData?.id || selectedChildData?.childId;
        values.gender = selectedChildData?.gender;

        try {
            await onSave(values);
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
            return;
        }

        form.resetFields();
    } catch (validationError) {
        console.log("Validation failed:", validationError);
    } finally {
        setSubmitting(false);
    }
};
  
  React.useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        doY: moment()
      });
    }
  }, [visible, form]);
  
  return (
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
      onOk={handleSubmit}
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
          rules={[{ required: true, message: "Please select the date for this BMI record" }]}
        >
          <DatePicker 
            style={{ width: '100%' }} 
            format="YYYY-MM-DD"
            value={form.getFieldValue('doY') ? moment(form.getFieldValue('doY')) : null}
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

        <Form.Item name="notes" label="Notes">
          <Input.TextArea placeholder="Additional notes (optional)" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BMIModalForm;