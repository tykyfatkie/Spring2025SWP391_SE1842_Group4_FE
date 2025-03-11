import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Button, message, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Option } = Select;

const UpdateDoctorProfile: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) {
          throw new Error("Unauthorized: Please log in");
        }

        const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/doctors/doctorprofile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.data) {
          throw new Error("No doctor profile found");
        }

        form.setFieldsValue(result.data);
      } catch (error: any) {
        message.error(error.message);
      }
    };

    fetchDoctorProfile();
  }, [form]);

  const handleUpdateProfile = async (values: any) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        throw new Error("Unauthorized: Please log in");
      }

      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/doctors/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      message.success('Hồ sơ cập nhật thành công!');
      navigate('/doctor/profile');
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', padding: '20px' }}>
      <Content style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>Cập nhật hồ sơ bác sĩ</h2>
        <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
          <Form.Item name="specialize" label="Chuyên khoa" rules={[{ required: true, message: 'Vui lòng nhập chuyên khoa!' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="hospital" label="Phòng khám">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input type="email" />
          </Form.Item>
          <Form.Item name="profileImg" label="Ảnh đại diện">
            <Upload>
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
          </Form.Item>
          <Form.Item name="certificate" label="Chứng chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="licenseNumber" label="Số giấy phép">
            <Input />
          </Form.Item>
          <Form.Item name="biography" label="Tiểu sử">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="metadata" label="Thông tin thêm">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Option value={0}>Không hoạt động</Option>
              <Option value={1}>Hoạt động</Option>
            </Select>
          </Form.Item>
          <Form.Item name="degrees" label="Bằng cấp">
            <Input />
          </Form.Item>
          <Form.Item name="research" label="Nghiên cứu">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="languages" label="Ngôn ngữ">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default UpdateDoctorProfile;
