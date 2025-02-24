// src/Pages/BMI/BMICalculator.tsx
import React, { useState } from 'react';
import { Layout, Typography, Input, Button, Card, Radio, message, Select } from 'antd';
import './BMICalculator.css'; // Import file CSS
import GuestHeader from '../../components/Header/GuestHeader';
import AppFooter from '../../components/Footer/Footer';

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { Option } = Select;

const BMICalculator: React.FC = () => {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [angle, setAngle] = useState<number>(0);
  const [gender, setGender] = useState<string>('male');
  const [ageType, setAgeType] = useState<string>('yearsMonths');
  const [birthDate, setBirthDate] = useState<{ day: number; month: number; year: number }>({ day: 1, month: 1, year: 2000 });

  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (weightNum && heightNum) {
      if (weightNum < 4.5 || weightNum > 450) {
        message.error('Cân nặng phải nằm trong khoảng từ 4.5kg đến 450kg.');
        return;
      }
      if (heightNum < 30 || heightNum > 270) {
        message.error('Chiều cao phải nằm trong khoảng từ 30cm đến 270cm.');
        return;
      }
      const heightInMeters = heightNum / 100;
      const bmi = weightNum / (heightInMeters * heightInMeters);
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
      message.error('Vui lòng nhập đầy đủ cân nặng và chiều cao.');
    }
  };

  const goBack = () => {
    setWeight('');
    setHeight('');
    setBmiResult(null);
    setAngle(0);
    setGender('male');
    setAgeType('yearsMonths');
    setBirthDate({ day: 1, month: 1, year: 2000 });
  };

  const getWeightCategory = (bmi: number) => {
    if (bmi < 18.5) {
      return "Trẻ thiếu cân";
    } else if (bmi >= 18.5 && bmi < 22.9) {
      return "Trẻ có cân nặng bình thường";
    } else if (bmi >= 23 && bmi < 24.9) {
      return "Trẻ thừa cân";
    } else if (bmi >= 25 && bmi < 29.9) {
      return "Trẻ béo phì độ 1";
    } else if (bmi >= 30 ) {
      return "Trẻ béo phì nghiêm trọng";
    } 
  };

  const getAdvice = (bmi: number) => {
    if (bmi < 18.5) {
      return (
        <div style={{ border: '2px solid #87CEEB', backgroundColor: '#e6f7ff', padding: '20px', width: '100%', borderRadius: '8px', marginTop: '30px' }}>
          <Paragraph>Mức này cho thấy bạn đang thiếu cân, có thể dẫn đến tình trạng thiếu hụt vi chất dinh dưỡng cần thiết. Điều này cần được cải thiện ngay để giảm nguy cơ gặp phải những biến chứng nghiêm trọng sau này.</Paragraph>
          <Paragraph>Thiếu năng lượng có thể khiến bạn thường xuyên cảm thấy mệt mỏi, học tập và làm việc không hiệu quả, ảnh hưởng đến tâm trạng và dễ dẫn đến trầm cảm. Hãy điều chỉnh chế độ ăn uống đầy đủ dinh dưỡng và kết hợp với việc tập luyện thể dục hợp lý để cải thiện cân nặng và nâng cao sức khỏe.</Paragraph>
        </div>
      );
    } else if (bmi >= 18.5 && bmi < 24.9) {
      return (
        <div style={{ border: '2px solid #87CEEB', backgroundColor: '#e6f7ff', padding: '20px', width: '100%', borderRadius: '8px', marginTop: '20px' }}>
          <Paragraph>Mức này cho thấy bạn có chiều cao và cân nặng lý tưởng, nhưng điều này không phản ánh đầy đủ tình trạng sức khỏe bên trong. Bạn có thể gặp phải vấn đề thiếu hụt vi chất dinh dưỡng như vitamin và khoáng chất, hoặc tỷ lệ khối cơ và mỡ không hợp lý.</Paragraph>
          <Paragraph>Để hiểu rõ hơn về tình trạng sức khỏe của mình, bạn hãy đến khám tại Trung tâm Kiểm soát cân nặng và Điều trị béo phì tại Bệnh viện Đa khoa Tâm Anh.</Paragraph>
        </div>
      );
    } else if (bmi >= 25 && bmi < 30) {
      return (
        <div style={{ border: '2px solid #87CEEB', backgroundColor: '#e6f7ff', padding: '20px', width: '100%', borderRadius: '8px', marginTop: '20px' }}>
          <Paragraph>Mức này cho thấy bạn đang trong tình trạng thừa cân. Để giảm cân, lấy lại vóc dáng lý tưởng, bạn cần áp dụng chế độ ăn uống hợp lý kết hợp với tập luyện khoa học.</Paragraph>
          <Paragraph>Thừa cân, béo phì có thể dẫn đến nhiều bệnh lý nghiêm trọng như bệnh tim mạch, tiểu đường, huyết áp cao, suy giảm sinh lý và lão hóa sớm.</Paragraph>
        </div>
      );
    } else if (bmi >= 30 && bmi < 35) {
      return (
        <div style={{ border: '2px solid #87CEEB', backgroundColor: '#e6f7ff', padding: '20px', width: '100%', borderRadius: '8px', marginTop: '20px' }}>
          <Paragraph>Mức này cho thấy bạn đang béo phì độ I. Để cải thiện tình trạng này, bạn cần thăm khám và nhận tư vấn từ chuyên gia, bác sĩ về chế độ ăn uống và luyện tập hợp lý.</Paragraph>
          <Paragraph>Các chuyên gia bác sĩ Trung tâm Kiểm soát cân nặng và Điều trị béo phì sẽ hỗ trợ bạn bằng các phác đồ điều trị chuẩn y khoa, an toàn, giúp bạn giảm cân hiệu quả và nâng cao sức khỏe.</Paragraph>
        </div>
      );
    } else {
      return (
        <div style={{ border: '2px solid #87CEEB', backgroundColor: '#e6f7ff', padding: '20px', width: '100%', borderRadius: '8px', marginTop: '20px' }}>
          <Paragraph>Mức này cho thấy bạn đang ở mức béo phì độ II và tình trạng này là đáng báo động, có thể gây ra nhiều vấn đề sức khỏe nghiêm trọng.</Paragraph>
          <Paragraph>Bạn nên thăm khám với chuyên gia, bác sĩ để có giải pháp giảm cân phù hợp. Trung tâm Kiểm soát cân nặng và Điều trị béo phì, hệ thống Bệnh viện Đa khoa là địa chỉ đáng tin cậy.</Paragraph>
        </div>
      );
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', margin: "-25px" }}>
      <GuestHeader />

      <Content style={{ padding: '64px 0', textAlign: 'center' }}>
      <Title level={1} style={{ fontSize: '36px', marginBottom: '20px', color: '#0b4778', textAlign: 'left', margin: "20px" }}>Child and Teen BMI Calculator</Title>
      <div style={{ display: 'flex', alignItems: 'flex-start', backgroundColor: '#dff2f6', padding: '20px', borderRadius: '8px', margin: '20px', width: '1370px'}}>
        <Paragraph style={{ textAlign: 'left', marginLeft: '40px', flex: 1, fontSize: '20px' }}>
          <strong>WHAT TO KNOW?</strong> 
          <p>Body mass index (BMI) is a measure of weight relative to height. For children and teens,  </p>
          <p>BMI is interpreted using sex-specific BMI-for-age percentiles. This calculator reports BMI, </p>
          <p>BMI percentile, and BMI category for children and teens 2 through 19.</p>
        </Paragraph>
        <img src="https://www.cdc.gov/bmi/media/images/2024/05/child-measuring.jpg" alt="BMI Calculator" style={{ width: '350px', height: 'auto', marginRight: '60px' }} />
      </div>

        <Title level={1} style={{ fontSize: '36px', marginBottom: '20px', color: '#0b4778', textAlign: 'left', margin: "20px" }}>BMI Calculator for Child and Teen</Title>

      <Card
          style={{
            width: '600px', // Thay đổi chiều rộng ở đây
            height: 'auto',
            margin: '0 auto',
            padding: '20px',
            border: '2px solid #87CEEB'
          }}
        >
          {bmiResult === null ? (
            <>
              <label style={{ color: '#87CEEB', display: 'block', marginBottom: '8px', textAlign: 'left' }}>Giới tính</label>
              <Radio.Group onChange={(e) => setGender(e.target.value)} value={gender} style={{ marginBottom: '16px', textAlign: 'left' }}>
                <Radio value="male">Nam</Radio>
                <Radio value="female">Nữ</Radio>
              </Radio.Group>

              <label style={{ color: '#87CEEB', display: 'block', marginBottom: '8px', textAlign: 'left' }}>Cân nặng (kg)</label>
              <Input
                type="number"
                min={4.5}
                max={450}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                style={{ marginBottom: '16px' }}
              />

              <label style={{ color: '#87CEEB', display: 'block', marginBottom: '8px', textAlign: 'left' }}>Chiều cao (cm)</label>
              <Input
                type="number"
                min={30}
                max={270}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                style={{ marginBottom: '16px' }}
              />

              <label style={{ color: '#87CEEB', display: 'block', marginBottom: '8px', textAlign: 'left' }}>Chọn kiểu nhập tuổi</label>
              <Radio.Group onChange={(e) => setAgeType(e.target.value)} value={ageType} style={{ marginBottom: '16px', textAlign: 'left' }}>
                <Radio value="yearsMonths">Năm và tháng</Radio>
                <Radio value="months">Chỉ tháng</Radio>
                <Radio value="birthDate">Ngày sinh</Radio>
              </Radio.Group>

              {ageType === 'yearsMonths' && (
                <>
                  <label style={{ color: '#87CEEB', display: 'block', marginBottom: '8px', textAlign: 'left' }}>Tuổi (năm)</label>
                  <Input
                    type="number"
                    min={2}
                    max={19}
                    onChange={(e) => setBirthDate({ ...birthDate, year: e.target.value ? Number(e.target.value) : 0 })}
                    style={{ marginBottom: '16px' }}
                  />
                  <label style={{ color: '#87CEEB', display: 'block', marginBottom: '8px', textAlign: 'left' }}>Tuổi (tháng)</label>
                  <Input
                    type="number"
                    onChange={(e) => setBirthDate({ ...birthDate, month: e.target.value ? Number(e.target.value) : 0 })}
                    style={{ marginBottom: '16px' }}
                  />
                </>
              )}

              {ageType === 'months' && (
                <>
                  <label style={{ color: '#87CEEB', display: 'block', marginBottom: '8px', textAlign: 'left' }}>Tuổi (tháng)</label>
                  <Input
                    type="number"
                    onChange={(e) => setBirthDate({ ...birthDate, month: e.target.value ? Number(e.target.value) : 0 })}
                    style={{ marginBottom: '16px' }}
                  />
                </>
              )}

              {ageType === 'birthDate' && (
                <>
                  <label style={{ color: '#87CEEB', display: 'block', marginBottom: '8px', textAlign: 'left' }}>Ngày sinh</label>
                  <Select value={birthDate.day} onChange={(value) => setBirthDate({ ...birthDate, day: value })} style={{ width: '30%', marginRight: '5%' }}>
                    {[...Array(31)].map((_, index) => <Option key={index + 1} value={index + 1}>{index + 1}</Option>)}
                  </Select>
                  <Select value={birthDate.month} onChange={(value) => setBirthDate({ ...birthDate, month: value })} style={{ width: '30%', marginRight: '5%' }}>
                    {[...Array(12)].map((_, index) => <Option key={index + 1} value={index + 1}>{index + 1}</Option>)}
                  </Select>
                  <Select value={birthDate.year} onChange={(value) => setBirthDate({ ...birthDate, year: value })} style={{ width: '30%' }}>
                    {[...Array(20)].map((_, index) => {
                      const year = new Date().getFullYear() - index;
                      return <Option key={year} value={year}>{year}</Option>;
                    })}
                  </Select>
                </>
              )}

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
                Xem kết quả
              </Button>
            </>
          ) : (
            <div>
              <Title style={{ textAlign: 'left' }}><span style={{ fontSize: '30px' }}>Kết quả tính toán:</span></Title> 
              <Title level={3} style={{ color: 'blue', textAlign: 'left' }}><span style={{ fontSize: '25px' }}>Kết quả BMI: {bmiResult.toFixed(1)} </span></Title>
              <Paragraph style={{ textAlign: 'left' }}>
                <strong>{getWeightCategory(bmiResult)}</strong>
              </Paragraph>
              <Paragraph style={{ textAlign: 'left' }}>Phần trăm BMI: {((bmiResult / 25) * 100).toFixed(2)} %</Paragraph>

              <Title level={4} style={{ marginTop: '30px', textAlign: 'left' }}>Thông tin đã nhập</Title>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <Paragraph style={{ textAlign: 'left' }}>Tuổi: {ageType === 'yearsMonths' ? `${birthDate.year} năm` : ageType === 'months' ? `${birthDate.month} tháng` : `${birthDate.day}/${birthDate.month}/${birthDate.year}`}</Paragraph>
                <Paragraph style={{ textAlign: 'left' }}>Giới tính: {gender}</Paragraph>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <Paragraph style={{ textAlign: 'left' }}>Chiều cao: {height} cm</Paragraph>
                <Paragraph style={{ textAlign: 'left' }}>Cân nặng: {weight} kg</Paragraph>
              </div>

              <Title level={4} style={{ marginTop: '30px', textAlign: 'left' }}>Detailed Results</Title>
              <div className="gauge-container">
                <img
                  src="https://tamanhhospital.vn/wp-content/uploads/2024/10/img-bang-ket-qua.png"
                  alt="Biểu đồ BMI"
                  className="circle"
                  style={{ width: '80%', maxWidth: '400px' }}
                />
                <img
                  src="https://tamanhhospital.vn/wp-content/uploads/2024/10/kim-new2.png"
                  alt="Kim chỉ"
                  className="needle"
                  style={{ transform: `translate(-50%, -100%) rotate(${angle}deg)` }}
                />
              </div>
              {getAdvice(bmiResult)}
              <Button
                type="link"
                onClick={goBack}
                style={{ marginTop: '20px' }}
              >
                Quay lại để nhập lại
              </Button>
            </div>
          )}
        </Card>

        {/* Thêm div màu xám bên ngoài */}
        <div style={{ backgroundColor: '#d9d9d9', color: 'black', padding: '20px', marginTop: '30px', width: '100%', textAlign: 'left' }}>
          <Title level={4}>Miễn trừ trách nhiệm</Title>
          <Paragraph>
            Lưu ý, kết quả từ công cụ tính BMI online chỉ mang tính tham khảo, không thể thay thế các phương pháp chẩn đoán chuyên sâu tại cơ sở y tế. Nếu có nhu cầu chẩn đoán chính xác tình trạng cơ thể và sức khỏe, bạn có thể đến các cơ sở y tế có chuyên môn như Hệ thống Bệnh viện Đa khoa trong nước.
          </Paragraph>
          <Paragraph>
            Kết quả tính BMI trên website giúp đánh giá tình trạng thừa cân, béo phì theo tiêu chuẩn của WHO áp dụng cho người Châu Á từ 18 tuổi trở lên, được Bộ Y tế công bố. <a href="https://thuvienphapluat.vn/van-ban/The-thao-Y-te/Quyet-dinh-2892-QD-BYT-2022-tai-lieu-Huong-dan-chan-doan-va-dieu-tri-benh-beo-phi-533849.aspx" target="_blank" rel="noopener noreferrer">(1)</a>
          </Paragraph>
        </div>
      </Content>

      <AppFooter />
    </Layout>
  );
};

export default BMICalculator;