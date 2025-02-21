// src/Pages/BMI/BMICalculator.tsx
import React, { useState } from 'react';
import { Layout, Typography, Input, Button, Card, Radio, message } from 'antd';
import './BMICalculator.css'; // Import file CSS
import GuestHeader from '../../components/Header/GuestHeader';
import AppFooter from '../../components/Footer/Footer';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const BMICalculator: React.FC = () => {
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [angle, setAngle] = useState<number>(0);
  const [gender, setGender] = useState<string>('male'); // Thêm state cho giới tính

  const calculateBMI = () => {
    if (weight && height) {
      if (weight <= 0 || height <= 0) {
        message.error('Cân nặng và chiều cao phải lớn hơn 0.');
        return;
      }
      const heightInMeters = height / 100; // Chuyển đổi chiều cao từ cm sang m
      const bmi = weight / (heightInMeters * heightInMeters);
      setBmiResult(bmi);

      // Tính góc cho kim chỉ dựa trên các khoảng BMI
      let calculatedAngle = 0;
      if (bmi < 18.5) {
        calculatedAngle = -75; // Góc 1
      } else if (bmi >= 18.5 && bmi < 23) {
        calculatedAngle = -36; // Góc 2
      } else if (bmi >= 23 && bmi < 25) {
        calculatedAngle = 0; // Góc 3
      } else if (bmi >= 25 && bmi < 30) {
        calculatedAngle = 37; // Góc 4
      } else {
        calculatedAngle = 73; // Góc 5
      }

      setAngle(calculatedAngle); // Cập nhật góc cho kim chỉ
    } else {
      message.error('Vui lòng nhập đầy đủ cân nặng và chiều cao.');
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
    <Layout style={{ minHeight: '100vh' }}>
      <GuestHeader />

      <Content style={{ padding: '64px 0', textAlign: 'center' }}>
        <Title level={1} style={{ fontSize: '36px', marginBottom: '20px', color: 'blue'}}>CÔNG CỤ TÍNH BMI</Title>
        
        <Card 
          style={{ 
            width: '500px', // Tăng chiều rộng
            height: '400px', // Tăng chiều cao
            margin: '0 auto', 
            padding: '20px', 
            border: '2px solid #87CEEB' // Thay đổi màu viền
          }}
        >
          <label style={{ color: '#87CEEB', display: 'block', marginBottom: '8px' }}>Giới tính</label>
          <Radio.Group onChange={(e) => setGender(e.target.value)} value={gender} style={{ marginBottom: '16px' }}>
            <Radio value="male">Nam</Radio>
            <Radio value="female">Nữ</Radio>
          </Radio.Group>

          <label style={{ color: '#87CEEB', display: 'block', marginBottom: '8px' }}>Cân nặng (kg)</label>
          <Input 
            type="number" 
            onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : undefined)} 
            style={{ marginBottom: '16px' }} 
          />
          
          <label style={{ color: '#87CEEB', display: 'block', marginBottom: '8px' }}>Chiều cao (cm)</label>
          <Input 
            type="number" 
            onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : undefined)} 
            style={{ marginBottom: '16px' }} 
          />
          
          <Button 
            type="primary" 
            onClick={calculateBMI} 
            style={{ 
              backgroundColor: '#0056b3', // Màu xanh đậm
              borderColor: '#0056b3', // Màu viền
              color: 'white', // Màu chữ
              fontSize: '16px', // Kích thước chữ
              width: '100%', // Chiếm toàn bộ chiều rộng
              height: '50px', // Chiều cao nút
              marginTop: '20px'
            }}
          >
            Xem kết quả
          </Button>
        </Card>

        {/* Di chuyển hình ảnh và kết quả ra ngoài Card */}
        {bmiResult !== null && (
          <div style={{ marginTop: '30px' }}>
            <Title level={3} style={{ color: 'blue' }}>Kết quả chỉ số BMI của bạn: {bmiResult.toFixed(2)}</Title>
            <div className="gauge-container">
              <img 
                src="https://tamanhhospital.vn/wp-content/uploads/2024/10/img-bang-ket-qua.png" 
                alt="Biểu đồ BMI" 
                className="circle" 
                style={{ width: '80%', maxWidth: '400px' }} // Điều chỉnh kích thước trực tiếp
              />
              <img 
                src="https://tamanhhospital.vn/wp-content/uploads/2024/10/kim-new2.png" 
                alt="Kim chỉ" 
                className="needle" 
                style={{ transform: `translate(-50%, -100%) rotate(${angle}deg)` }} 
              />
            </div>
            {getAdvice(bmiResult)}
          </div>
        )}

        {/* Thêm div màu xám bên ngoài */}
        <div style={{ backgroundColor: '#d9d9d9', color: 'black', padding: '20px', marginTop: '30px',  width: '100%', textAlign: 'left' }}>
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