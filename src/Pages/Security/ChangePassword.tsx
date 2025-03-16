import { useState } from "react";
import { Form, Input, Button, message, Card } from "antd";
import axios from "axios";

const ChangePasswordPage = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleChangePassword = async (values) => {
    setSubmitting(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setSubmitting(false);
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/user/change-password`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      message.success("Password changed successfully!");
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to change password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}>
      <Card title="Change Password">
        <Form form={form} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: "Please enter your current password." }]}
          >
            <Input.Password placeholder="Enter current password" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter a new password." },
              { min: 6, message: "Password must be at least 6 characters long." },
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password." },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match."));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={submitting} block>
            Change Password
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;
