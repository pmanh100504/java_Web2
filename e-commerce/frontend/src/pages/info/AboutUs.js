import React from 'react';

const AboutUs = () => {
  return (
    <div className="container padding-y" style={{ fontFamily: 'Inter, sans-serif', minHeight: '80vh', marginTop: '30px' }}>
      {/* Title Hero Block */}
      <div style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2b80dd 100%)', borderRadius: '16px', padding: '50px 30px', color: '#ffffff', textAlign: 'center', marginBottom: '40px', boxShadow: '0 8px 24px rgba(43, 128, 221, 0.15)' }}>
        <h1 style={{ fontWeight: '900', fontSize: '32px', marginBottom: '15px' }}>VỀ CHÚNG TÔI - DIENTU.VN</h1>
        <p style={{ fontSize: '16px', color: '#eff6ff', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Hệ thống bán lẻ thiết bị công nghệ, máy chơi game PS4/PS5, máy ảnh và phụ kiện chính hãng hàng đầu tại Việt Nam.
        </p>
      </div>

      <div className="row">
        {/* Story Section */}
        <div className="col-lg-6 mb-4">
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '30px', border: '1px solid #e2e8f0', height: '100%', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <h4 style={{ color: '#2b80dd', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-history"></i> Câu chuyện thương hiệu
            </h4>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.8 }}>
              Được thành lập từ năm 2018, <strong>dientu.vn</strong> khởi đầu là một cửa hàng cung cấp máy chơi game và linh kiện nhỏ tại TP. Hồ Chí Minh. Trải qua chặng đường phát triển không ngừng nghỉ, chúng tôi đã vươn lên thành một trong những điểm đến công nghệ uy tín nhất dành cho các tín đồ đam mê công nghệ, điện thoại di động, đồng hồ thông minh, máy chơi game Console (PS4/PS5) và thiết bị nhiếp ảnh.
            </p>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.8 }}>
              Sứ mệnh của chúng tôi là mang những sản phẩm công nghệ tiên tiến nhất thế giới đến tay người tiêu dùng Việt Nam với mức giá hợp lý và dịch vụ khách hàng tận tâm nhất.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="col-lg-6 mb-4">
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '30px', border: '1px solid #e2e8f0', height: '100%', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <h4 style={{ color: '#2b80dd', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-star"></i> Giá trị cốt lõi
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ background: '#eff6ff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                  <i className="fas fa-check" style={{ color: '#2b80dd' }}></i>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '14px', color: '#1e293b' }}>Cam kết chính hãng</strong>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>100% sản phẩm phân phối là hàng chính hãng, nguồn gốc rõ ràng.</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ background: '#eff6ff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                  <i className="fas fa-users" style={{ color: '#2b80dd' }}></i>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '14px', color: '#1e293b' }}>Tận tâm phục vụ</strong>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Đội ngũ nhân viên giàu chuyên môn, tư vấn chân thành, chăm sóc chu đáo.</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ background: '#eff6ff', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                  <i className="fas fa-shield-alt" style={{ color: '#2b80dd' }}></i>
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '14px', color: '#1e293b' }}>Bảo hành uy tín</strong>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Chính sách đổi trả linh hoạt, bảo hành nhanh chóng giúp khách hàng an tâm.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address / Contact Card */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '30px', marginTop: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
        <h4 style={{ color: '#2b80dd', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fas fa-map-marked-alt"></i> Thông tin liên hệ cửa hàng
        </h4>
        <div className="row">
          <div className="col-md-4 mb-3 mb-md-0">
            <strong style={{ display: 'block', fontSize: '13px', color: '#64748b', textTransform: 'uppercase' }}>Địa chỉ cửa hàng</strong>
            <span style={{ fontSize: '15px', color: '#1e293b', fontWeight: '600', display: 'block', marginTop: '4px' }}>
              601 Nguyễn Đình Chiểu, Phường 2, Quận 3, TP. Hồ Chí Minh
            </span>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <strong style={{ display: 'block', fontSize: '13px', color: '#64748b', textTransform: 'uppercase' }}>Tổng đài hỗ trợ</strong>
            <span style={{ fontSize: '15px', color: '#1e293b', fontWeight: '600', display: 'block', marginTop: '4px' }}>
              0972.495.788 (Bán hàng) | 0988.443.789 (Hỗ trợ kỹ thuật)
            </span>
          </div>
          <div className="col-md-4">
            <strong style={{ display: 'block', fontSize: '13px', color: '#64748b', textTransform: 'uppercase' }}>Giờ hoạt động</strong>
            <span style={{ fontSize: '15px', color: '#1e293b', fontWeight: '600', display: 'block', marginTop: '4px' }}>
              8:30 AM - 21:30 PM (Cả tuần, ngày lễ)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
