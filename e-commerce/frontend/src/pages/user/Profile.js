import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GET_ALL, fetchUserProfile, updateUserBackend } from '../../api/apiService';
import axiosPublic, { axiosPrivate } from "../../api/axiosConfig";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // tabs: 'profile', 'orders', 'address'
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    street: '',
    city: '',
    country: '',
  });

  // Orders list state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // tracking active expanded detail card

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userFromStorage = JSON.parse(localStorage.getItem('user') || 'null');
        
        if (!token) {
          navigate('/Login');
          return;
        }

        let userInfo = userFromStorage || {};
        
        if (token && !userFromStorage) {
          try {
            const parts = token.split('.');
            if (parts.length >= 2) {
              const payload = parts[1];
              const decoded = JSON.parse(
                decodeURIComponent(
                  atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
                )
              );
              userInfo = decoded;
            }
          } catch (e) {
            console.error('Error decoding token:', e);
          }
        }

        const email = userInfo.email || userInfo.username || userInfo.sub || userInfo.user;
        if (email) {
          try {
            const profile = await fetchUserProfile(email);
            if (profile) {
              const mergedUser = { ...userInfo, ...profile };
              setUser(mergedUser);
              localStorage.setItem('user', JSON.stringify(mergedUser));
            } else {
              setUser(userInfo);
            }
          } catch (err) {
            console.error("Failed to fetch user profile details:", err);
            setUser(userInfo);
          }
        } else {
          setUser(userInfo);
        }
        setLoading(false);
      } catch (e) {
        console.error('Error loading profile:', e);
        setLoading(false);
        navigate('/Login');
      }
    };

    loadProfile();
  }, [navigate]);

  // Fetch orders from database when activeTab changes to 'orders'
  useEffect(() => {
    const email = user?.email || user?.username || user?.sub || user?.user;
    if (activeTab === 'orders' && email) {
      setLoadingOrders(true);
      const token = localStorage.getItem("authToken");
      
      const config = {
        method: 'GET',
        url: `public/users/${email}/orders`,
        headers: { 
          "Content-Type": "application/json", 
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      };

      axiosPrivate(config)
        .then((response) => {
          setOrders(response.data || []);
          setLoadingOrders(false);
        })
        .catch((error) => {
          console.error('Failed to fetch user orders:', error);
          setLoadingOrders(false);
        });
    }
  }, [activeTab, user]);

  const handleEditClick = () => {
    setEditForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      mobileNumber: user?.mobileNumber || '',
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      country: user?.address?.country || '',
    });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const updatedUserPayload = {
        userId: user.userId,
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        mobileNumber: editForm.mobileNumber,
        email: user.email,
        address: {
          addressId: user.address?.addressId || null,
          buildingName: user.address?.buildingName || '',
          street: editForm.street,
          city: editForm.city,
          state: editForm.city,
          country: editForm.country,
          pincode: user.address?.pincode || '00000',
        }
      };

      if (user.userId) {
        const response = await updateUserBackend(user.userId, updatedUserPayload);
        if (response) {
          const mergedUser = { ...user, ...response };
          setUser(mergedUser);
          localStorage.setItem('user', JSON.stringify(mergedUser));
          setIsEditing(false);
          alert('Cập nhật thông tin thành công!');
        }
      } else {
        alert('Không tìm thấy thông tin định danh người dùng để cập nhật.');
      }
    } catch (err) {
      console.error('Failed to update user profile:', err);
      alert('Không thể cập nhật thông tin: ' + (err?.response?.data?.message || err?.message || 'Lỗi kết nối'));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const getProductImage = (prod) => {
    if (prod?.image) {
      if (prod.image.startsWith('http://') || prod.image.startsWith('https://')) {
        return prod.image;
      }
      try {
        return require(`../../assets/images/items/${prod.image}`);
      } catch (e) {
        return `http://localhost:8080/api/public/products/image/${prod.image}`;
      }
    }
    return '';
  };

  const toggleOrderExpand = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const getOrderStatusBadgeColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('chờ') || s.includes('pending')) return 'badge-warning';
    if (s.includes('giao') || s.includes('deliver') || s.includes('shipping')) return 'badge-info';
    if (s.includes('hoàn') || s.includes('complete') || s.includes('success')) return 'badge-success';
    if (s.includes('hủy') || s.includes('cancel')) return 'badge-danger';
    return 'badge-primary';
  };

  if (loading) {
    return (
      <section className="section-content padding-y" style={{ minHeight: '80vh' }}>
        <div className="container">
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Đang tải...</span>
            </div>
            <h5 className="mt-3">Đang tải thông tin hồ sơ...</h5>
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section-content padding-y" style={{ minHeight: '80vh' }}>
        <div className="container">
          <div className="alert alert-danger text-center">
            <h3>Không tìm thấy thông tin người dùng</h3>
            <p>Vui lòng <a href="/Login">đăng nhập</a> lại.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-content padding-y" style={{ fontFamily: 'Inter, sans-serif', minHeight: '80vh', background: '#f8fafc', padding: '40px 0' }}>
      <div className="container">
        <div className="row">
          {/* Left Sidebar */}
          <div className="col-md-3 mb-4">
            <div className="card shadow-sm" style={{ border: 'none', borderRadius: '16px', overflow: 'hidden' }}>
              <div className="card-body text-center p-4" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)' }}>
                <div className="mb-3">
                  <i className="fa fa-user-circle fa-5x" style={{ color: '#2b80dd' }}></i>
                </div>
                <h6 style={{ fontWeight: '800', wordBreak: 'break-all', margin: 0 }}>{user.email || user.username || 'Thành viên'}</h6>
                <small className="text-muted d-block mt-1">Hội viên dientu.vn</small>
              </div>
            </div>
            
            <div className="card shadow-sm mt-3" style={{ border: 'none', borderRadius: '16px', overflow: 'hidden' }}>
              <div className="list-group list-group-flush">
                <button 
                  onClick={() => { setActiveTab('profile'); setIsEditing(false); }} 
                  className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === 'profile' ? 'active' : ''}`}
                  style={activeTab === 'profile' ? { background: '#2b80dd', fontWeight: '700' } : { fontWeight: '600', color: '#475569' }}
                >
                  <i className="fa fa-user mr-2"></i> Hồ sơ của tôi
                </button>
                <button 
                  onClick={() => setActiveTab('orders')} 
                  className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === 'orders' ? 'active' : ''}`}
                  style={activeTab === 'orders' ? { background: '#2b80dd', fontWeight: '700' } : { fontWeight: '600', color: '#475569' }}
                >
                  <i className="fa fa-shopping-bag mr-2"></i> Đơn hàng của tôi
                </button>
                <button 
                  onClick={() => setActiveTab('address')} 
                  className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === 'address' ? 'active' : ''}`}
                  style={activeTab === 'address' ? { background: '#2b80dd', fontWeight: '700' } : { fontWeight: '600', color: '#475569' }}
                >
                  <i className="fa fa-map-marker mr-2"></i> Địa chỉ nhận hàng
                </button>
              </div>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="col-md-9">
            {activeTab === 'profile' && (
              <div className="card shadow-sm" style={{ border: 'none', borderRadius: '16px' }}>
                <div className="card-header bg-white py-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <h4 className="m-0" style={{ fontWeight: '850', color: '#1e293b' }}>Thông tin hồ sơ của tôi</h4>
                </div>
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="text-muted mb-1" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Địa chỉ Email</label>
                      <p style={{ fontWeight: '600', color: '#1e293b' }}>{user.email || 'Chưa cập nhật'}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="text-muted mb-1" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Tên đăng nhập</label>
                      <p style={{ fontWeight: '600', color: '#1e293b' }}>{user.username || user.email?.split('@')[0] || 'Chưa cập nhật'}</p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="text-muted mb-1" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Họ</label>
                      <p style={{ fontWeight: '600', color: '#1e293b' }}>{user.lastName || 'Chưa cập nhật'}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="text-muted mb-1" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Tên</label>
                      <p style={{ fontWeight: '600', color: '#1e293b' }}>{user.firstName || 'Chưa cập nhật'}</p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="text-muted mb-1" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Số điện thoại</label>
                      <p style={{ fontWeight: '600', color: '#1e293b' }}>{user.mobileNumber || user.phone || 'Chưa cập nhật'}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="text-muted mb-1" style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase' }}>Vai trò tài khoản</label>
                      <p style={{ margin: 0 }}>
                        <span className="badge badge-primary font-weight-bold px-3 py-2" style={{ borderRadius: '6px' }}>
                          {user.role || user.roles?.[0]?.roleName || 'USER'}
                        </span>
                      </p>
                    </div>
                  </div>

                  <hr style={{ borderColor: '#f1f5f9', margin: '20px 0' }} />

                  {isEditing ? (
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <h5 className="mb-3" style={{ fontWeight: '800' }}>Cập nhật thông tin</h5>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label style={{ fontSize: '13px', fontWeight: '600' }}>Họ</label>
                          <input type="text" name="lastName" className="form-control" value={editForm.lastName} onChange={handleEditChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label style={{ fontSize: '13px', fontWeight: '600' }}>Tên</label>
                          <input type="text" name="firstName" className="form-control" value={editForm.firstName} onChange={handleEditChange} />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label style={{ fontSize: '13px', fontWeight: '600' }}>Số điện thoại</label>
                        <input type="text" name="mobileNumber" className="form-control" value={editForm.mobileNumber} onChange={handleEditChange} />
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label style={{ fontSize: '13px', fontWeight: '600' }}>Địa chỉ nhận hàng (Số nhà / Đường phố)</label>
                          <input type="text" name="street" className="form-control" value={editForm.street} onChange={handleEditChange} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label style={{ fontSize: '13px', fontWeight: '600' }}>Thành phố</label>
                          <input type="text" name="city" className="form-control" value={editForm.city} onChange={handleEditChange} />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label style={{ fontSize: '13px', fontWeight: '600' }}>Quốc gia</label>
                        <input type="text" name="country" className="form-control" value={editForm.country} onChange={handleEditChange} />
                      </div>
                      <div className="mt-3">
                        <button className="btn btn-primary px-4 font-weight-bold" onClick={handleSave} style={{ borderRadius: '20px' }}>Lưu thay đổi</button>
                        <button className="btn btn-outline-secondary px-4 ml-2 font-weight-bold" onClick={handleCancel} style={{ borderRadius: '20px' }}>Hủy</button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <button className="btn btn-primary px-4 font-weight-bold" onClick={handleEditClick} style={{ borderRadius: '20px' }}>
                        <i className="fa fa-edit mr-2"></i> Chỉnh sửa hồ sơ
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="card shadow-sm" style={{ border: 'none', borderRadius: '16px' }}>
                <div className="card-header bg-white py-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <h4 className="m-0" style={{ fontWeight: '850', color: '#1e293b' }}>Lịch sử đặt hàng</h4>
                </div>
                <div className="card-body p-4">
                  {loadingOrders ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Đang tải đơn hàng...</span>
                      </div>
                      <p className="mt-2 text-muted">Đang tìm lịch sử đơn hàng...</p>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fa fa-shopping-basket fa-3x text-muted mb-3"></i>
                      <h5 style={{ fontWeight: '750', color: '#475569' }}>Bạn chưa có đơn hàng nào</h5>
                      <p className="text-muted mb-4">Hãy tiếp tục khám phá các thiết bị công nghệ đỉnh cao của dientu.vn nhé!</p>
                      <a href="/ListingGrid" className="btn btn-primary px-4 font-weight-bold" style={{ borderRadius: '20px' }}>Mua sắm ngay</a>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover border-0">
                        <thead>
                          <tr style={{ background: '#f8fafc', color: '#475569', fontSize: '13px' }}>
                            <th className="border-0">Mã đơn hàng</th>
                            <th className="border-0">Ngày đặt</th>
                            <th className="border-0">Tổng tiền</th>
                            <th className="border-0">Thanh toán</th>
                            <th className="border-0">Trạng thái</th>
                            <th className="border-0 text-center">Hành động</th>
                          </tr>
                        </thead>
                        <tbody style={{ fontSize: '13.5px' }}>
                          {orders.map((ord) => (
                            <React.Fragment key={ord.orderId}>
                              <tr>
                                <td style={{ fontWeight: '800', color: '#2b80dd' }}>#ORD-{ord.orderId}</td>
                                <td>{ord.orderDate ? new Date(ord.orderDate).toLocaleDateString('vi-VN') : 'Chưa rõ'}</td>
                                <td style={{ fontWeight: '700', color: '#1e293b' }}>{ord.totalAmount?.toLocaleString()} VND</td>
                                <td>
                                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>
                                    {ord.payment?.paymentMethod || 'COD'}
                                  </span>
                                </td>
                                <td>
                                  <span className={`badge ${getOrderStatusBadgeColor(ord.orderStatus)} px-2 py-1 font-weight-bold`} style={{ borderRadius: '4px', fontSize: '11px' }}>
                                    {ord.orderStatus || 'Đang xử lý'}
                                  </span>
                                </td>
                                <td className="text-center">
                                  <button 
                                    className="btn btn-outline-primary btn-sm font-weight-bold px-3" 
                                    style={{ borderRadius: '20px' }}
                                    onClick={() => toggleOrderExpand(ord.orderId)}
                                  >
                                    {expandedOrderId === ord.orderId ? 'Thu gọn' : 'Xem chi tiết'}
                                  </button>
                                </td>
                              </tr>

                              {/* Expanded items list */}
                              {expandedOrderId === ord.orderId && (
                                <tr>
                                  <td colSpan="6" style={{ background: '#f8fafc', padding: '20px' }}>
                                    <div className="card border-0 shadow-none m-0" style={{ background: 'transparent' }}>
                                      <h6 style={{ fontWeight: '800', color: '#1e293b', marginBottom: '15px' }}>
                                        <i className="fa fa-list mr-2 text-primary"></i> Chi tiết sản phẩm đã mua:
                                      </h6>
                                      
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {ord.orderItems?.map((item) => (
                                          <div 
                                            key={item.orderItemId}
                                            style={{ display: 'flex', alignItems: 'center', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '12px 15px' }}
                                          >
                                            <div style={{ width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: '15px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #f1f5f9', background: '#f8fafc', flexShrink: 0 }}>
                                              <img 
                                                src={getProductImage(item.product)} 
                                                alt={item.product?.productName} 
                                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                                              />
                                            </div>
                                            
                                            <div style={{ flexGrow: 1, textAlign: 'left' }}>
                                              <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', display: 'block' }}>{item.product?.productName}</span>
                                              <span style={{ fontSize: '12px', color: '#64748b' }}>Đơn giá: {item.orderedProductPrice?.toLocaleString()} VND</span>
                                            </div>
                                            
                                            <div style={{ textAlign: 'right', flexShrink: 0, minWidth: '100px' }}>
                                              <strong style={{ fontSize: '13px', color: '#1e293b', display: 'block' }}>Số lượng: x{item.quantity}</strong>
                                              <strong style={{ fontSize: '13.5px', color: '#2b80dd', display: 'block', marginTop: '2px' }}>
                                                {((item.orderedProductPrice || 0) * (item.quantity || 0)).toLocaleString()} VND
                                              </strong>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'address' && (
              <div className="card shadow-sm" style={{ border: 'none', borderRadius: '16px' }}>
                <div className="card-header bg-white py-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <h4 className="m-0" style={{ fontWeight: '850', color: '#1e293b' }}>Địa chỉ nhận hàng</h4>
                </div>
                <div className="card-body p-4">
                  {user.address ? (
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="fa fa-map-marker-alt text-primary fa-lg"></i>
                        <h6 className="m-0" style={{ fontWeight: '800' }}>Địa chỉ mặc định</h6>
                      </div>
                      <hr style={{ borderColor: '#e2e8f0', margin: '10px 0' }} />
                      <p className="mb-1" style={{ fontSize: '14px', color: '#1e293b' }}><strong>Đường phố / Số nhà:</strong> {user.address.street || 'Chưa cập nhật'}</p>
                      <p className="mb-1" style={{ fontSize: '14px', color: '#1e293b' }}><strong>Thành phố:</strong> {user.address.city || 'Chưa cập nhật'}</p>
                      <p className="mb-0" style={{ fontSize: '14px', color: '#1e293b' }}><strong>Quốc gia:</strong> {user.address.country || 'Chưa cập nhật'}</p>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted">Bạn chưa lưu địa chỉ nhận hàng nào.</p>
                      <button className="btn btn-primary font-weight-bold px-4" onClick={handleEditClick} style={{ borderRadius: '20px' }}>Thêm địa chỉ</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
