// Tạo file này trong thư mục services hoặc utils
import axios from 'axios';

export interface PaymentParams {
  packageId: string;
  amount: number;
  description: string;
}

export const initiateVnPayPayment = async (params: PaymentParams): Promise<string> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Token not found. Please login.');
  }
  
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_ENDPOINT}/payment/vnpay`,
      params,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    if (response.data) {
      return response.data;
    }
    throw new Error('Payment URL not received');
  } catch (error: any) {
    console.error('VNPay payment initiation error:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to initiate payment. Please try again later.');
  }
};

export const verifyVnPayReturn = async (queryString: string): Promise<any> => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Token not found. Please login.');
  }
  
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_ENDPOINT}/payment/vnpay-return${queryString}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    return response.data;
  } catch (error: any) {
    console.error('VNPay verification error:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to verify payment. Please contact support.');
  }
};