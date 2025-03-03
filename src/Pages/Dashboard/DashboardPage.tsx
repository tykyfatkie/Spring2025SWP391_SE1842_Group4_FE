import React from "react";
import { Card, Table, Typography } from "antd";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const { Title } = Typography;

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const columns = [
  { title: "ID", dataIndex: "id", key: "id" },
  { title: "Tên", dataIndex: "name", key: "name" },
  { title: "Email", dataIndex: "email", key: "email" },
];

const users = [
  { id: 1, name: "Nguyễn Văn A", email: "a@example.com" },
  { id: 2, name: "Trần Thị B", email: "b@example.com" },
  { id: 3, name: "Lê Văn C", email: "c@example.com" },
];

const   DashboardPage: React.FC = () => {
  return (
    <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
      <Title level={3}>Dashboard</Title>

      {/* Biểu đồ */}
      <Card title="Thống kê" style={{ width: "50%" }}>
        <ResponsiveContainer width={300} height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Bảng danh sách người dùng */}
      <Card title="Danh sách người dùng">
        <Table dataSource={users} columns={columns} rowKey="id" />
      </Card>
    </div>
  );
};

export default DashboardPage;
