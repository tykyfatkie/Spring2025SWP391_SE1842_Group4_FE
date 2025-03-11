import { useState } from "react";
import { Form, Input, InputNumber, Button, message, Card } from "antd";
import axios from "axios";

const PackagesPage = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      await axios.post(`${import.meta.env.VITE_API_ENDPOINT}/user-packages/create`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Package created successfully!");
      form.resetFields();
    } catch (error) {
      message.error("Failed to create package.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="Create New Package" style={{ maxWidth: 600, margin: "auto", marginTop: 20 }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <Form.Item name="packageName" label="Package Name" rules={[{ required: true, message: "Please enter package name" }]}>
          <Input placeholder="Package Name" />
        </Form.Item>

        <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please enter description" }]}>
          <Input.TextArea placeholder="Description" />
        </Form.Item>

        <Form.Item name="price" label="Price ($)" rules={[{ required: true, message: "Please enter price" }]}>
          <InputNumber placeholder="Price" style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item name="durationMonths" label="Duration (Months)" rules={[{ required: true, message: "Please enter duration" }]}>
          <InputNumber placeholder="Duration (Months)" style={{ width: "100%" }} min={1} />
        </Form.Item>

        <Form.Item name="trialPeriodDays" label="Trial Period (Days)" rules={[{ required: true, message: "Please enter trial period" }]}>
          <InputNumber placeholder="Trial Period (Days)" style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item name="maxChildrentAllowed" label="Max Children Allowed" rules={[{ required: true, message: "Please enter max children allowed" }]}>
          <InputNumber placeholder="Max Children Allowed" style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={submitting} block>
          Create Package
        </Button>
      </Form>
    </Card>
  );
};

export default PackagesPage;
