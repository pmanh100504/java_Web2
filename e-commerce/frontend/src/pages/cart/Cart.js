import React, { useEffect, useState } from "react";
import {Link } from 'react-router-dom';
import { updateCartItemQuantity, removeFromCart, fetchCartById, getOrFetchCartId } from "../../api/apiService";


const Cart = () => {
  const [items, setItems] = useState([]);

  const loadCart = () => {
    try {
      const raw = localStorage.getItem('cart') || '[]';
      const arr = JSON.parse(raw);
      setItems(Array.isArray(arr) ? arr : []);
    } catch (e) {
      setItems([]);
    }
  };

  const getImageUrl = (it) => {
    if (!it) return null;
    let img = it.image || it.img || it.imageUrl || '';
    if (!img) return null;
    // if already absolute url, return as-is
    if (typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/'))) {
      return img;
    }
    // otherwise assume backend serves images at /api/public/products/image/{filename}
    const base = process.env.REACT_APP_API_PUBLIC_BASE || 'http://localhost:8080/api/public';
    // trim trailing slash from base if present
    const b = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${b}/products/image/${img}`;
  };

  useEffect(() => {
    loadCart();

    const syncWithBackend = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const cartId = await getOrFetchCartId();
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const email = user.email || user.username || user.sub || user.user;

        if (token && cartId && email) {
          const cartData = await fetchCartById(cartId, email);
          if (cartData && cartData.products) {
            localStorage.setItem('cart', JSON.stringify(cartData.products));
            setItems(cartData.products);
          }
        }
      } catch (err) {
        console.error("Failed to load/sync cart with backend:", err);
      }
    };

    syncWithBackend();

    const onCart = () => loadCart();
    window.addEventListener('cartUpdated', onCart);
    window.addEventListener('storage', onCart);
    return () => {
      window.removeEventListener('cartUpdated', onCart);
      window.removeEventListener('storage', onCart);
    };
  }, []);

  const removeItem = async (productId) => {
    try {
      const arr = await removeFromCart(productId);
      setItems(arr);
    } catch (e) {
      console.error(e);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    try {
      const updated = await updateCartItemQuantity(productId, newQuantity);
      setItems(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const increaseQuantity = (productId, currentQty) => {
    updateQuantity(productId, currentQty + 1);
  };

  const decreaseQuantity = (productId, currentQty) => {
    if (currentQty > 1) {
      updateQuantity(productId, currentQty - 1);
    }
  };

  const totalPrice = items.reduce((s, it) => s + ((it.specialPrice || it.price || 0) * (it.quantity || 1)), 0);

  if (!items || items.length === 0) {
    return (
      <section className="section-content padding-y">
        <div className="container">
          <div className="row">
            <main className="col-md-12">
              <div className="card">
                <div className="card-body text-center">
                  <h4>Giỏ hàng không có gì</h4>
                  <p>Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
                  <Link to="/ListingGrid" className="btn btn-primary">Tiếp tục mua sắm</Link>
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-content padding-y">
      <div className="container">
        <div className="row">
          <main className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Giỏ hàng</h4>
                <div className="table-responsive">
                  <table className="table table-shopping-cart">
                    <thead>
                      <tr>
                        <th>Hàng hóa</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                        <th className="text-right">Tổng</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="media">
                              {getImageUrl(it) ? (
                                <img src={getImageUrl(it)} alt={it.productName} style={{ width: 96, height: 96, objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: 96, height: 96, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>No Image</div>
                              )}
                              <div className="media-body">
                                <h6 className="mt-0">{it.productName}</h6>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button 
                                className="btn btn-sm btn-outline-secondary" 
                                onClick={() => decreaseQuantity(it.productId || it.id, it.quantity || 1)}
                              >
                                −
                              </button>
                              <span style={{ minWidth: '30px', textAlign: 'center' }}>{it.quantity || 1}</span>
                              <button 
                                className="btn btn-sm btn-outline-secondary" 
                                onClick={() => increaseQuantity(it.productId || it.id, it.quantity || 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td>{(it.specialPrice || it.price || 0).toLocaleString()} VND</td>
                          <td className="text-right">{((it.specialPrice || it.price || 0) * (it.quantity || 1)).toLocaleString()} VND</td>
                          <td className="text-right">
                            <button className="btn btn-light" onClick={() => removeItem(it.productId || it.id)}>Xóa</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div></div>
                  <div>
                    <h5>Tổng cộng: {totalPrice.toLocaleString()} VND</h5>
                    <Link to="/checkout" className="btn btn-primary">Thanh toán</Link>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default Cart;
