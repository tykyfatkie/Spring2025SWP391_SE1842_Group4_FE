import React from "react";
import { 
  Button, 
  Spin, 
  Card, 
  Typography, 
  Row, 
  Col,
  Tabs,
  Table
} from "antd";
import { 
  UserOutlined, 
  CheckCircleOutlined, 
  PlusOutlined 
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

interface ChildProfilesLayoutProps {
  activeTab: string;
  handleTabChange: (key: string) => void;
  loading: boolean;
  archivedLoading: boolean;
  children: any[];
  archivedChildren: any[];
  activeColumns: any[];
  archivedColumns: any[];
  navigateToCreateChild: () => void;
}

const ChildProfilesLayout: React.FC<ChildProfilesLayoutProps> = ({
  activeTab,
  handleTabChange,
  loading,
  children,
  activeColumns,
  navigateToCreateChild
}) => {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={18}>
        <Card 
          title={
            <div style={{ padding: '8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                  <UserOutlined style={{ fontSize: '20px', color: '#1e3a8a' }} />
                </div>
                <Title level={4} style={{ margin: 0, color: '#1e3a8a' }}>Child Profiles</Title>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={navigateToCreateChild}
                style={{
                  background: '#1e3a8a',
                  borderColor: '#1e3a8a',
                  borderRadius: '8px',
                  height: '40px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 4px 6px rgba(30, 58, 138, 0.1)'
                }}
              >
                Create
              </Button>
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
          <Tabs 
            activeKey={activeTab} 
            onChange={handleTabChange}
            type="card"
            style={{ 
              marginBottom: '24px',
            }}
            tabBarStyle={{
              marginBottom: '16px'
            }}
          >
            <TabPane 
              tab={
                <span style={{ padding: '4px 8px', fontWeight: 500 }}>Active Children</span>
              } 
              key="active"
            >
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
                  <Spin size="large" />
                </div>
              ) : (
                <Table 
                  dataSource={children} 
                  columns={activeColumns} 
                  rowKey="id" 
                  pagination={{ pageSize: 10 }}
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }} 
                />
              )}
            </TabPane>

          </Tabs>
        </Card>
      </Col>
      
      <Col xs={24} lg={6}>
        <Card 
          style={{ 
            borderRadius: '16px', 
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
            border: 'none',
            background: 'linear-gradient(to bottom, #f0f7ff, #e6f0fd)'
          }}
          bodyStyle={{ padding: '24px' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: 'rgba(30, 58, 138, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 16px' 
            }}>
              <CheckCircleOutlined style={{ fontSize: '30px', color: '#1e3a8a' }} />
            </div>
            <Title level={4} style={{ color: '#1e3a8a', marginBottom: '8px' }}>Profile Management</Title>
          </div>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ 
              padding: '16px',
              background: 'white',
              borderRadius: '12px',
              marginBottom: '16px'
            }}>
              <Text strong style={{ display: 'block', marginBottom: '8px', color: '#1e3a8a' }}>Keep Profiles Updated</Text>
              <Text style={{ color: '#4b5563', fontSize: '14px' }}>
                Regularly update your child's measurements to get the most accurate growth analysis.
              </Text>
            </div>
            
            <div style={{ 
              padding: '16px',
              background: 'white',
              borderRadius: '12px',
              marginBottom: '16px'
            }}>
              <Text strong style={{ display: 'block', marginBottom: '8px', color: '#1e3a8a' }}>BMI Tracking</Text>
              <Text style={{ color: '#4b5563', fontSize: '14px' }}>
                Monitor your child's BMI and growth patterns over time using the BMI tracking feature.
              </Text>
            </div>
            
            <div style={{ 
              padding: '16px',
              background: 'white',
              borderRadius: '12px'
            }}>
              <Text strong style={{ display: 'block', marginBottom: '8px', color: '#1e3a8a' }}>Multiple Profile Support</Text>
              <Text style={{ color: '#4b5563', fontSize: '14px' }}>
                Manage profiles for all your children in one convenient location.
              </Text>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ChildProfilesLayout;
