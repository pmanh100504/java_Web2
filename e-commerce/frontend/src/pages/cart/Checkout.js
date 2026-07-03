import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { POST_ADD } from '../../api/apiService';

const Checkout = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    country: '',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart') || '[]';
      const arr = JSON.parse(raw);
      setItems(Array.isArray(arr) ? arr : []);
    } catch (e) {
      setItems([]);
    }

    // Check VNPay redirect callback params
    const queryParams = new URLSearchParams(window.location.search);
    const vnpCode = queryParams.get("vnp_ResponseCode");
    
    if (vnpCode) {
      const handleVNPayCallback = async () => {
        setLoading(true);
        if (vnpCode === "00") {
          try {
            const token = localStorage.getItem('authToken');
            const cartId = localStorage.getItem('cartId');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const email = user.email;

            if (token && cartId && email) {
              console.log('🚀 VNPay payment successful, placing order on Spring Boot backend...');
              // POST /public/users/{emailId}/carts/{cartId}/payments/VNPAY/order
              await POST_ADD(`public/users/${encodeURIComponent(email)}/carts/${cartId}/payments/VNPAY/order`);
              console.log('✅ Order placed successfully via VNPay');
              setSuccess('Thanh toán VNPay thành công! Đơn hàng của bạn đã được ghi nhận.');
              localStorage.setItem('cart', JSON.stringify([]));
              window.dispatchEvent(new CustomEvent('cartUpdated'));
            } else {
              setError('Không tìm thấy thông tin đăng nhập hoặc giỏ hàng để hoàn tất đơn hàng.');
            }
          } catch (err) {
            console.error('❌ Failed to save VNPay order:', err);
            const msg = err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi lưu đơn hàng vào hệ thống.';
            setError(`Thanh toán VNPay thành công nhưng lỗi hệ thống: ${msg}`);
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
          setError('Thanh toán VNPay thất bại hoặc đã bị hủy.');
        }
      };
      handleVNPayCallback();
    }
  }, []);

  const total = items.reduce((s, it) => s + ((it.specialPrice || it.price || 0) * (it.quantity || 1)), 0);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!items || items.length === 0) {
      setError('Giỏ hàng rỗng');
      return;
    }
    // basic validation
    if (!form.firstName || !form.lastName || !form.phone) {
      setError('Vui lòng nhập họ tên và số điện thoại');
      return;
    }

    // Simplified order payload
    const orderPayload = {
      email: form.email || 'guest@example.com',
      addressId: 0,
      paymentMethod: paymentMethod,
      // Alternative structure - try different formats
      shippingAddress: {
        street: form.street || 'N/A',
        buildingName: '',
        city: form.city || 'N/A',
        state: '',
        country: form.country || 'Vietnam',
        pincode: form.postalCode || '00000'
      }
    };

    console.log('📦 Order payload:', orderPayload);
    console.log('🛒 Cart items:', items);

    try {
      setLoading(true);
      let resp;
      if (paymentMethod === 'VNPAY') {
        try {
          const res = await fetch(`http://localhost:3002/payment?amount=${total}&returnUrl=${encodeURIComponent(window.location.origin + '/checkout')}`);
          if (!res.ok) {
            throw new Error(`Server returned status ${res.status}`);
          }
          const data = await res.json();
          setLoading(false);
          const paymentUrl = data?.url;
          if (paymentUrl) {
            // redirect user to VNPay gateway
            window.location.href = paymentUrl;
            return;
          } else {
            setError('Không nhận được URL thanh toán từ server VNPay');
            return;
          }
        } catch (paymentErr) {
          console.error('VNPay connection error:', paymentErr);
          setLoading(false);
          setError('Không thể kết nối đến máy chủ VNPay (port 3002). Vui lòng kiểm tra lại.');
          return;
        }
      } else {
        const token = localStorage.getItem('authToken');
        const cartId = localStorage.getItem('cartId');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const email = user.email || form.email;

        if (token && cartId && email) {
          console.log('🚀 Saving COD order to backend...');
          // POST /public/users/{emailId}/carts/{cartId}/payments/{paymentMethod}/order
          await POST_ADD(`public/users/${encodeURIComponent(email)}/carts/${cartId}/payments/COD/order`);
          console.log('✅ Order placed successfully on backend');
        } else {
          // COD payment - Save to localStorage directly (no API call)
          console.log('🚀 Saving COD order to localStorage...');
          const order = {
            orderId: 'ORDER-' + Date.now(),
            ...orderPayload,
            items: items,
            totalPrice: total,
            orderDate: new Date().toISOString(),
            date: new Date().toISOString(),
            status: 'Pending',
            paymentMethod: 'COD'
          };
          const orders = JSON.parse(localStorage.getItem('orders') || '[]');
          orders.push(order);
          localStorage.setItem('orders', JSON.stringify(orders));
          console.log('✅ Order saved to localStorage:', order);
        }
        
        setLoading(false);
        setSuccess('Đặt hàng thành công');
        // clear cart
        localStorage.setItem('cart', JSON.stringify([]));
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
    } catch (err) {
      setLoading(false);
      console.error('❌ Order error:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error data:', err.response?.data);
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Gửi đặt hàng thất bại. Vui lòng thử lại.';
      setError(errorMsg);
    }
  };

  if (success) {
    return (
      <section className="section-content padding-y">
        <div className="container">
          <div className="card">
            <div className="card-body text-center">
              <h4>{success}</h4>
              <p>Chúng tôi đã nhận đơn hàng của bạn. Bạn sẽ được chuyển hướng về trang chủ.</p>
              <Link to="/">Về trang chủ</Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-content padding-y">
      <div className="container">
        <div className="row">
          <main className="col-md-8">
            <div className="card mb-3">
              <div className="card-body">
                <h4>Thanh toán</h4>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label>Họ</label>
                      <input className="form-control" name="lastName" value={form.lastName} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Tên</label>
                      <input className="form-control" name="firstName" value={form.firstName} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Email</label>
                      <input className="form-control" name="email" value={form.email} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Số điện thoại</label>
                      <input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
                    </div>
                    <div className="col-12 mb-3">
                      <label>Địa chỉ</label>
                      <input className="form-control" name="street" value={form.street} onChange={handleChange} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Thành phố</label>
                      <input className="form-control" name="city" value={form.city} onChange={handleChange} />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label>Quốc gia</label>
                      <input className="form-control" name="country" value={form.country} onChange={handleChange} />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label>Mã bưu chính</label>
                      <input className="form-control" name="postalCode" value={form.postalCode} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="d-block">Phương thức thanh toán</label>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="pay" id="pay-cod" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                      <label className="form-check-label" htmlFor="pay-cod">Thanh toán khi nhận hàng (COD)</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="radio" name="pay" id="pay-vnpay" value="VNPAY" checked={paymentMethod === 'VNPAY'} onChange={() => setPaymentMethod('VNPAY')} />
                      <label className="form-check-label" htmlFor="pay-vnpay">VNPay (thanh toán online)</label>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <Link to="/cart" className="btn btn-light">Quay lại giỏ hàng</Link>
                    </div>
                    <div>
                      <button 
                        className="btn btn-primary" 
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? 'Đang gửi...' : `Thanh toán ${total.toLocaleString()} VND`}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </main>

          <aside className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h6>Đơn hàng của bạn</h6>
                <ul className="list-unstyled">
                  {items.map((it, i) => (
                    <li key={i} className="d-flex justify-content-between py-2 border-bottom">
                      <div>
                        <strong>{it.productName}</strong>
                        <div className="small text-muted">Số lượng: {it.quantity || 1}</div>
                      </div>
                      <div>{((it.specialPrice || it.price || 0) * (it.quantity || 1)).toLocaleString()} VND</div>
                    </li>
                  ))}
                </ul>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Tổng</strong>
                  <strong>{total.toLocaleString()} VND</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
