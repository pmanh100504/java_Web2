import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

// Icon đơn giản (SVG)
const ShieldIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0056b3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);

export default function App() {
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Kiểm tra URL khi redirect từ VNPay về
    const queryParams = new URLSearchParams(window.location.search);
    const vnpCode = queryParams.get("vnp_ResponseCode");

    if (vnpCode === "00") {
      setStatus("success");
      setMessage("Giao dịch thành công! Cảm ơn bạn.");
    } else if (vnpCode) {
      setStatus("error");
      setMessage("Giao dịch thất bại hoặc bị hủy.");
    }
  }, []);

  const handlePayment = async () => {
    setStatus("loading");
    setMessage("");
    
    try {
      // URL Backend của bạn
      const res = await axios.get("http://localhost:3000/payment");

      if (res.data && res.data.url) {
        window.location.href = res.data.url;
      } else {
        setStatus("error");
        setMessage("Không nhận được link thanh toán từ server.");
      }
    } catch (e) {
      console.error(e);
      setStatus("error");
      setMessage("Lỗi kết nối đến máy chủ.");
    } finally {
        // Nếu chuyển trang thành công thì không cần setStatus lại, 
        // nhưng nếu lỗi thì cần tắt loading.
        if (!window.location.href.includes("vnpay")) {
             // Logic phụ trợ
        }
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        {/* Header */}
        <div className="card-header">
          <ShieldIcon />
          <h1>Cổng Thanh Toán</h1>
          <p>Demo tích hợp VNPay</p>
        </div>

        {/* Thông tin đơn hàng giả lập */}
        <div className="order-details">
          <div className="detail-row">
            <span>Mã đơn hàng:</span>
            <strong>#DH20251210</strong>
          </div>
          <div className="detail-row total">
            <span>Tổng thanh toán:</span>
            <span className="price">100.000 VND</span>
          </div>
        </div>

        {/* Khu vực thông báo trạng thái */}
        {status === "success" && (
          <div className="alert success">
            ✅ {message}
          </div>
        )}
        
        {status === "error" && (
          <div className="alert error">
            ⚠️ {message}
          </div>
        )}

        {/* Nút thanh toán */}
        <button 
          onClick={handlePayment} 
          className={`pay-button ${status === "loading" ? "loading" : ""}`}
          disabled={status === "loading" || status === "success"}
        >
          {status === "loading" ? (
            <span className="spinner"></span>
          ) : status === "success" ? (
            "Đã thanh toán"
          ) : (
            "Thanh toán ngay qua VNPay"
          )}
        </button>
        
        <div className="footer-note">
          <p>Bảo mật thanh toán chuẩn quốc tế.</p>
        </div>
      </div>
    </div>
  );
}