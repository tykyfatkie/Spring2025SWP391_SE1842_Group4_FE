import { Card, Switch, Select, Form, Input } from "antd";
import { useState } from "react";

const SettingPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <Card title="Cài đặt" style={{ maxWidth: 500 }}>
      <Form layout="vertical">
        <Form.Item label="Tên hiển thị">
          <Input placeholder="Nhập tên" />
        </Form.Item>
        <Form.Item label="Chọn ngôn ngữ">
          <Select defaultValue="vi">
            <Select.Option value="vi">Tiếng Việt</Select.Option>
            <Select.Option value="en">English</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Dark Mode">
          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            checkedChildren="Bật"
            unCheckedChildren="Tắt"
          />
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SettingPage;
