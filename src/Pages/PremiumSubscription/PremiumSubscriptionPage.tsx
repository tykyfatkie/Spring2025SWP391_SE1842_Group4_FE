import React, { useState, useEffect } from "react";
import { Card, Button, Typography, Layout, Spin, message, Badge } from "antd";
import { CheckCircleOutlined, CrownOutlined } from "@ant-design/icons";
import { initiateVnPayPayment } from "../../services/PaymentService";

const { Title, Text } = Typography;
const { Content } = Layout;

interface PackageType {
  id: string;
  packageName: string;
  price: number;
  durationMonths: number;
  maxChildrenAllowed: number;
  status: number;
}

const PremiumSubscriptionPage: React.FC = () => {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittingPackageId, setSubmittingPackageId] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/user-packages/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch packages");
      }

      const responseData = await response.json();

      if (responseData && responseData.data) {
        const activePackages = responseData.data.filter((pkg: PackageType) => pkg.status === 1);
        // Sort packages by price (ascending)
        const sortedPackages = [...activePackages].sort((a, b) => a.price - b.price);
        setPackages(sortedPackages);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      message.error("Unable to load service packages.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (packageId: string, price: number) => {
    setSubmitting(true);
    setSubmittingPackageId(packageId);

    try {
      // Find package information in the packages list
      const selectedPackage = packages.find(pkg => pkg.id === packageId);
      if (!selectedPackage) {
        throw new Error("Package information not found");
      }

      // Call service to create payment request
      const paymentUrl = await initiateVnPayPayment({
        packageId,
        amount: price,
        description: `Subscribe to ${selectedPackage.packageName} for ${selectedPackage.durationMonths} months`,
      });

      // Redirect to payment page
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      message.error(error.message || "Error creating payment transaction.");
    } finally {
      setSubmitting(false);
      setSubmittingPackageId(null);
    }
  };

  // Define package colors based on tier
  const getPackageColor = (index: number) => {
    const colors = [
      { primary: "#00b8d4", gradient: "linear-gradient(135deg, #00b8d4 0%, #0091ea 100%)" },
      { primary: "#7b1fa2", gradient: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)" },
      { primary: "#f57c00", gradient: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)" },
      { primary: "#d32f2f", gradient: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)" }
    ];
    return colors[index % colors.length];
  };

  const getPackageLabel = (index: number) => {
    const labels = ["Basic", "Standard", "Premium", "Special"];
    return labels[index % labels.length];
  };

  return (
    <Layout style={{ minHeight: "100vh", margin:'-25px', background: "linear-gradient(135deg, #6e45e2 0%, #88d3ce 100%)" }}>
      <Content>
        <div style={{ padding: 40, maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
          <Title level={1} style={{ color: "#fff", marginBottom: 8 }}>
            Service Packages
          </Title>
          <Text style={{ color: "#eef2ff", fontSize: 16, display: "block", maxWidth: 800, margin: "0 auto 40px" }}>
            Unlock exclusive features and maximize our system with the Premium package. Choose the package that best suits your needs.
          </Text>

          {loading ? (
            <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20 }}>
              {packages.map((plan, index) => {
                const colorScheme = getPackageColor(index);
                const packageLabel = getPackageLabel(index);
                const isLoadingThisPackage = submitting && submittingPackageId === plan.id;
                
                return (
                  <Card
                    key={plan.id}
                    style={{
                      width: 260,
                      border: 0,
                      marginTop: 20,
                      textAlign: "center",
                      borderRadius: 16,
                      overflow: "hidden",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      background: "#fff",
                      position: "relative",
                    }}
                    bodyStyle={{ padding: 0 }}
                  >
                    <div
                      style={{
                        background: colorScheme.gradient,
                        padding: "30px 20px 50px",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 10,
                          left: -30,
                          backgroundColor: colorScheme.primary,
                          color: "#fff",
                          padding: "5px 30px 5px 30px",
                          transform: "rotate(-45deg)",
                          fontWeight: "bold",
                          zIndex: 1,
                          borderRadius: "0 0 5px 5px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                          fontSize: 12,
                        }}
                      >
                        {packageLabel}
                      </div>
                      <Title level={1} style={{ color: "#fff", margin: 0, fontWeight: "bold" }}>
                        {new Intl.NumberFormat("vi-VN").format(plan.price)}
                        <span style={{ fontSize: 16, fontWeight: "normal", verticalAlign: "top" }}> VND</span>
                      </Title>
                      <Text style={{ fontSize: 14, color: "#eef2ff" }}>for {plan.durationMonths} months</Text>
                    </div>

                    <div style={{ padding: "24px 20px" }}>
                      <Title level={4} style={{ marginBottom: 20 }}>
                        {plan.packageName}
                      </Title>

                      <ul style={{ listStyleType: "none", padding: 0, margin: 0, textAlign: "left", height: 200 }}>
                        <li style={{ padding: "8px 0", fontSize: 14 }}>
                          <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                          Basic features to track development
                        </li>
                        <li style={{ padding: "8px 0", fontSize: 14 }}>
                          <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                          Track up to {plan.maxChildrenAllowed} children
                        </li>
                        <li style={{ padding: "8px 0", fontSize: 14 }}>
                          <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                          Personalized development information
                        </li>
                        <li style={{ padding: "8px 0", fontSize: 14 }}>
                          <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                          Monthly progress reports
                        </li>
                      </ul>

                      <Button
                        type="primary"
                        block
                        loading={isLoadingThisPackage}
                        disabled={submitting}
                        style={{
                          marginTop: 30,
                          height: 44,
                          fontSize: 16,
                          fontWeight: "bold",
                          background: colorScheme.gradient,
                          border: "none",
                          borderRadius: 22,
                        }}
                        onClick={() => handleSubscribe(plan.id, plan.price)}
                      >
                        SUBSCRIBE NOW
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default PremiumSubscriptionPage;