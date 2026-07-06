import React from 'react';

const WarrantyPolicy = () => {
  return (
    <div className="container padding-y" style={{ fontFamily: 'Inter, sans-serif', minHeight: '80vh', marginTop: '30px' }}>
      {/* Hero Header */}
      <div style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2b80dd 100%)', borderRadius: '16px', padding: '50px 30px', color: '#ffffff', textAlign: 'center', marginBottom: '40px', boxShadow: '0 8px 24px rgba(43, 128, 221, 0.15)' }}>
        <h1 style={{ fontWeight: '900', fontSize: '32px', marginBottom: '15px' }}>CHÍNH SÁCH BẢO HÀNH CHÍNH HÃNG</h1>
        <p style={{ fontSize: '16px', color: '#eff6ff', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
          Chính sách hậu mãi vượt trội, hỗ trợ chuyên nghiệp nhanh chóng giúp quý khách hàng hoàn toàn yên tâm khi sử dụng sản phẩm từ dientu.vn.
        </p>
      </div>

      <div className="row">
        {/* Warranty Periods */}
        <div className="col-lg-7 mb-4">
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '30px', border: '1px solid #e2e8f0', height: '100%', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <h4 style={{ color: '#2b80dd', fontWeight: '800', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-clock"></i> Thời hạn bảo hành các nhóm sản phẩm
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
                <strong style={{ fontSize: '15px', color: '#1e293b', display: 'block' }}>Máy chơi game Console (PS4, PS5)</strong>
                <span style={{ fontSize: '13px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                  Bảo hành <strong>12 tháng phần cứng</strong> đối với thân máy. Bảo hành trọn đời đối với dịch vụ chép game Việt hóa và cài đặt phần mềm hệ thống tại cửa hàng.
                </span>
              </div>

              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
                <strong style={{ fontSize: '15px', color: '#1e293b', display: 'block' }}>Điện thoại di động & Máy tính bảng (iPhone, iPad, Samsung)</strong>
                <span style={{ fontSize: '13px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                  Bảo hành <strong>12 tháng chính hãng</strong>. Hỗ trợ 1 đổi 1 trong vòng 30 ngày đầu tiên nếu xảy ra các lỗi phần cứng thuộc nhà sản xuất (như lỗi nguồn, lỗi màn hình).
                </span>
              </div>

              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>
                <strong style={{ fontSize: '15px', color: '#1e293b', display: 'block' }}>Thiết bị nhiếp ảnh (Máy ảnh, Ống kính Canon, Sony, Fujifilm, Ricoh)</strong>
                <span style={{ fontSize: '13px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                  Bảo hành từ <strong>12 đến 24 tháng</strong> theo đúng phiếu bảo hành của các nhà phân phối ủy quyền chính thức tại Việt Nam.
                </span>
              </div>

              <div>
                <strong style={{ fontSize: '15px', color: '#1e293b', display: 'block' }}>Phụ kiện công nghệ & Đồng hồ thông minh</strong>
                <span style={{ fontSize: '13px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                  Bảo hành <strong>6 tháng đổi mới</strong> đối với sạc dự phòng, cáp kết nối, tai nghe chụp tai và đồng hồ thông minh (Apple Watch).
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Warranty Conditions & Rules */}
        <div className="col-lg-5 mb-4">
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '30px', border: '1px solid #e2e8f0', height: '100%', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <h4 style={{ color: '#2b80dd', fontWeight: '800', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-shield-alt"></i> Điều kiện nhận bảo hành
            </h4>
            
            <ul style={{ paddingLeft: '20px', fontSize: '13.5px', color: '#475569', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li>Sản phẩm còn nằm trong thời gian bảo hành và số serial/IMEI ghi trên máy trùng khớp với phiếu bán hàng của dientu.vn.</li>
              <li>Tem bảo hành dán trên thân máy, ốc niêm phong phải còn nguyên vẹn, không có dấu hiệu bị rách nát, tẩy xóa hay dán đè tem khác lên.</li>
              <li>Sản phẩm gặp lỗi phần cứng phát sinh do lỗi từ nhà sản xuất trong quá trình vận hành bình thường.</li>
              <li>Màn hình thiết bị không có dấu hiệu nứt vỡ hay sọc do tác động lực cơ học bên ngoài.</li>
            </ul>

            <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '12px', padding: '15px', marginTop: '25px' }}>
              <strong style={{ color: '#d97706', fontSize: '13px', display: 'block', marginBottom: '4px' }}>
                <i className="fas fa-exclamation-triangle mr-1"></i> Lưu ý từ chối bảo hành
              </strong>
              <span style={{ fontSize: '12px', color: '#b45309', display: 'block', lineHeight: 1.6 }}>
                Không áp dụng bảo hành đối với sản phẩm bị rơi vỡ nứt, thấm nước vào bo mạch máy, chập cháy nguồn do dùng sai dòng điện sạc, hoặc đã tháo gỡ sửa chữa ở đơn vị khác ngoài cửa hàng chúng tôi.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Address Callout */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        <div className="row align-items-center">
          <div className="col-md-8 mb-3 mb-md-0">
            <h5 style={{ color: '#1e293b', fontWeight: '800', margin: '0 0 8px 0' }}>Trung tâm Bảo hành & Sửa chữa dientu.vn</h5>
            <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
              Quý khách vui lòng mang thiết bị trực tiếp đến địa chỉ bên dưới hoặc liên hệ tổng đài kỹ thuật để được hỗ trợ hướng dẫn đóng gói gửi chuyển phát nhanh bảo hành từ xa.
            </p>
          </div>
          <div className="col-md-4 text-md-right">
            <div style={{ display: 'inline-block', background: '#eff6ff', padding: '12px 20px', borderRadius: '12px', border: '1px solid #dbeafe', textAlign: 'left' }}>
              <strong style={{ color: '#2b80dd', fontSize: '12px', textTransform: 'uppercase', display: 'block' }}>Địa chỉ gửi nhận</strong>
              <span style={{ fontSize: '14px', color: '#1e293b', fontWeight: '700', marginTop: '2px', display: 'block' }}>
                601 Nguyễn Đình Chiểu, Q.3, TP.HCM
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantyPolicy;
