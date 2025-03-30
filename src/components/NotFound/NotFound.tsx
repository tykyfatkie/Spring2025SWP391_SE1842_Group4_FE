import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        background: `url('https://cdn-0001.qstv.on.epicgames.com/qhaXXELkxAckyOKHhg/image/landscape_comp.jpeg') no-repeat center center/cover`,
        textAlign: 'center',
        color: '#fff',
        backdropFilter: 'blur(5px)',
      }}
    >
      <Title style={{ fontSize: '72px', fontWeight: 'bold', textShadow: '2px 2px 10px rgba(0,0,0,0.7)' }}>404</Title>
      <Paragraph style={{ fontSize: '24px', textShadow: '1px 1px 5px rgba(0,0,0,0.5)' }}>
        Oops! The page you're looking for doesn't exist.
      </Paragraph>
      <Button type="primary" size="large" onClick={() => navigate('/')}>Go Home</Button>
    </div>
  );
};

export default NotFoundPage;
