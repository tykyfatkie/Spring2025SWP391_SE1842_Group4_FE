import React from "react";
import { Modal, Form, Input, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";

const { Text } = Typography;

interface EditChildModalProps {
  visible: boolean;
  onCancel: () => void;
  onUpdate: () => void;
  form: any;
  initialValues?: {
    name: string;
    dob: string;
    gender: number;
  };
}

const EditChildModal: React.FC<EditChildModalProps> = ({
  visible,
  onCancel,
  onUpdate,
  form,
  initialValues
}) => {
  // Set form values when initial values change
  React.useEffect(() => {
    if (initialValues && visible) {
      form.setFieldsValue({
        name: initialValues.name,
        dob: initialValues.dob ? moment(initialValues.dob) : null,
        gender: initialValues.gender,
      });
    }
  }, [initialValues, visible, form]);

  const modalTitle = (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ 
        width: '32px', 
        height: '32px', 
        borderRadius: '50%', 
        background: 'rgba(30, 58, 138, 0.1)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginRight: '12px' 
      }}>
        <EditOutlined style={{ fontSize: '16px', color: '#1e3a8a' }} />
      </div>
      <span style={{ fontSize: '18px', fontWeight: 600, color: '#1e3a8a' }}>Edit Child Profile</span>
    </div>
  );

  const buttonStyle = {
    borderRadius: '8px',
    height: '40px',
    padding: '0 24px'
  };

  const inputStyle = {
    borderRadius: '8px', 
    height: '42px',
    borderColor: '#e5e7eb'
  };

  const labelStyle = { fontSize: '15px' };

  return (
    <Modal
      title={modalTitle}
      visible={visible}
      onCancel={onCancel}
      onOk={onUpdate}
      okText="Update"
      okButtonProps={{
        style: {
          ...buttonStyle,
          background: '#1e3a8a',
          borderColor: '#1e3a8a',
        }
      }}
      cancelButtonProps={{ style: buttonStyle }}
      width={600}
      bodyStyle={{ padding: '16px 24px' }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label={<Text strong style={labelStyle}>Child's Name</Text>}
          rules={[{ required: true, message: "Please enter child's name" }]}
        >
          <Input placeholder="Enter child's name" style={inputStyle} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditChildModal;
