import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [paymentParams, setPaymentParams] = useState<any>(null);

  useEffect(() => {
    // Lấy các tham số từ searchParams
    const paymentDetails = {
      amount: searchParams.get("vnp_Amount"),
      txnRef: searchParams.get("vnp_TxnRef"),
      responseCode: searchParams.get("vnp_ResponseCode"),
      secureHash: searchParams.get("vnp_SecureHash"),
    };

    setPaymentParams(paymentDetails);

    // Kiểm tra mã phản hồi và xử lý
    if (paymentDetails.responseCode === "00") {
      console.log("Thanh toán thành công!");
      // Xử lý thanh toán thành công
    } else {
      console.log("Thanh toán thất bại!");
      // Xử lý nếu thanh toán thất bại
    }
  }, [searchParams]);

  return (
    <div>
      <h1>Payment Success</h1>
      {paymentParams ? (
        <div>
          <p>Amount: {paymentParams.amount}</p>
          <p>Transaction Ref: {paymentParams.txnRef}</p>
          <p>Response Code: {paymentParams.responseCode}</p>
          <p>Secure Hash: {paymentParams.secureHash}</p>
        </div>
      ) : (
        <p>Loading payment details...</p>
      )}
    </div>
  );
};

export default PaymentSuccessPage;
