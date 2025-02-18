import React from 'react';
import { Layout, Typography, Button } from 'antd';
import { useGetCountryListQuery } from '../../features/country/countriesApi';
import GuestHeader from '../../components/Header/GuestHeader'; 
import AppFooter from '../../components/Footer/Footer'; 

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Homepage: React.FC = () => {
  const { data } = useGetCountryListQuery({
    pageNumber: 1,
    pageSize: 1,
  });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Header */}
      <GuestHeader />

      {/* Main Content */}
      <Content style={{ padding: '24px' }}>
        <Title level={1}>Welcome to the Children Growth Tracking System</Title>
        <Paragraph>
          We eat your babies :)
        </Paragraph>
        <Button type='primary' href='/login'>
          Register Now
        </Button>
        {Array.isArray(data) && data.length > 0 && (
          <Paragraph>
            {data?.map((country) => <li key={country.id}>{country.name}</li>)}
          </Paragraph>
        )}
      </Content>

      {/* Footer */}
      <AppFooter />
    </Layout>
  );
};

export default Homepage;