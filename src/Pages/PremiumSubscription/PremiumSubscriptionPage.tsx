import React, { useState } from 'react';
import { Card, Radio, Button, Form, Input, message, Row, Col, Typography, Layout } from 'antd';
import { CrownOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { RadioChangeEvent } from 'antd';
import GuestHeader from '../../components/Header/GuestHeader';

const { Title, Text } = Typography;
const { Content } = Layout;

interface PlanType {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
}

interface SubscriptionFormData {
  name: string;
  email: string;
  phone: string;
  planId: string;
}

const PremiumSubscriptionPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [form] = Form.useForm();

  const plans: PlanType[] = [
    {
      id: 'Basic',
      name: 'Basic Premium',
      price: 99000,
      duration: 'month',
      features: [
        '    Free medical examination 3 times',
        '    50% discount on medicine when purchased at the hospital',
        '    Have access to all features of the system',
        '    ',
        '    ',

      ],
    },
    {
      id: 'Standard',
      name: 'Standard Premium',
      price: 169000,
      duration: 'month',
      features: [
        '    Free medical examination 5 times',
        '    70% discount on medicine when purchased at the hospital',
        '    Have access to all features of the system',
        '    1:1 consulting support',
        '    ',

      ],
    },
    {
      id: 'Premium',
      name: 'Premium Plus',
      price: 199000,
      duration: 'month',
      features: [
        '    Free medical examination unlimited times',
        '    90% discount on medicine when purchased at the hospital',
        '    Have access to all features of the system',
        '    1:1 consulting support',
        '    Priority when going to the doctor',

      ],
    },
  ];

  const handlePlanChange = (e: RadioChangeEvent) => {
    setSelectedPlan(e.target.value);
  };

  const handleSubscribe = (planId: string) => {
    // Xử lý logic đăng ký ở đây
    message.success(`Đang chuyển đến trang thanh toán cho gói ${planId}`);
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px', width: '1420px' }}>
      <GuestHeader />
      <Content>
        <div className="p-6 max-w-6xl mx-auto">
          <Title level={2} className="text-center mb-8">
            <CrownOutlined className="mr-2" style={{ color: '#FFD700', marginLeft: '40px' }} />
            Đăng Ký Gói Premium
          </Title>

          <Row gutter={[24, 24]} className="mb-8" style={{marginLeft:'40px'}}>
            {plans.map((plan) => (
              <Col xs={24} md={7} key={plan.id} style={{margin:'10px'}}>
                <Card
                  className={`h-full ${
                    selectedPlan === plan.id ? 'border-blue-500 border-2' : ''
                  }`}
                  hoverable
                >
                  <Radio.Group onChange={handlePlanChange} value={selectedPlan}>
                    <Radio value={plan.id}>
                      <Title level={4}>{plan.name}</Title>
                    </Radio>
                  </Radio.Group>
                  
                  <div className="mt-4">
                    <Title level={3} className="mb-2">
                      {plan.price.toLocaleString()}đ
                      <Text className="text-gray-500 text-base">/{plan.duration}</Text>
                    </Title>
                    
                    <ul className="list-none p-0">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="mb-2">
                          <CheckCircleOutlined className="text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-6">
                      <Button 
                        type="primary" 
                        size="large" 
                        block
                        onClick={() => handleSubscribe(plan.id)}
                        style={{
                          background: '#1890ff',
                          borderColor: '#1890ff',
                          height: '48px',
                          fontSize: '16px',
                          fontWeight: 500
                        }}
                      >
                        Subscribe Now
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default PremiumSubscriptionPage;