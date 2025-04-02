import { useState } from 'react';
import { Layout, Typography, Form, Input, Button, message, Card, Alert, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import DoctorSidebar from '../../components/Sidebar/DoctorSidebar';

const { Content } = Layout;
const { Title, Text } = Typography;

// Main color variables to maintain consistency
const colors = {
  primary: {
    light: '#3b82f6', // Light blue
    main: '#1e3a8a',  // Dark blue
    gradient: 'linear-gradient(135deg, rgb(30, 58, 138) 0%, rgb(59, 130, 246) 100%)'
  },
  secondary: {
    light: '#f0f2f5', // Light background
    main: '#ffffff'   // White
  }
};

// Define interfaces for form values and potential API errors
interface FormValues {
  certificate: string;
  licenseNumber: string;
  biography: string;
  specialize: string;
  degrees: string;
  research: string;
  languages: string;
  hospital: string;
  experienceYears: string;
  profileImg?: string;
}

const CreateDoctorProfile = () => {
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const navigate = useNavigate();

  // Function to handle file upload
  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    return false; // Prevent automatic upload
  };

  const handleCreateProfile = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        throw new Error("Unauthorized: Please log in");
      }

      // Create metadata object for additional information
      const metadata = {
        hospital: values.hospital,
        years: values.experienceYears
      };

      // Prepare the profile data for API submission
      const profileData = {
        certificate: values.certificate,
        licenseNumber: values.licenseNumber,
        biography: values.biography,
        metadata: JSON.stringify(metadata),
        specialize: values.specialize,
        degrees: values.degrees,
        research: values.research,
        languages: values.languages,
        profileImg: imageUrl // Add the profile image URL
      };

      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/api/v1/doctors/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      
      // Store the doctor profile data in localStorage for easy access
      localStorage.setItem('doctorProfile', JSON.stringify(result.data));
      
      message.success('Profile created successfully!');
      navigate('/doctor/profile');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create profile';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
      <DoctorSidebar />
      <Layout style={{ background: '#f5f7fa' }}>
        <Content style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            background: colors.primary.gradient,
            padding: '20px 30px',
            borderRadius: '12px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}>
            <Title level={3} style={{ color: 'white', margin: 0 }}>Create Doctor Profile</Title>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              Create your professional profile to show your expertise to patients
            </Text>
          </div>

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              closable
              style={{ marginBottom: '24px' }}
              onClose={() => setError(null)}
            />
          )}

          <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <Form form={form} layout="vertical" onFinish={handleCreateProfile}>
              {/* Profile Image Section */}
              <Title level={4} style={{ marginBottom: '20px' }}>Profile Image</Title>
              <div style={{ background: colors.secondary.light, padding: '20px', borderRadius: '10px', marginBottom: '24px' }}>
                <Form.Item 
                  name="profileImg" 
                  label="Profile Image"
                  rules={[{ required: true, message: 'Please upload your profile image!' }]}
                >
                  <Upload
                    name="profileImg"
                    listType="picture-card"
                    showUploadList={true}
                    beforeUpload={handleImageUpload}
                    maxCount={1}
                  >
                    {!imageUrl && (
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                  <Text type="secondary">Upload a professional photo of yourself</Text>
                </Form.Item>
              </div>
              
              {/* Basic Information Section */}
              <Title level={4} style={{ marginBottom: '20px' }}>Basic Information</Title>
              <div style={{ background: colors.secondary.light, padding: '20px', borderRadius: '10px', marginBottom: '24px' }}>
                <Form.Item 
                  name="specialize" 
                  label="Specialization" 
                  rules={[{ required: true, message: 'Please enter your specializations!' }]}
                >
                  <Input placeholder="Enter your specializations (e.g., Cardiology, Pediatrics)" />
                  <Text type="secondary">Separate multiple specializations with commas</Text>
                </Form.Item>
                
                <Form.Item 
                  name="hospital" 
                  label="Hospital/Clinic"
                  rules={[{ required: true, message: 'Please enter your workplace!' }]}
                >
                  <Input placeholder="Where you currently work" />
                </Form.Item>
                
                <Form.Item 
                  name="experienceYears" 
                  label="Years of Experience"
                  rules={[{ required: true, message: 'Please enter your years of experience!' }]}
                >
                  <Input type="number" placeholder="How many years of professional experience" />
                </Form.Item>

                <Form.Item 
                  name="biography" 
                  label="Biography"
                  rules={[{ required: true, message: 'Please enter your biography!' }]}
                >
                  <Input.TextArea rows={4} placeholder="Brief description of your experience and expertise" />
                </Form.Item>
              </div>

              {/* Qualifications Section */}
              <Title level={4} style={{ marginBottom: '20px' }}>Qualifications</Title>
              <div style={{ background: colors.secondary.light, padding: '20px', borderRadius: '10px', marginBottom: '24px' }}>
                <Form.Item 
                  name="degrees" 
                  label="Degrees"
                  rules={[{ required: true, message: 'Please enter your degrees!' }]}
                >
                  <Input.TextArea rows={3} placeholder="E.g., Doctor of Medicine (2018), Master of Science (2015)" />
                  <Text type="secondary">Separate multiple degrees with commas</Text>
                </Form.Item>
                
                <Form.Item 
                  name="certificate" 
                  label="Certifications"
                  rules={[{ required: true, message: 'Please enter your certifications!' }]}
                >
                  <Input.TextArea rows={3} placeholder="E.g., Medical License, Specialty Certification" />
                  <Text type="secondary">Separate multiple certifications with commas</Text>
                </Form.Item>

                <Form.Item 
                  name="licenseNumber" 
                  label="License Number"
                  rules={[{ required: true, message: 'Please enter your license number!' }]}
                >
                  <Input placeholder="Your medical license number" />
                </Form.Item>
              </div>

              {/* Additional Information Section */}
              <Title level={4} style={{ marginBottom: '20px' }}>Additional Information</Title>
              <div style={{ background: colors.secondary.light, padding: '20px', borderRadius: '10px', marginBottom: '24px' }}>
                <Form.Item 
                  name="research" 
                  label="Research & Publications"
                >
                  <Input.TextArea rows={3} placeholder="List your research papers or publications" />
                  <Text type="secondary">Separate multiple entries with commas</Text>
                </Form.Item>

                <Form.Item 
                  name="languages" 
                  label="Languages"
                  rules={[{ required: true, message: 'Please enter languages you speak!' }]}
                >
                  <Input placeholder="E.g., English, Spanish, French" />
                  <Text type="secondary">Separate multiple languages with commas</Text>
                </Form.Item>
              </div>

              {/* Submit Button */}
              <div style={{ textAlign: 'center' }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={submitting}
                  style={{ 
                    borderRadius: '50px',
                    padding: '0 40px',
                    height: '44px',
                    background: colors.primary.gradient,
                    border: 'none',
                    fontSize: '16px'
                  }}
                >
                  Create Profile
                </Button>
              </div>
            </Form>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CreateDoctorProfile;