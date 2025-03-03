import React, { useState, useEffect } from 'react';
import { 
  Form, 
  Input, 
  InputNumber, 
  DatePicker, 
  Button, 
  Typography, 
  Card, 
  Select, 
  message, 
  Space,
  Layout,
  Table,
  Modal,
  Empty,
  Alert
} from 'antd';
import { EditOutlined, ReloadOutlined } from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Sidebar from '../../components/Sidebar/Sidebar'; // Imported Sidebar component

const { Content } = Layout;
const { Title } = Typography;
const { Option } = Select;

const API_BASE_URL = 'https://localhost:7217';

interface ChildProfile {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  weight: number;
  height: number;
}

const EditChildPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [childrenList, setChildrenList] = useState<ChildProfile[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [fetchingChildren, setFetchingChildren] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    setFetchingChildren(true);
    setApiError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/children`);
      setChildrenList(response.data);
    } catch (error: any) {
      setApiError(`Failed to fetch children: ${error.message || 'Unknown error'}`);
      setChildrenList([]);
    } finally {
      setFetchingChildren(false);
    }
  };

  const handleEditChild = (child: ChildProfile) => {
    setSelectedChild(child);
    form.setFieldsValue({
      name: child.name,
      dateOfBirth: child.dateOfBirth ? moment(child.dateOfBirth, 'DD-MM-YYYY') : null,
      gender: child.gender,
      weight: child.weight,
      height: child.height
    });
    setEditModalVisible(true);
  };

  const calculateBMI = () => {
    const weight = form.getFieldValue('weight');
    const height = form.getFieldValue('height');
    
    if (weight && height && height > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      form.setFieldsValue({ bmi: parseFloat(bmi.toFixed(1)) });
    } else {
      form.setFieldsValue({ bmi: 0 });
    }
  };

  const updateChildProfile = async (values: any) => {
    if (!selectedChild) return;
    
    setLoading(true);
    
    try {
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth ? moment(values.dateOfBirth).format('YYYY-MM-DD') : ''
      };
      
      await axios.put(`${API_BASE_URL}/update/${selectedChild.id}`, formattedValues);
      
      message.success('Child profile updated successfully!');
      setEditModalVisible(false);
      fetchChildren();
    } catch (error: any) {
      message.error(`Failed to update child profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px', width: '1420px' }}>
      <Header />
      <Layout>
        <Sidebar />
        <Content style={{ padding: '24px' }}>
          <Card title="Edit Child Profile" style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4}>Select a Child to Edit</Title>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={fetchChildren} 
                loading={fetchingChildren}
              >
                Refresh
              </Button>
            </div>
            {apiError && (
              <Alert message="API Error" description={apiError} type="error" showIcon style={{ marginBottom: '16px' }} />
            )}
            <Table 
              dataSource={childrenList} 
              columns={[
                {
                  title: 'Name',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Date of Birth',
                  dataIndex: 'dateOfBirth',
                  key: 'dateOfBirth',
                },
                {
                  title: 'Gender',
                  dataIndex: 'gender',
                  key: 'gender',
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: (_: any, record: ChildProfile) => (
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditChild(record)}>
                      Edit
                    </Button>
                  ),
                },
              ]} 
              rowKey="id" 
              loading={fetchingChildren}
              pagination={{ pageSize: 5 }}
              locale={{
                emptyText: (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data available" />
                )
              }}
            />
          </Card>
          <Modal
            title="Edit Child Profile"
            open={editModalVisible}
            onCancel={() => setEditModalVisible(false)}
            footer={null}
            width={800}
          >
            <Form form={form} layout="vertical" onFinish={updateChildProfile}>
              <Form.Item name="name" label="Child's Name" rules={[{ required: true, message: 'Please enter the child\'s name' }]}> 
                <Input placeholder="Enter child's name" /> 
              </Form.Item>
              <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true, message: 'Please select date of birth' }]}> 
                <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" placeholder="DD-MM-YYYY" />
              </Form.Item>
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={loading}> Update Profile </Button>
                  <Button onClick={() => setEditModalVisible(false)}> Cancel </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </Content>
      </Layout>
      <Footer />
    </Layout>
  );
};

export default EditChildPage;
