import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    street: '',
    city: '',
    country: '',
  });

  useEffect(() => {
    try {
      // Get user info from localStorage
      const token = localStorage.getItem('authToken');
      const userFromStorage = JSON.parse(localStorage.getItem('user') || 'null');
      
      if (!token) {
        navigate('/Login');
        return;
      }

      // Try to decode JWT to get more info
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

      setUser(userInfo);
      setLoading(false);
    } catch (e) {
      console.error('Error loading profile:', e);
      setLoading(false);
      navigate('/Login');
    }
  }, [navigate]);

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

  const handleSave = () => {
    const updatedUser = {
      ...user,
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      mobileNumber: editForm.mobileNumber,
      address: {
        street: editForm.street,
        city: editForm.city,
        country: editForm.country,
      },
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
    alert('Cập nhật thông tin thành công!');
  };

  const handleCancel = () => {
    setIsEditing(false);
  };


  if (loading) {
    return (
      <section className="section-content padding-y">
        <div className="container">
          <div className="text-center">
            <h3>Đang tải...</h3>
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section-content padding-y">
        <div className="container">
          <div className="alert alert-danger">
            <h3>Không tìm thấy thông tin người dùng</h3>
            <p>Vui lòng <a href="/Login">đăng nhập</a> lại</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-content padding-y">
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3">
            <div className="card">
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="fa fa-user-circle fa-5x text-primary"></i>
                </div>
                <h5>{user.email || user.username || 'User'}</h5>
                <small className="text-muted">Thành viên từ 2024</small>
              </div>
            </div>
            
            <div className="card mt-3">
              <div className="list-group">
                <a href="#profile" className="list-group-item list-group-item-action active">
                  <i className="fa fa-user"></i> Hồ sơ
                </a>
                <a href="#orders" className="list-group-item list-group-item-action">
                  <i className="fa fa-shopping-cart"></i> Đơn hàng
                </a>
                <a href="#addresses" className="list-group-item list-group-item-action">
                  <i className="fa fa-map-marker"></i> Địa chỉ
                </a>
                <a href="#settings" className="list-group-item list-group-item-action">
                  <i className="fa fa-cog"></i> Cài đặt
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9">
            <div className="card">
              <div className="card-header">
                <h4>Thông tin hồ sơ của tôi</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="text-muted">Email</label>
                    <p>{user.email || 'Chưa cập nhật'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="text-muted">Tên người dùng</label>
                    <p>{user.username || user.email?.split('@')[0] || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="text-muted">Họ</label>
                    <p><strong>{user.lastName || 'Chưa cập nhật'}</strong></p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="text-muted">Tên</label>
                    <p><strong>{user.firstName || 'Chưa cập nhật'}</strong></p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="text-muted">Số điện thoại</label>
                    <p><strong>{user.mobileNumber || user.phone || 'Chưa cập nhật'}</strong></p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="text-muted">Vai trò</label>
                    <p>
                      <span className="badge badge-primary">
                        {user.role || user.roles?.[0]?.roleName || 'USER'}
                      </span>
                    </p>
                  </div>
                </div>

                <hr />

                <div className="mb-3">
                  <h5>Địa chỉ</h5>
                  {user.address ? (
                    <div>
                      <p><strong>{user.address.street}</strong></p>
                      <p>{user.address.buildingName || ''}</p>
                      <p>
                        {user.address.city} {user.address.state}
                      </p>
                      <p>{user.address.country} - {user.address.pincode}</p>
                    </div>
                  ) : (
                    <p className="text-muted">Chưa có địa chỉ. <a href="#edit">Thêm địa chỉ</a></p>
                  )}
                </div>

                <hr />

                <div className="mb-3">
                  <h5>Đơn hàng gần đây</h5>
                  <p className="text-muted">Bạn chưa có đơn hàng nào.</p>
                </div>

                {isEditing ? (
                  <>
                    <h5 className="mb-3">Chỉnh sửa hồ sơ</h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label>Họ</label>
                        <input type="text" name="lastName" className="form-control" value={editForm.lastName} onChange={handleEditChange} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Tên</label>
                        <input type="text" name="firstName" className="form-control" value={editForm.firstName} onChange={handleEditChange} />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label>Số điện thoại</label>
                      <input type="text" name="mobileNumber" className="form-control" value={editForm.mobileNumber} onChange={handleEditChange} />
                    </div>
                    <hr />
                    <h5 className="mb-3">Địa chỉ</h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label>Số nhà / Đường phố</label>
                        <input type="text" name="street" className="form-control" value={editForm.street} onChange={handleEditChange} />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Thành phố</label>
                        <input type="text" name="city" className="form-control" value={editForm.city} onChange={handleEditChange} />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label>Quốc gia</label>
                        <input type="text" name="country" className="form-control" value={editForm.country} onChange={handleEditChange} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <button className="btn btn-primary" onClick={handleSave}><i className="fa fa-save"></i> Lưu thay đổi</button>
                      <button className="btn btn-outline-secondary ml-2" onClick={handleCancel}><i className="fa fa-times"></i> Hủy</button>
                    </div>
                  </>
                ) : (
                  <div className="mt-4">
                    <button className="btn btn-primary" onClick={handleEditClick}>
                      <i className="fa fa-edit"></i> Chỉnh sửa hồ sơ
                    </button>
                    <button className="btn btn-outline-danger ml-2">
                      <i className="fa fa-lock"></i> Đổi mật khẩu
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
