import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Button, Typography, Layout, Spin, message } from "antd";
import { CheckCircleOutlined, CrownOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Content } = Layout;

interface PackageType {
  id: string;
  packageName: string;
  price: number;
  durationMonths: number;
  maxChildrenAllowed: number;
  trialPeriodDays: number;
  status: number;
}

const PremiumSubscriptionPage: React.FC = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/user-packages/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter only active packages (status === 2)
      if (response.data && response.data.data) {
        const activePackages = response.data.data.filter((pkg: PackageType) => pkg.status === 1);
        setPackages(activePackages);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      message.error("Failed to fetch packages.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (packageId: string, price: number) => {
    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}/payment/vnpay`,
        {
          packageId,
          amount: price,
          description: "Subscription to premium package",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        window.location.href = response.data;
      }
    } catch (error) {
      console.error("Payment error:", error);
      message.error("Failed to initiate payment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", margin: "-25px" }}>
      <Content>
        <div style={{ padding: 20, maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <Title level={2}>
            <CrownOutlined style={{ color: "#FFD700", marginRight: 8 }} />
            Choose Your Premium Plan
          </Title>
          <Text style={{ color: "#666" }}>
            Unlock exclusive benefits and take full advantage of our system with a Premium plan.
          </Text>

          {loading ? (
            <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
          ) : (
            packages.map((plan) => (
              <Card
                key={plan.id}
                style={{
                  border: "2px solid #1890ff",
                  marginTop: 20,
                  textAlign: "left",
                  padding: 20,
                  borderRadius: 10,
                }}
              >
                <Title level={4} style={{ color: "#1890ff" }}>
                  <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                  {plan.packageName}
                </Title>
                <Title level={3} style={{ color: "#1890ff" }}>
                  ${plan.price.toFixed(2)}
                  <Text style={{ fontSize: 16, color: "#666" }}> / {plan.durationMonths} month(s)</Text>
                </Title>

                <ul style={{ paddingLeft: 20, fontSize: 16, color: "#444" }}>
                  <li>✅ Includes essential features for child growth tracking.</li>
                  <li>✅ {plan.maxChildrenAllowed} children allowed</li>
                  <li>✅ {plan.trialPeriodDays} trial days</li>
                </ul>

                <Button
                  type="primary"
                  block
                  loading={submitting}
                  style={{
                    marginTop: 20,
                    height: 50,
                    fontSize: 16,
                    fontWeight: "bold",
                    backgroundColor: "#1890ff",
                    borderColor: "#1890ff",
                  }}
                  onClick={() => handleSubscribe(plan.id, plan.price)}
                >
                  Subscribe Now
                </Button>
              </Card>
            ))
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default PremiumSubscriptionPage;
