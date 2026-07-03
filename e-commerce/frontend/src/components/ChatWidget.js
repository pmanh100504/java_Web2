import React, { useEffect, useMemo, useRef, useState } from "react";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Xin chào! Mình có thể hỗ trợ bạn về sản phẩm, giao hàng, thanh toán.", time: new Date() },
  ]);
  const endRef = useRef(null);

  const suggestions = useMemo(
    () => [
      "Gợi ý sản phẩm phù hợp",
      "Chính sách giao hàng",
      "Hướng dẫn thanh toán",
      "Tra cứu đơn hàng",
    ],
    []
  );

  useEffect(() => {
    if (open && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const normalizeText = (value) => {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const getBotReply = (text) => {
    const t = normalizeText(text);

    const intents = [
      {
        name: "greeting",
        keywords: ["xin chao", "chao", "hello", "hi", "hey"],
        reply: "Xin chào! Mình có thể giúp gì cho bạn hôm nay?",
      },
      {
        name: "shipping",
        keywords: ["giao hang", "ship", "van chuyen", "phi ship", "thoi gian giao"],
        reply: "Shop giao hàng toàn quốc. Thời gian dự kiến 2-5 ngày tùy khu vực. Bạn muốn mình kiểm tra phí ship không?",
      },
      {
        name: "order",
        keywords: ["don hang", "order", "tra cuu", "theo doi", "tracking"],
        reply: "Bạn có thể xem đơn hàng ở mục Profile > Đơn hàng gần đây. Mình có thể hướng dẫn chi tiết nếu bạn muốn.",
      },
      {
        name: "payment",
        keywords: ["thanh toan", "payment", "cod", "vnpay", "chuyen khoan"],
        reply: "Shop hỗ trợ COD và thanh toán online. Bạn muốn mình hướng dẫn cách thanh toán không?",
      },
      {
        name: "price",
        keywords: ["gia", "price", "khuyen mai", "giam gia"],
        reply: "Bạn vui lòng cho mình biết tên sản phẩm để mình tư vấn giá tốt nhất nhé.",
      },
      {
        name: "return",
        keywords: ["doi tra", "tra hang", "hoan tien", "refund", "bao hanh"],
        reply: "Bạn có thể đổi trả theo chính sách của shop. Mình sẽ hỗ trợ kiểm tra điều kiện đổi trả cho đơn hàng của bạn.",
      },
      {
        name: "product",
        keywords: ["san pham", "tu van", "goi y", "chon", "so sanh"],
        reply: "Bạn muốn tư vấn sản phẩm gì? Cho mình biết nhu cầu, tầm giá và thương hiệu nhé.",
      },
      {
        name: "contact",
        keywords: ["lien he", "hotline", "ho tro", "support"],
        reply: "Bạn có thể gửi câu hỏi ngay tại đây. Mình sẽ hỗ trợ nhanh nhất có thể.",
      },
    ];

    let best = { score: 0, reply: "" };
    for (const intent of intents) {
      const score = intent.keywords.reduce((acc, k) => (t.includes(k) ? acc + 1 : acc), 0);
      if (score > best.score) {
        best = { score, reply: intent.reply };
      }
    }

    if (best.score > 0) {
      return best.reply;
    }

    if (t.split(" ").length <= 2) {
      return "Bạn có thể nói rõ hơn một chút được không? Ví dụ: sản phẩm, giao hàng, thanh toán, đổi trả.";
    }

    return "Mình có thể hỗ trợ về sản phẩm, giao hàng, thanh toán hoặc tra cứu đơn hàng. Bạn cần gì nhé?";
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { from: "user", text, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const botMsg = { from: "bot", text: getBotReply(text), time: new Date() };
      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const formatTime = (date) => {
    try {
      const d = new Date(date);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "";
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: chatWidgetStyles }} />
      
      <div className={`chat-widget-panel ${open ? "open" : "closed"}`}>
        <div className="chat-widget-header">
          <div className="chat-widget-header-info">
            <div className="chat-widget-avatar">
              <i className="fas fa-robot"></i>
              <span className="chat-widget-status-dot"></span>
            </div>
            <div>
              <div className="chat-widget-title-text">Trợ lý AI</div>
              <div className="chat-widget-subtitle-text">
                <i className="fas fa-circle" style={{ fontSize: 6, color: "#4cd964" }}></i>
                Trực tuyến
              </div>
            </div>
          </div>
          <button className="chat-widget-close-btn" onClick={() => setOpen(false)}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="chat-widget-body">
          {messages.map((msg, idx) => (
            <div
              key={`${msg.time?.getTime?.() || idx}-${idx}`}
              className={`chat-widget-message-row ${msg.from === "user" ? "user" : "bot"}`}
            >
              {msg.from !== "user" && (
                <div className="chat-widget-msg-avatar">
                  <i className="fas fa-robot"></i>
                </div>
              )}
              <div className="chat-widget-bubble-wrap">
                <div className="chat-widget-message-bubble">
                  {msg.text}
                </div>
                <span className="chat-widget-message-time">
                  {formatTime(msg.time)}
                </span>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className="chat-widget-suggestions">
          {suggestions.map((s) => (
            <button
              key={s}
              className="chat-widget-suggestion-btn"
              onClick={() => sendMessage(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <form className="chat-widget-footer" onSubmit={handleSubmit}>
          <div className="chat-widget-input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi..."
              className="chat-widget-input"
            />
          </div>
          <button type="submit" className="chat-widget-send-btn">
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>

      <button
        className={`chat-widget-fab ${open ? "active" : "inactive"}`}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <i className="fas fa-times"></i>
        ) : (
          <i className="fas fa-comments"></i>
        )}
      </button>
    </>
  );
};

const chatWidgetStyles = `
/* Custom CSS for Chat Widget */
@keyframes chat-pulse-ring {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 106, 0, 0.6); }
  70% { transform: scale(1); box-shadow: 0 0 0 12px rgba(255, 106, 0, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 106, 0, 0); }
}

@keyframes chat-pulse-green {
  0% { box-shadow: 0 0 0 0 rgba(76, 217, 100, 0.7); }
  70% { box-shadow: 0 0 0 6px rgba(76, 217, 100, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 217, 100, 0); }
}

@keyframes chat-fade-in {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.chat-widget-fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 9999;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6a00 0%, #ff8c3a 100%);
  color: #fff;
  border: none;
  box-shadow: 0 8px 25px rgba(255, 106, 0, 0.35);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.chat-widget-fab.inactive {
  animation: chat-pulse-ring 2.5s infinite;
}

.chat-widget-fab:hover {
  transform: scale(1.1) rotate(8deg);
  box-shadow: 0 10px 30px rgba(255, 106, 0, 0.55);
}

.chat-widget-fab:active {
  transform: scale(0.95);
}

.chat-widget-panel {
  position: fixed;
  right: 24px;
  bottom: 96px;
  width: 380px;
  height: 550px;
  max-height: calc(100vh - 120px);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  z-index: 9999;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12), 0 5px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: bottom right;
}

.chat-widget-panel.closed {
  transform: translateY(30px) scale(0.85);
  opacity: 0;
  pointer-events: none;
}

.chat-widget-panel.open {
  transform: translateY(0) scale(1);
  opacity: 1;
  pointer-events: auto;
}

.chat-widget-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #ff6a00 0%, #ff8c3a 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.chat-widget-header-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-widget-avatar {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.chat-widget-avatar i {
  font-size: 20px;
  color: #fff;
}

.chat-widget-status-dot {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4cd964;
  border: 2px solid #ff6a00;
  animation: chat-pulse-green 2s infinite;
}

.chat-widget-title-text {
  font-weight: 700;
  font-size: 16px;
  line-height: 1.2;
}

.chat-widget-subtitle-text {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.chat-widget-close-btn {
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 18px;
}

.chat-widget-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.chat-widget-body {
  padding: 20px 16px;
  overflow-y: auto;
  flex: 1;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Custom scrollbar for chat body */
.chat-widget-body::-webkit-scrollbar {
  width: 6px;
}
.chat-widget-body::-webkit-scrollbar-track {
  background: transparent;
}
.chat-widget-body::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}
.chat-widget-body::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.2);
}

.chat-widget-message-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  max-width: 85%;
  opacity: 0;
  animation: chat-fade-in 0.3s ease-out forwards;
}

.chat-widget-message-row.bot {
  align-self: flex-start;
}

.chat-widget-message-row.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.chat-widget-msg-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6a00 0%, #ff8c3a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 13px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(255, 106, 0, 0.25);
  border: 1px solid rgba(255,255,255,0.8);
}

.chat-widget-bubble-wrap {
  display: flex;
  flex-direction: column;
}

.chat-widget-message-bubble {
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.chat-widget-message-row.bot .chat-widget-message-bubble {
  background: #fff;
  color: #333;
  border-radius: 16px 16px 16px 4px;
  border: 1px solid #eaeaea;
}

.chat-widget-message-row.user .chat-widget-message-bubble {
  background: linear-gradient(135deg, #ff6a00 0%, #ff8c3a 100%);
  color: #fff;
  border-radius: 16px 16px 4px 16px;
}

.chat-widget-message-time {
  font-size: 9px;
  color: #aaa;
  margin-top: 4px;
  padding: 0 4px;
}

.chat-widget-message-row.bot .chat-widget-message-time {
  align-self: flex-start;
}

.chat-widget-message-row.user .chat-widget-message-time {
  align-self: flex-end;
}

.chat-widget-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px;
  background: #fff;
  border-top: 1px solid #f1f3f5;
}

.chat-widget-suggestion-btn {
  border: 1px solid rgba(255, 106, 0, 0.25);
  background: rgba(255, 106, 0, 0.03);
  color: #ff6a00;
  border-radius: 15px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  outline: none;
}

.chat-widget-suggestion-btn:hover {
  background: #ff6a00;
  color: #fff;
  border-color: #ff6a00;
  transform: translateY(-1.5px);
  box-shadow: 0 4px 10px rgba(255, 106, 0, 0.25);
}

.chat-widget-footer {
  display: flex;
  gap: 10px;
  padding: 12px 16px 20px 16px;
  border-top: 1px solid #f1f3f5;
  background: #fff;
  align-items: center;
}

.chat-widget-input-wrapper {
  flex: 1;
}

.chat-widget-input {
  width: 100%;
  border-radius: 24px;
  border: 1px solid #e0e0e0;
  padding: 10px 16px;
  outline: none;
  font-size: 14px;
  background: #f8f9fa;
  transition: all 0.25s;
}

.chat-widget-input:focus {
  border-color: #ff6a00;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255, 106, 0, 0.15);
}

.chat-widget-send-btn {
  border: none;
  background: linear-gradient(135deg, #ff6a00 0%, #ff8c3a 100%);
  color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(255, 106, 0, 0.25);
  transition: all 0.2s;
  font-size: 15px;
  outline: none;
  flex-shrink: 0;
}

.chat-widget-send-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 14px rgba(255, 106, 0, 0.35);
}

.chat-widget-send-btn:active {
  transform: scale(0.95);
}

@media (max-width: 480px) {
  .chat-widget-panel {
    right: 12px;
    left: 12px;
    bottom: 84px;
    width: auto;
    height: calc(100vh - 110px);
    border-radius: 16px;
  }
}
`;

export default ChatWidget;
