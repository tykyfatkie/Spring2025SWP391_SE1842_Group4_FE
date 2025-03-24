import React from 'react';
import { Row, Col, Card, Typography, Tag, Space, Button } from 'antd';
import { PlusOutlined, LineChartOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface BMISummaryRowProps {
  loading: boolean;
  children: any[];
  selectedChild: string | null;
  selectedChildData: any | null;
  chartData: any[];
  handleOpenBmiModal: () => void;
  setSelectedChild: (value: string) => void;
  BMIPDFExport: any;
  SingleBMIExport: any;
  fetchingBMI: boolean;
}

const BMISummaryRow: React.FC<BMISummaryRowProps> = ({
  loading,
  children,
  selectedChild,
  selectedChildData,
  chartData,
  handleOpenBmiModal,
  setSelectedChild,
  BMIPDFExport,
  SingleBMIExport,
  fetchingBMI
}) => {
  return (
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
              <span className="ant-spin-dot ant-spin-dot-spin">
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
                <i className="ant-spin-dot-item"></i>
              </span>
            </div>
          ) : (
            <>
              <Paragraph style={{ marginBottom: '20px', color: '#4b5563' }}>
                Select a child to view their BMI history and track their growth over time.
              </Paragraph>
              <select
                style={{ 
                  width: '100%', 
                  borderRadius: '8px',
                  height: '45px', 
                  marginBottom: '20px',
                  padding: '0 11px',
                  border: '1px solid #d9d9d9'
                }}
                onChange={(e) => setSelectedChild(e.target.value)}
                value={selectedChild || ''}
              >
                <option value="">Select a child</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
              </select>
              
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  size="large" 
                  style={{ 
                    width: '100%', 
                    height: '45px', 
                    borderRadius: '8px',
                    backgroundColor: '#1e3a8a'
                  }}
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
                <span className="ant-spin-dot ant-spin-dot-spin">
                  <i className="ant-spin-dot-item"></i>
                  <i className="ant-spin-dot-item"></i>
                  <i className="ant-spin-dot-item"></i>
                  <i className="ant-spin-dot-item"></i>
                </span>
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
                  {/* LineChart implementation would be here - using placeholder text */}
                  <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Chart will be rendered here with recharts</Text>
                  </div>
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
                    style={{ backgroundColor: '#1e3a8a' }}
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
  );
};

export default BMISummaryRow;