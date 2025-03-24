import React from 'react';
import { Modal, Form, Input, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

interface Child {
  id: string;
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
  onSave: () => void;
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
      onOk={onSave}
      okText="Save Record"
      okButtonProps={{ style: { background: '#1e3a8a' } }}
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
                value={selectedChildData?.doB ? moment().diff(moment(selectedChildData.doB, "YYYY-MM-DD"), "months") : ""} 
                disabled 
                style={{ background: '#f8fafc' }} 
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="height" 
              label="Height (cm)" 
              rules={[
                { required: true, message: "Please enter height!" },
                { 
                  validator: (_, value) => {
                    const num = parseFloat(value);
                    if (isNaN(num) || num < 1 || num > 300) {
                      return Promise.reject('Height must be between 1-300 cm');
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input type="number" placeholder="Enter height" step="0.1" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="weight" 
              label="Weight (kg)" 
              rules={[
                { required: true, message: "Please enter weight!" },
                { 
                  validator: (_, value) => {
                    const num = parseFloat(value);
                    if (isNaN(num) || num < 0.1 || num > 300) {
                      return Promise.reject('Weight must be between 0.1-300 kg');
                    }
                    return Promise.resolve();
                  }
                }
              ]}
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