import React, { useState, useEffect } from 'react';
import { Layout, Card, Select, Spin, message, Typography, Tag, Row, Col, Space, Button, Modal, Form, Input } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';
import Sidebar from '../../components/Sidebar/Sidebar';
import { CheckCircleOutlined, LineChartOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import BMIPDFExport from './BMIPDFExport'; 
import SingleBMIExport from './SingleBMIExport';


const { Content } = Layout;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

interface Child {
  id: string;
  name: string;
  doB: string;
  gender: number;
  weight: number;
  height: number;
  bmi: number;
  bmiPercentile: number;
}

interface BMIRecord {
  id: string;
  childrentId: string;
  weight: number;
  height: number;
  bmi: number;
  bmiPercentile: number;
  createdAt: string;
}

interface ChartData {
  dateTime: string;
  date: string;
  bmi: number;
  weight: number;
  height: number;
  percentile: number;
}

const BMITrackingPage: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [selectedChildData, setSelectedChildData] = useState<Child | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchingBMI, setFetchingBMI] = useState<boolean>(false);
  const [bmiModalVisible, setBmiModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  // Function to get BMI category
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: '#91caff' };
    if (bmi < 25) return { label: 'Normal', color: '#52c41a' };
    if (bmi < 30) return { label: 'Overweight', color: '#faad14' };
    return { label: 'Obese', color: '#ff4d4f' };
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchBMIData(selectedChild);
      const childData = children.find(child => child.id === selectedChild) || null;
      setSelectedChildData(childData);
    }
  }, [selectedChild, children]);

  const fetchChildren = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Authentication token missing. Please login again.");
        return;
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/children/getChildByToken`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      if (response.data?.data && Array.isArray(response.data.data)) {
        setChildren(response.data.data.map((child: any) => ({
          id: child.id,
          name: child.name || `Child ${child.id.substring(0, 8)}`,
          doB: child.doB,
          gender: child.gender,
          weight: child.weight,
          height: child.height,
          bmi: child.bmi,
          bmiPercentile: child.bmiPercentile
        })));
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (error: any) {
      console.error("Error fetching children:", error);
      message.error(error.response?.data?.message || "Failed to load children data");
    } finally {
      setLoading(false);
    }
  };

  const fetchBMIData = async (childId: string) => {
    setFetchingBMI(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Authentication token missing. Please login again.");
        return;
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}/bmi/tracking?childId=${childId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      if (response.data?.value?.data && Array.isArray(response.data.value.data)) {
        setChartData(response.data.value.data.map((record: BMIRecord) => ({
          dateTime: record.createdAt,
          date: new Date(record.createdAt).toLocaleDateString(),
          bmi: record.bmi,
          weight: record.weight,
          height: record.height,
          percentile: record.bmiPercentile
        })).sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()));
      } else {
        throw new Error("Invalid BMI data format received");
      }
    } catch (error: any) {
      console.error("Error fetching BMI data:", error);
      message.error(error.response?.data?.message || "Failed to load BMI tracking data");
      setChartData([]);
    } finally {
      setFetchingBMI(false);
    }
  };

  const handleOpenBmiModal = () => {
    if (!selectedChild || !selectedChildData) {
      message.error("Please select a child first.");
      return;
    }
    setBmiModalVisible(true);
    form.resetFields();
  };

  const handleSaveBMI = async () => {
    try {
      if (!selectedChild || !selectedChildData) {
        message.error("No child selected");
        return;
      }

      const values = await form.validateFields();
      const token = localStorage.getItem("token");

      if (!token) {
        message.error("Authentication information missing. Please login again.");
        return;
      }

      // Calculate age in months from date of birth
      const ageInMonths = moment().diff(moment(selectedChildData.doB, "YYYY-MM-DD"), "months");

      const payload = {
        childId: selectedChild,
        height: Number(values.height),
        weight: Number(values.weight),
        ageInMonths: ageInMonths,
        gender: selectedChildData.gender,
        notes: values.notes?.trim() || "",
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/bmi/save`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        message.success("BMI record saved successfully!");
        setBmiModalVisible(false);
        
        // Fetch updated BMI data after saving
        await fetchBMIData(selectedChild);
        
        // Optionally, show prompt to export the newly added record
        Modal.confirm({
          title: 'BMI Record Saved',
          content: 'Would you like to export this BMI record as a PDF?',
          okText: 'Yes, Export',
          cancelText: 'No, Thanks',
          onOk: () => {
            // Need to get the latest record after the fetch
            const latestRecord = chartData[chartData.length - 1];
            if (latestRecord && selectedChildData) {
              const singleExport = new SingleBMIExport({
                childData: selectedChildData,
                bmiRecord: latestRecord
              });
              singleExport.generatePDF();
            }
          }
        });
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || "Failed to save BMI record.");
      console.error("Error saving BMI record:", error);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: "-25px", background: 'white', marginRight: '25px' }}>
      <Layout>
        <Sidebar />
        <Content style={{ padding: '24px', background: '#f8fafc' }}>
          {/* Header Section */}
          <div style={{ 
            marginBottom: '40px', 
            background: '#1e3a8a', 
            padding: '48px 32px', 
            borderRadius: '20px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Decorative elements */}
            <div style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              top: '-100px',
              left: '-100px',
            }} />
            <div style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              bottom: '-50px',
              right: '50px',
            }} />
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ 
                display: 'inline-block', 
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                marginBottom: '16px'
              }}>
                <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>BMI MANAGEMENT</span>
              </div>
              
              <Title level={2} style={{ color: 'white', marginBottom: '16px', fontWeight: 700 }}>
                Track and Manage Your Child's BMI
              </Title>
              <Paragraph style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.9)', maxWidth: '700px' }}>
                Monitor your child's Body Mass Index (BMI) over time. This tracking tool helps you visualize growth patterns
                and ensure healthy development according to WHO standards.
              </Paragraph>
              
              <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <Text style={{ color: 'white' }}>Visualize BMI trends over time</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <Text style={{ color: 'white' }}>Compare with WHO standard percentiles</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircleOutlined style={{ color: '#3b82f6', marginRight: '12px' }} />
                  <Text style={{ color: 'white' }}>Record new BMI measurements easily</Text>
                </div>
              </Space>
            </div>
          </div>

          <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
              <Card 
                title={
                  <div style={{ padding: '8px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        background: 'rgba(30, 58, 138, 0.1)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginRight: '16px' 
                      }}>
                        <LineChartOutlined style={{ fontSize: '20px', color: '#1e3a8a' }} />
                      </div>
                      <Title level={4} style={{ margin: 0, color: '#1e3a8a' }}>Select Child</Title>
                    </div>
                  </div>
                }
                style={{ 
                  borderRadius: '16px', 
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                  border: 'none',
                  height: '100%'
                }}
                headStyle={{ 
                  borderBottom: '1px solid #f0f0f0',
                  padding: '16px 24px'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Spin size="large" />
                  </div>
                ) : (
                  <>
                    <Paragraph style={{ marginBottom: '20px', color: '#4b5563' }}>
                      Select a child to view their BMI history and track their growth over time.
                    </Paragraph>
                    <Select
                      placeholder="Select a child"
                      style={{ width: '100%', borderRadius: '8px', height: '45px', marginBottom: '20px' }}
                      onChange={(value) => setSelectedChild(value)}
                      value={selectedChild}
                      size="large"
                    >
                      {children.map((child) => (
                        <Option key={child.id} value={child.id}>
                          {child.name}
                        </Option>
                      ))}
                    </Select>
                    
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        size="large" 
                        style={{ width: '100%', height: '45px', borderRadius: '8px' }}
                        onClick={handleOpenBmiModal}
                        disabled={!selectedChild}
                      >
                        Add New BMI Record
                      </Button>
                      
                      {/* BMI Export options */}
                      {selectedChild && selectedChildData && (
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                          <BMIPDFExport 
                            childData={selectedChildData} 
                            bmiRecords={chartData}
                          />
                          
                          {/* Add the single record export button if there are records */}
                          {chartData.length > 0 && (
                            <SingleBMIExport 
                              childData={selectedChildData}
                              bmiRecord={chartData[chartData.length - 1]} // Use the most recent record
                            />
                          )}
                        </Space>
                      )}
                    </Space>
                  </>
                )}
              </Card>
            </Col>

            <Col xs={24} md={16}>
              {selectedChild && (
                <Card 
                  title={
                    <div style={{ padding: '8px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          background: 'rgba(30, 58, 138, 0.1)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          marginRight: '16px' 
                        }}>
                          <LineChartOutlined style={{ fontSize: '20px', color: '#1e3a8a' }} />
                        </div>
                        <Title level={4} style={{ margin: 0, color: '#1e3a8a' }}>BMI History</Title>
                      </div>
                    </div>
                  }
                  style={{ 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                    border: 'none'
                  }}
                  headStyle={{ 
                    borderBottom: '1px solid #f0f0f0',
                    padding: '16px 24px'
                  }}
                  bodyStyle={{ padding: '24px' }}
                >
                  {fetchingBMI ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                      <Spin size="large" />
                    </div>
                  ) : chartData.length > 0 ? (
                    <>
                      <div style={{ 
                        marginBottom: '20px', 
                        background: 'rgba(30, 58, 138, 0.05)', 
                        padding: '16px', 
                        borderRadius: '12px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        <Text strong style={{ marginRight: '12px', fontSize: '14px' }}>BMI Categories: </Text>
                        <Tag color="#91caff" style={{ borderRadius: '20px', padding: '0 12px' }}>Underweight (&lt; 18.5)</Tag>
                        <Tag color="#52c41a" style={{ borderRadius: '20px', padding: '0 12px' }}>Normal (18.5-24.9)</Tag>
                        <Tag color="#faad14" style={{ borderRadius: '20px', padding: '0 12px' }}>Overweight (25-29.9)</Tag>
                        <Tag color="#ff4d4f" style={{ borderRadius: '20px', padding: '0 12px' }}>Obese (&ge; 30)</Tag>
                      </div>

                      <div style={{ 
                        background: 'white', 
                        borderRadius: '12px', 
                        padding: '24px', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' 
                      }}>
                        <ResponsiveContainer width="100%" height={400}>
                          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" label={{ value: 'Date', position: 'insideBottom', offset: -5 }} />
                            <YAxis domain={['auto', 'auto']} label={{ value: 'BMI', angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="bmi" name="BMI" stroke="#1e3a8a" activeDot={{ r: 8 }} strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </>
                  ) : (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '50px',
                      background: 'rgba(30, 58, 138, 0.05)',
                      borderRadius: '12px'
                    }}>
                      <Text>No BMI tracking data available for this child.</Text>
                      <div style={{ marginTop: '20px' }}>
                        <Button 
                          type="primary" 
                          icon={<PlusOutlined />}
                          onClick={handleOpenBmiModal}
                        >
                          Add First BMI Record
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </Col>
          </Row>

          {selectedChild && chartData.length > 0 && (
            <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
              <Col xs={24}>
                <Card 
                  title={
                    <div style={{ padding: '8px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '50%', 
                          background: 'rgba(30, 58, 138, 0.1)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          marginRight: '16px' 
                        }}>
                          <CheckCircleOutlined style={{ fontSize: '20px', color: '#1e3a8a' }} />
                        </div>
                        <Title level={4} style={{ margin: 0, color: '#1e3a8a' }}>BMI Details</Title>
                      </div>
                    </div>
                  }
                  style={{ 
                    borderRadius: '16px', 
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
                    border: 'none'
                  }}
                  headStyle={{ 
                    borderBottom: '1px solid #f0f0f0',
                    padding: '16px 24px'
                  }}
                  bodyStyle={{ padding: '24px' }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ 
                          textAlign: 'left', 
                          padding: '12px 16px', 
                          borderBottom: '1px solid #f0f0f0',
                          color: '#1e3a8a',
                          fontWeight: 600
                        }}>Date</th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '12px 16px', 
                          borderBottom: '1px solid #f0f0f0',
                          color: '#1e3a8a',
                          fontWeight: 600
                        }}>Weight (kg)</th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '12px 16px', 
                          borderBottom: '1px solid #f0f0f0',
                          color: '#1e3a8a',
                          fontWeight: 600
                        }}>Height (cm)</th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '12px 16px', 
                          borderBottom: '1px solid #f0f0f0',
                          color: '#1e3a8a',
                          fontWeight: 600
                        }}>BMI</th>
                        <th style={{ 
                          textAlign: 'center', 
                          padding: '12px 16px', 
                          borderBottom: '1px solid #f0f0f0',
                          color: '#1e3a8a',
                          fontWeight: 600
                        }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.map((record, index) => {
                        const category = getBMICategory(record.bmi);
                        return (
                          <tr key={index} style={{ background: index % 2 === 0 ? '#f8fafc' : 'white' }}>
                            <td style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>{record.date}</td>
                            <td style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>{record.weight.toFixed(1)}</td>
                            <td style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>{record.height.toFixed(1)}</td>
                            <td style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontWeight: 600 }}>{record.bmi.toFixed(1)}</td>
                            <td style={{ textAlign: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                              <Tag color={category.color} style={{ borderRadius: '20px', padding: '0 12px' }}>
                                {category.label}
                              </Tag>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </Card>
              </Col>
            </Row>
          )}
        </Content>
      </Layout>

      {/* Modal for adding new BMI record */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: 'rgba(30, 58, 138, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: '16px' 
            }}>
              <PlusOutlined style={{ fontSize: '16px', color: '#1e3a8a' }} />
            </div>
            <span>Add New BMI Record</span>
          </div>
        }
        visible={bmiModalVisible}
        onCancel={() => setBmiModalVisible(false)}
        onOk={handleSaveBMI}
        okText="Save Record"
        okButtonProps={{ style: { background: '#1e3a8a' } }}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Child's Name">
            <Input value={selectedChildData?.name} disabled style={{ background: '#f8fafc' }} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Gender">
                <Input value={selectedChildData?.gender === 0 ? "Male" : "Female"} disabled style={{ background: '#f8fafc' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Age (Months)">
                <Input 
                  value={selectedChildData?.doB ? moment().diff(moment(selectedChildData.doB, "YYYY-MM-DD"), "months") : ""} 
                  disabled 
                  style={{ background: '#f8fafc' }} 
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
            <Form.Item 
              name="height" 
              label="Height (cm)" 
              rules={[
                { required: true, message: "Please enter height!" },
                { 
                  validator: (_, value) => {
                    const num = parseFloat(value);
                    if (isNaN(num) || num < 1 || num > 300) {
                      return Promise.reject('Height must be between 1-300 cm');
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input type="number" placeholder="Enter height" step="0.1" />
            </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item 
              name="weight" 
              label="Weight (kg)" 
              rules={[
                { required: true, message: "Please enter weight!" },
                { 
                  validator: (_, value) => {
                    const num = parseFloat(value);
                    if (isNaN(num) || num < 0.1 || num > 300) {
                      return Promise.reject('Weight must be between 0.1-300 kg');
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input type="number" placeholder="Enter weight" step="0.1" />
            </Form.Item>
            </Col>
          </Row>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea placeholder="Additional notes (optional)" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default BMITrackingPage;