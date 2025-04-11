import React, { useState } from 'react';
import { Modal, Input, Button, Form, Upload, message, Spin, Typography, Space } from 'antd';
import { SendOutlined, InboxOutlined } from '@ant-design/icons';
import axiosInstance from '../../utils/axiosInstance';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Dragger } = Upload;

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
  const [uploading, setUploading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const handleFileUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    
    const formData = new FormData();
    formData.append('file', file);
    
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await axiosInstance.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Check if the API returns file URL in response
      if (response.data && response.data.fileUrl) {
        // Add file to our uploadedFiles state
        const newFile = {
          uid: file.uid,
          name: file.name,
          url: response.data.fileUrl
        };
        
        setUploadedFiles(prev => [...prev, newFile]);
        
        // Call the onSuccess callback with the response data
        onSuccess(response.data);
        message.success(`${file.name} uploaded successfully`);
      } else {
        throw new Error('File upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error(`${file.name} upload failed.`);
      onError();
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Create a string of file URLs
      const attachmentUrls = uploadedFiles.map(file => file.url).join(',');
      
      // Prepare payload
      const payload = {
        title: values.title,
        content: values.content,
        attachments: uploadedFiles.map(file => file.url)
      };
      
      console.log('Submitting with attachments:', attachmentUrls);
      
      // Send response
      await axiosInstance.post(`/response/send?requestId=${requestData.id}`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
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

  const uploadProps = {
    name: 'file',
    multiple: true,
    customRequest: handleFileUpload,
    onChange(info: any) {
      // Update fileList state
      let newFileList = [...info.fileList];
      
      // Limit to 5 files
      newFileList = newFileList.slice(-5);
      
      // Update fileList state
      setFileList(newFileList);
    },
    fileList,
    showUploadList: {
      showRemoveIcon: true
    },
    onRemove: (file: any) => {
      // Remove from fileList
      const newFileList = fileList.filter(f => f.uid !== file.uid);
      setFileList(newFileList);
      
      // Remove from uploadedFiles
      setUploadedFiles(prev => prev.filter(f => f.uid !== file.uid));
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
        
        <Form.Item
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
          
          {/* Debug info to show attachments that will be sent */}
          {uploadedFiles.length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">
                Files ready to send: {uploadedFiles.map(f => f.name).join(', ')}
              </Text>
            </div>
          )}
        </Form.Item>
        
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