import React, { useEffect } from "react";
import { Result, Button, Layout, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Title, Text } = Typography;

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard after 5 seconds
    const timer = setTimeout(() => {
      navigate("/home"); // Change to the relevant page
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Layout style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Content>
        <Result
          status="success"
          title={<Title level={2}>Payment Successful!</Title>}
          subTitle={
            <Text style={{ fontSize: 16 }}>
              Thank you for your purchase. Your premium plan is now activated. You will be redirected to your Home.
              shortly.
            </Text>
          }
          extra={[
            <Button type="primary" key="home" onClick={() => navigate("/home")}>
              Go to Home
            </Button>,
          ]}
        />
      </Content>
    </Layout>
  );
};

export default PaymentSuccessPage;
