import express from "express";
import cors from "cors";
import "dotenv/config";
import { VNPay } from "vnpay";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMN_CODE || '99Y0JEG6',
  secureSecret: process.env.VNP_HASH_SECRET || '7UXFBPX9S8W8XDZZQKT7TOVLV9GE5QPQ',
  vnpUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",

  testMode: true,
});

app.get("/payment", (req, res) => {
  const ipAddr = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const amount = req.query.amount ? parseInt(req.query.amount) : 1000000;
  const returnUrl = req.query.returnUrl || "http://localhost:5173/";

  const vnpUrl = vnpay.buildPaymentUrl({
    vnp_Amount: amount, // Số tiền thanh toán
    vnp_IpAddr: ipAddr,
    vnp_TxnRef: Date.now(),
    vnp_OrderInfo: "Thanh toan don hang DEMO",
    vnp_ReturnUrl: returnUrl, // Trang muốn quay về sau khi thanh toán
  });

  console.log("✅ Payment URL:", vnpUrl);
  res.json({ url: vnpUrl });
});

// API kiểm tra trả về từ VNPay
app.get("/", (req, res) => {
  const query = req.query;

  // Nếu truy cập trực tiếp không có tham số (hoặc query rỗng)
  if (!query || Object.keys(query).length === 0) {
    return res.send("VNPay Mock Server is running. Please initiate payment from the frontend app (http://localhost:5173).");
  }

  try {
    const verify = vnpay.verifyReturnUrl(query);
    console.log("VNPay return query:", query);

    if (verify && query.vnp_ResponseCode === "00") {
      res.send("Thanh toán thành công!");
    } else {
      res.send("Thanh toán thất bại!");
    }
  } catch (error) {
    console.error("VNPay verification error:", error.message);
    res.status(400).send(`Xác thực VNPay thất bại: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`VNPay server running on http://localhost:${PORT}`);
});
