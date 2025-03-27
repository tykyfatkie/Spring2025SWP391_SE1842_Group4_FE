import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spin, Button, Typography, Layout, Card } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, ExclamationCircleFilled } from '@ant-design/icons';
import { verifyVnPayReturn } from '../../services/PaymentService'; 

const { Title, Text } = Typography;
const { Content } = Layout;

interface PaymentResultInfo {
  transactionId?: string;
  amount?: number;
  packageName?: string;
  paymentTime?: string;
  validUntil?: string;
}

const PaymentReturn: React.FC = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error' | 'warning'>('processing');
  const [message, setMessage] = useState<string>('');
  const [paymentInfo, setPaymentInfo] = useState<PaymentResultInfo>({});
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const processPayment = async () => {
      try {
        // Lấy query string từ URL hiện tại (chứa các tham số từ VNPay)
        const queryString = location.search;
        
        if (!queryString) {
          setStatus('warning');
          setMessage('Không tìm thấy thông tin thanh toán.');
          return;
        }
        
        // Gọi API xử lý kết quả thanh toán
        const response = await verifyVnPayReturn(queryString);
        
        if (response && response.success) {
          setStatus('success');
          setMessage(response.message || 'Thanh toán thành công!');
          if (response.data) {
            setPaymentInfo({
              transactionId: response.data.transactionId,
              amount: response.data.amount,
              packageName: response.data.packageName,
              paymentTime: response.data.paymentTime,
              validUntil: response.data.validUntil
            });
          }
        } else {
          setStatus('error');
          setMessage(response.message || 'Thanh toán thất bại.');
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Đã xảy ra lỗi khi xử lý thanh toán.');
      }
    };
    
    processPayment();
  }, [location]);
  
  // Render icon based on status
  const renderStatusIcon = () => {
    const iconSize = { fontSize: 72 };
    
    switch (status) {
      case 'success':
        return <CheckCircleFilled style={{ ...iconSize, color: '#52c41a' }} />;
      case 'error':
        return <CloseCircleFilled style={{ ...iconSize, color: '#f5222d' }} />;
      case 'warning':
        return <ExclamationCircleFilled style={{ ...iconSize, color: '#faad14' }} />;
      default:
        return null;
    }
  };

  // Render payment details if available
  const renderPaymentDetails = () => {
    if (status !== 'success' || !paymentInfo.packageName) {
      return null;
    }
    
    return (
      <Card style={{ maxWidth: 500, margin: '20px auto', textAlign: 'left' }}>
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">Gói đăng ký:</Text>
          <Title level={5} style={{ margin: 0 }}>{paymentInfo.packageName}</Title>
        </div>
        
        {paymentInfo.transactionId && (
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary">Mã giao dịch:</Text>
            <div>{paymentInfo.transactionId}</div>
          </div>
        )}
        
        {paymentInfo.amount && (
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary">Số tiền:</Text>
            <div>{new Intl.NumberFormat('vi-VN').format(paymentInfo.amount)} VND</div>
          </div>
        )}
        
        {paymentInfo.paymentTime && (
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary">Thời gian thanh toán:</Text>
            <div>{paymentInfo.paymentTime}</div>
          </div>
        )}
        
        {paymentInfo.validUntil && (
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary">Có hiệu lực đến:</Text>
            <div>{paymentInfo.validUntil}</div>
          </div>
        )}
      </Card>
    );
  };
  
  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content>
        <div style={{ padding: '50px 20px', textAlign: 'center' }}>
          {status === 'processing' ? (
            <div style={{ marginTop: 100 }}>
              <Spin size="large" />
              <Title level={3} style={{ marginTop: 20 }}>Đang xử lý thanh toán...</Title>
              <Text type="secondary">Vui lòng đợi trong giây lát</Text>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 24 }}>
                {renderStatusIcon()}
              </div>
              
              <Title level={2}>
                {status === 'success' ? 'Thanh toán thành công!' : 
                 status === 'warning' ? 'Cảnh báo' : 'Thanh toán thất bại'}
              </Title>
              
              <Text style={{ fontSize: 16, display: 'block', marginBottom: 30 }}>
                {message}
              </Text>
              
              {renderPaymentDetails()}
              
              <div style={{ marginTop: 32 }}>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => navigate('/dashboard')}
                  style={{ marginRight: 16 }}
                >
                  Quay về Trang chủ
                </Button>
                
                {status === 'error' && (
                  <Button 
                    onClick={() => navigate('/premium-subscription')}
                  >
                    Thử lại
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default PaymentReturn;
