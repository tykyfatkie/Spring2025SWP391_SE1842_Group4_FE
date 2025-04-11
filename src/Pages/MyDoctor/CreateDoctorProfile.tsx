import { useState } from 'react';
import { Layout, Typography, Form, Input, Button, message, Card, Alert, Upload, Select, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import DoctorSidebar from '../../components/Sidebar/DoctorSidebar';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

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

// Common languages list for dropdown
const commonLanguages = [
  'English',
  'Vietnamese',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Korean',
  'Russian',
  'Portuguese',
  'Italian',
  'Arabic',
  'Hindi',
  'Bengali',
  'Thai'
];

// Interface for hospital experience
interface HospitalExperience {
  hospital: string;
  years: string;
}

// Define interfaces for form values and potential API errors
interface FormValues {
  certificate: string;
  licenseNumber: string;
  biography: string;
  specialize: string;
  degrees: string;
  research: string;
  languages: string[];
  hospitalExperiences: HospitalExperience[];
  profileImg: string;
}

const CreateDoctorProfile = () => {
  // Create state for form fields
  const [formValues, setFormValues] = useState<FormValues>({
    certificate: '',
    licenseNumber: '',
    biography: '',
    specialize: '',
    degrees: '',
    research: '',
    languages: [],
    hospitalExperiences: [{ hospital: '', years: '' }],
    profileImg: '',
  });
  
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const navigate = useNavigate();

  // Function to handle input changes
  const handleInputChange = (field: keyof FormValues, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Also update the form field value
    form.setFieldsValue({ [field]: value });
  };

  // Function to handle the API call for image upload
  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Unauthorized: Please log in");
      }
      
      // Update to use the correct API endpoint
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result.url; // Return the URL from the upload API
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      throw new Error(errorMessage);
    }
  };

  // Function to handle file upload from the Upload component
  const handleImageUpload = async (file: File) => {
    setUploadLoading(true);
    try {
      // Show loading message
      const loadingMsg = message.loading('Uploading image...', 0);
      
      // Call the upload API
      const url = await uploadImage(file);
      
      // Update state with the returned URL
      setImageUrl(url);
      
      // Update form field value and state
      handleInputChange('profileImg', url);
      
      // Clear loading message and show success
      loadingMsg();
      message.success('Image uploaded successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      message.error(errorMessage);
    } finally {
      setUploadLoading(false);
    }
    
    return false; // Prevent default upload behavior
  };

  // Validate form data
  const validateFormData = (values: FormValues) => {
    if (!values.specialize || values.specialize.trim() === '') {
      message.error('Please enter your specializations!');
      return false;
    }
    if (!values.degrees || values.degrees.trim() === '') {
      message.error('Please enter your degrees!');
      return false;
    }
    if (!values.certificate || values.certificate.trim() === '') {
      message.error('Please enter your certifications!');
      return false;
    }
    if (!values.languages || values.languages.length === 0) {
      message.error('Please select at least one language!');
      return false;
    }
    
    // Check if at least one hospital experience is entered properly
    const validHospitals = values.hospitalExperiences.filter(exp => 
      exp.hospital && exp.hospital.trim() !== '' && exp.years && exp.years.trim() !== ''
    );
    
    if (validHospitals.length === 0) {
      message.error('Please enter at least one hospital experience!');
      return false;
    }
    
    return true;
  };

  const handleCreateProfile = async (values: FormValues) => {
    // Merge values from form with our state
    const finalValues = {
      ...formValues,
      ...values
    };
    
    // Check if we have the required data
    if (!validateFormData(finalValues)) {
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Unauthorized: Please log in");
      }

      // Create metadata object with hospital experiences
      // Format: {"hospitals":[{"hospital":"Hospital A","years":"5"},{"hospital":"Hospital B","years":"3"}]}
      const metadata = JSON.stringify({
        hospitals: finalValues.hospitalExperiences.filter(exp => 
          exp.hospital && exp.hospital.trim() !== '' && exp.years && exp.years.trim() !== ''
        )
      });

      // Prepare the profile data for API submission according to specified format
      const profileData = {
        certificate: finalValues.certificate,
        licenseNumber: finalValues.licenseNumber,
        biography: finalValues.biography,
        metadata: metadata, // JSON string format with hospital experiences
        specialize: finalValues.specialize,
        profileImg: imageUrl || finalValues.profileImg, // Use the uploaded image URL
        degrees: finalValues.degrees,
        research: finalValues.research || '', // Handle empty research field
        languages: Array.isArray(finalValues.languages) ? finalValues.languages.join(', ') : finalValues.languages
      };

      console.log("Sending data to API:", profileData);

      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/doctors/create`, {
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
      navigate('/my-doctor');
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
            <Form 
              form={form} 
              layout="vertical" 
              onFinish={handleCreateProfile}
              initialValues={formValues}
            >
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
                    {!imageUrl && !uploadLoading && (
                      <div>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                    {uploadLoading && <div>Uploading...</div>}
                  </Upload>
                  {imageUrl && (
                    <div style={{ marginTop: 8 }}>
                      <Text type="success">Image uploaded successfully</Text>
                    </div>
                  )}
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
                  <Input 
                    placeholder="Enter your specializations (e.g., Cardiology, Pediatrics)" 
                    onChange={(e) => handleInputChange('specialize', e.target.value)}
                  />
                  <Text type="secondary">Separate multiple specializations with commas</Text>
                </Form.Item>
                
                {/* Hospital Experiences Section */}
                <Form.List name="hospitalExperiences">
                  {(fields, { add, remove }) => (
                    <>
                      <Form.Item label="Hospital Experience">
                        <Text type="secondary">Add your experience at different hospitals or clinics</Text>
                      </Form.Item>
                      
                      {fields.map(({ key, name, ...restField }) => (
                        <Space 
                          key={key} 
                          style={{ display: 'flex', marginBottom: 8 }} 
                          align="baseline"
                        >
                          <Form.Item
                            {...restField}
                            name={[name, 'hospital']}
                            rules={[{ required: true, message: 'Hospital name is required' }]}
                            style={{ width: '60%' }}
                          >
                            <Input placeholder="Hospital/Clinic Name" />
                          </Form.Item>
                          <Form.Item
                            {...restField}
                            name={[name, 'years']}
                            rules={[{ required: true, message: 'Years is required' }]}
                            style={{ width: '30%' }}
                          >
                            <Input type="number" placeholder="Years" />
                          </Form.Item>
                          {fields.length > 1 ? (
                            <MinusCircleOutlined
                              onClick={() => remove(name)}
                              style={{ color: '#ff4d4f' }}
                            />
                          ) : null}
                        </Space>
                      ))}
                      
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add({ hospital: '', years: '' })}
                          icon={<PlusOutlined />}
                          style={{ width: '100%' }}
                        >
                          Add Hospital Experience
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>

                <Form.Item 
                  name="biography" 
                  label="Biography"
                  rules={[{ required: true, message: 'Please enter your biography!' }]}
                >
                  <Input.TextArea 
                    rows={4} 
                    placeholder="Brief description of your experience and expertise" 
                    onChange={(e) => handleInputChange('biography', e.target.value)}
                  />
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
                  <Input.TextArea 
                    rows={3} 
                    placeholder="E.g., Doctor of Medicine (2018), Master of Science (2015)" 
                    onChange={(e) => handleInputChange('degrees', e.target.value)}
                  />
                  <Text type="secondary">Separate multiple degrees with commas</Text>
                </Form.Item>
                
                <Form.Item 
                  name="certificate" 
                  label="Certifications"
                  rules={[{ required: true, message: 'Please enter your certifications!' }]}
                >
                  <Input.TextArea 
                    rows={3} 
                    placeholder="E.g., Medical License, Specialty Certification" 
                    onChange={(e) => handleInputChange('certificate', e.target.value)}
                  />
                  <Text type="secondary">Separate multiple certifications with commas</Text>
                </Form.Item>

                <Form.Item 
                  name="licenseNumber" 
                  label="License Number"
                  rules={[{ required: true, message: 'Please enter your license number!' }]}
                >
                  <Input 
                    placeholder="Your medical license number" 
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  />
                </Form.Item>
              </div>

              {/* Additional Information Section */}
              <Title level={4} style={{ marginBottom: '20px' }}>Additional Information</Title>
              <div style={{ background: colors.secondary.light, padding: '20px', borderRadius: '10px', marginBottom: '24px' }}>
                <Form.Item 
                  name="research" 
                  label="Research & Publications"
                >
                  <Input.TextArea 
                    rows={3} 
                    placeholder="List your research papers or publications" 
                    onChange={(e) => handleInputChange('research', e.target.value)}
                  />
                  <Text type="secondary">Separate multiple entries with commas</Text>
                </Form.Item>

                <Form.Item 
                  name="languages" 
                  label="Languages"
                  rules={[{ required: true, message: 'Please select at least one language!' }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select languages you speak"
                    style={{ width: '100%' }}
                    onChange={(value) => handleInputChange('languages', value)}
                    tokenSeparators={[',']}
                    allowClear
                  >
                    {commonLanguages.map(language => (
                      <Option key={language} value={language}>{language}</Option>
                    ))}
                  </Select>
                  <Text type="secondary">You can select multiple languages or type to add your own</Text>
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