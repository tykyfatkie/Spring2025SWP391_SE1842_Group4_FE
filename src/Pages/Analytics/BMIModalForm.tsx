import React, { useState } from 'react';
import { Modal, Form, Input, Row, Col, message } from 'antd';
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

        // Sử dụng giá trị ngày đã được set mặc định
        values.doY = moment().format('YYYY-MM-DD');
        console.log("Using current date:", values.doY);

        values.childId = selectedChildData?.id || selectedChildData?.childId;
        values.gender = selectedChildData?.gender;

        try {
            await onSave(values);
            // Hiển thị thông báo thành công
            message.success(`BMI record for ${selectedChildData?.name} has been saved successfully!`);
            // Đóng modal sau khi lưu thành công
            onCancel();
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
      // Set các giá trị mặc định khi modal hiển thị
      form.setFieldsValue({
        doY: moment().format('YYYY-MM-DD')
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
        >
          <Input 
            disabled 
            style={{ background: '#f8fafc' }} 
            value={moment().format('YYYY-MM-DD')}
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