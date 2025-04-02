import React from "react";
import { Modal, Typography, Alert } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

interface DeleteChildModalProps {
  visible: boolean;
  onCancel: () => void;
  onDelete: () => void;
  loading: boolean;
  childName?: string;
}

const DeleteChildModal: React.FC<DeleteChildModalProps> = ({
  visible,
  onCancel,
  onDelete,
  loading,
  childName
}) => {
  const modalTitle = (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ 
        width: '32px', 
        height: '32px', 
        borderRadius: '50%', 
        background: 'rgba(220, 38, 38, 0.1)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginRight: '12px' 
      }}>
        <DeleteOutlined style={{ fontSize: '16px', color: '#dc2626' }} />
      </div>
      <span style={{ fontSize: '18px', fontWeight: 600, color: '#dc2626' }}>Delete Child Profile</span>
    </div>
  );

  const buttonStyle = {
    borderRadius: '8px',
    height: '40px',
    padding: '0 24px'
  };

  return (
    <Modal
      title={modalTitle}
      open={visible}
      onCancel={onCancel}
      onOk={onDelete}
      okText="Delete"
      okButtonProps={{
        style: {
          ...buttonStyle,
          background: '#dc2626',
          borderColor: '#dc2626',
        },
        danger: true,
        loading: loading
      }}
      cancelButtonProps={{ style: buttonStyle }}
      width={500}
      bodyStyle={{ padding: '16px 24px' }}
    >
      <Alert
        message="Warning: This action cannot be undone"
        description="Deleting this profile will permanently remove all associated data including growth records and health information."
        type="warning"
        showIcon
        style={{ marginBottom: '16px' }}
      />
      
      <Paragraph style={{ fontSize: '15px', marginBottom: '16px' }}>
        Are you sure you want to delete {childName ? <Text strong>{childName}'s</Text> : "this child's"} profile?
      </Paragraph>
      
      <Text type="secondary" style={{ fontSize: '14px' }}>
        If you only want to hide this profile temporarily, consider using the "Hide" option instead.
      </Text>
    </Modal>
  );
};

export default DeleteChildModal;