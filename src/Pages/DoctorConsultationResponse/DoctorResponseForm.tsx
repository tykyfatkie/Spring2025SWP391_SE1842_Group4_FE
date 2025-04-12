import React, { useState } from 'react';
import { Modal, Input, Button, Form, message, Typography, Space } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import axiosInstance from '../../utils/axiosInstance';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface DoctorResponseFormProps {
  visible: boolean;
  onCancel: () => void;
  requestData: any;
  onSuccess: () => void;
}

// Main color variables to maintain consistency with parent component
const colors = {
  primary: {
    light: '#3b82f6', // Light blue
    main: '#1e3a8a',  // Dark blue
    gradient: 'linear-gradient(135deg, rgb(30, 58, 138) 0%, rgb(59, 130, 246) 100%)'
  }
};

interface UploadedFile {
  uid: string;
  name: string;
  url: string;
}

const DoctorResponseForm: React.FC<DoctorResponseFormProps> = ({
  visible,
  onCancel,
  requestData,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [, setFileList] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);


  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Create a string of file URLs
      const attachmentUrls = uploadedFiles.map(file => file.url).join(',');
      
      // Log for debugging
      console.log('Current uploadedFiles:', uploadedFiles);
      console.log('Submitting with attachments:', attachmentUrls);
      
      // Prepare payload
      const payload = {
        title: values.title,
        content: values.content,
        attachments: attachmentUrls
      };
      
      // Send response
      const response = await axiosInstance.post(`/response/send?requestId=${requestData.id}`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response from server:', response.data);
      
      message.success('Response sent successfully');
      form.resetFields();
      setFileList([]);
      setUploadedFiles([]);
      onSuccess();
      onCancel();
    } catch (error) {
      console.error('Submission error:', error);
      message.error('Failed to send response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <Modal
      open={visible}
      title={
        <Title level={4} style={{ margin: 0, color: colors.primary.main }}>
          Respond to Request
        </Title>
      }
      onCancel={onCancel}
      footer={null}
      width={700}
      style={{ top: 20 }}
      bodyStyle={{ padding: '24px' }}
    >
      <div style={{ marginBottom: '20px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>Request Title:</Text>
            <Text style={{ marginLeft: '8px' }}>{requestData?.title || 'N/A'}</Text>
          </div>
          
          <div>
            <Text strong>Description:</Text>
            <Text style={{ marginLeft: '8px' }}>{requestData?.description || 'N/A'}</Text>
          </div>
        </Space>
      </div>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ title: `Re: ${requestData?.title || ''}` }}
      >
        <Form.Item
          name="title"
          label="Response Title"
          rules={[{ required: true, message: 'Please enter a title' }]}
        >
          <Input placeholder="Enter title for your response" />
        </Form.Item>
        
        <Form.Item
          name="content"
          label="Response"
          rules={[{ required: true, message: 'Please enter your response' }]}
        >
          <TextArea 
            rows={8} 
            placeholder="Write your detailed response here..." 
            showCount 
            maxLength={2000} 
          />
        </Form.Item>
        
        {/* <Form.Item
          label="Attachments (Optional)"
          extra="Upload files to support your response. Maximum 5 files."
        >
          <Dragger {...uploadProps} disabled={uploading}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ color: colors.primary.light }} />
            </p>
            <p className="ant-upload-text">Click or drag files to this area to upload</p>
            <p className="ant-upload-hint">
              Support for images, PDFs, and document files.
            </p>
            {uploading && (
              <div style={{ marginTop: '10px' }}>
                <Spin size="small" /> Uploading...
              </div>
            )}
          </Dragger>
          

          {uploadedFiles.length > 0 && (
            <div style={{ marginTop: '8px', border: '1px solid #f0f0f0', padding: '8px', borderRadius: '4px' }}>
              <Text strong>Files ready to send:</Text>
              <ul style={{ margin: '4px 0 0 0', padding: '0 0 0 20px' }}>
                {uploadedFiles.map(f => (
                  <li key={f.uid}>
                    <Text type="secondary">
                      {f.name} - <Text code>{f.url}</Text>
                    </Text>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Form.Item> */}
        
        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SendOutlined />}
              loading={submitting}
              style={{ 
                borderRadius: '50px',
                paddingLeft: '20px',
                paddingRight: '20px',
                background: colors.primary.gradient,
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              Send Response
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DoctorResponseForm;