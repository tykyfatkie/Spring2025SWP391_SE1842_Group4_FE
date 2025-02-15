import React from 'react'
import { Layout, Typography, Button } from 'antd'
import { useGetCountryListQuery } from '../../features/country/countriesApi'

const { Content } = Layout
const { Title, Paragraph } = Typography

const Homepage: React.FC = () => {
  const { data } = useGetCountryListQuery({
    pageNumber: 1,
    pageSize: 1,
  })

  return (
    <Layout>
      <Content>
        <Title level={1}>Welcome to the Children Vaccination System</Title>
        <Paragraph>
          Ensuring the health and safety of our children through timely
          vaccinations.
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
    </Layout>
  )
}

export default Homepage
