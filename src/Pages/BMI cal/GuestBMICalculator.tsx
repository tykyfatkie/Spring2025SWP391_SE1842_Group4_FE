// src/Pages/BMI/BMICalculator.tsx
import React, { useState } from 'react';
import { Layout, Typography, Input, Button, Card, Radio, message } from 'antd';
import './BMICalculator.css'; // Import CSS file
import AppFooter from '../../components/Footer/Footer';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const BMICalculator: React.FC = () => {
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [angle, setAngle] = useState<number>(0);
  const [gender, setGender] = useState<string>('male'); 

  const calculateBMI = () => {
    if (weight && height) {
      if (weight <= 0 || height <= 0) {
        message.error('Weight and height must be greater than 0.');
        return;
      }
      const heightInMeters = height / 100; 
      const bmi = weight / (heightInMeters * heightInMeters);
      setBmiResult(bmi);

      let calculatedAngle = 0;
      if (bmi < 18.5) {
        calculatedAngle = -75; 
      } else if (bmi >= 18.5 && bmi < 23) {
        calculatedAngle = -36; 
      } else if (bmi >= 23 && bmi < 25) {
        calculatedAngle = 0; 
      } else if (bmi >= 25 && bmi < 30) {
        calculatedAngle = 37; 
      } else {
        calculatedAngle = 73; 
      }

      setAngle(calculatedAngle); 
    } else {
      message.error('Please enter both weight and height.');
    }
  };

  const getAdvice = (bmi: number) => {
    if (bmi < 18.5) {
      return (
        <div style={{ border: '2px solid #87CEEB', backgroundColor: '#e6f7ff', padding: '20px', width: '100%', borderRadius: '8px', marginTop: '30px' }}>
          <Paragraph>This indicates that you are underweight, which may lead to a deficiency in essential micronutrients. This should be addressed to reduce the risk of serious complications in the future.</Paragraph>
          <Paragraph>Energy deficiency can cause fatigue, reduce work and study efficiency, affect your mood, and even lead to depression. Adjusting your diet and combining it with proper exercise will help improve your weight and overall health.</Paragraph>
        </div>
      );
    } else if (bmi >= 18.5 && bmi < 24.9) {
      return (
        <div style={{ border: '2px solid #87CEEB', backgroundColor: '#e6f7ff', padding: '20px', width: '100%', borderRadius: '8px', marginTop: '20px' }}>
          <Paragraph>This indicates that you have an ideal weight and height, but this doesn't fully reflect your internal health. You might face deficiencies in micronutrients like vitamins and minerals, or have an improper ratio of muscle mass and fat.</Paragraph>
          <Paragraph>To understand more about your health, consider visiting the Weight Control and Obesity Treatment Center at Tam Anh General Hospital.</Paragraph>
        </div>
      );
    } else if (bmi >= 25 && bmi < 30) {
      return (
        <div style={{ border: '2px solid #87CEEB', backgroundColor: '#e6f7ff', padding: '20px', width: '100%', borderRadius: '8px', marginTop: '20px' }}>
          <Paragraph>This indicates that you are overweight. To lose weight and regain your ideal figure, you need to follow a proper diet combined with scientific exercise.</Paragraph>
          <Paragraph>Being overweight or obese can lead to serious health issues such as heart disease, diabetes, high blood pressure, decreased libido, and premature aging.</Paragraph>
        </div>
      );
    } else if (bmi >= 30 && bmi < 35) {
      return (
        <div style={{ border: '2px solid #87CEEB', backgroundColor: '#e6f7ff', padding: '20px', width: '100%', borderRadius: '8px', marginTop: '20px' }}>
          <Paragraph>This indicates that you are in the category of obesity grade I. To improve this condition, you should consult with an expert or doctor for a suitable diet and exercise plan.</Paragraph>
          <Paragraph>Experts at the Weight Control and Obesity Treatment Center will provide you with medical treatment plans that are safe, effective, and help you lose weight and improve your health.</Paragraph>
        </div>
      );
    } else {
      return (
        <div style={{ border: '2px solid #87CEEB', backgroundColor: '#e6f7ff', padding: '20px', width: '100%', borderRadius: '8px', marginTop: '20px' }}>
          <Paragraph>This indicates that you are in the category of obesity grade II, which is alarming and can cause many serious health issues.</Paragraph>
          <Paragraph>You should consult a specialist or doctor to find a suitable weight loss solution. The Weight Control and Obesity Treatment Center at Tam Anh General Hospital is a trusted place to seek help.</Paragraph>
        </div>
      );
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: '-25px' }}>
      <Content style={{ padding: '64px 0', textAlign: 'center' }}>
        <Title level={1} style={{ fontSize: '36px', marginBottom: '20px', color: 'blue'}}>BMI CALCULATOR</Title>
        
        <Card 
          style={{ 
            width: '500px', 
            height: '400px', 
            margin: '0 auto', 
            padding: '20px', 
            border: '2px solid #87CEEB' 
          }}
        >
          <label style={{ color: '#87CEEB', display: 'block', marginBottom: '8px' }}>Gender</label>
          <Radio.Group onChange={(e) => setGender(e.target.value)} value={gender} style={{ marginBottom: '16px' }}>
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
          </Radio.Group>

          <label style={{ color: '#87CEEB', display: 'block', marginBottom: '8px' }}>Weight (kg)</label>
          <Input 
            type="number" 
            onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : undefined)} 
            style={{ marginBottom: '16px' }} 
          />
          
          <label style={{ color: '#87CEEB', display: 'block', marginBottom: '8px' }}>Height (cm)</label>
          <Input 
            type="number" 
            onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : undefined)} 
            style={{ marginBottom: '16px' }} 
          />
          
          <Button 
            type="primary" 
            onClick={calculateBMI} 
            style={{ 
              backgroundColor: '#0056b3', 
              borderColor: '#0056b3', 
              color: 'white', 
              fontSize: '16px', 
              width: '100%', 
              height: '50px',
              marginTop: '20px'
            }}
          >
            See Results
          </Button>
        </Card>

        {bmiResult !== null && (
          <div style={{ marginTop: '30px' }}>
            <Title level={3} style={{ color: 'blue' }}>Your BMI Result: {bmiResult.toFixed(2)}</Title>
            <div className="gauge-container">
              <img 
                src="https://tamanhhospital.vn/wp-content/uploads/2024/10/img-bang-ket-qua.png" 
                alt="BMI Chart" 
                className="circle" 
                style={{ width: '80%', maxWidth: '400px' }} 
              />
              <img 
                src="https://tamanhhospital.vn/wp-content/uploads/2024/10/kim-new2.png" 
                alt="Needle" 
                className="needle" 
                style={{ transform: `translate(-50%, -100%) rotate(${angle}deg)` }} 
              />
            </div>
            {getAdvice(bmiResult)}
          </div>
        )}
        
      </Content>

      <AppFooter />
    </Layout>
  );
};

export default BMICalculator;
