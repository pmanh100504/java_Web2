import React from 'react';

const Information = () => {
  return (
    <div className="container padding-y" style={{ fontFamily: 'Inter, sans-serif', minHeight: '80vh', marginTop: '30px' }}>
      {/* Title Header */}
      <div style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2b80dd 100%)', borderRadius: '16px', padding: '40px 30px', color: '#ffffff', textAlign: 'center', marginBottom: '40px', boxShadow: '0 8px 24px rgba(43, 128, 221, 0.15)' }}>
        <h1 style={{ fontWeight: '900', fontSize: '30px', marginBottom: '10px' }}>TRUNG TÂM THÔNG TIN HỖ TRỢ</h1>
        <p style={{ fontSize: '15px', color: '#eff6ff', margin: 0 }}>
          Giải đáp nhanh chóng các thắc mắc về chính sách mua sắm, vận chuyển và đổi trả hàng tại dientu.vn.
        </p>
      </div>

      <div className="row">
        {/* Accordion/Cards list of policies */}
        <div className="col-lg-6 mb-4">
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '25px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', marginBottom: '20px' }}>
            <h5 style={{ color: '#2b80dd', fontWeight: '800', marginBottom: '15px' }}>
              <i className="fas fa-shopping-basket mr-2"></i> 1. Hướng dẫn mua hàng trực tuyến
            </h5>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, margin: 0 }}>
              Khách hàng có thể dễ dàng mua sản phẩm bằng cách: Chọn danh mục hoặc dùng thanh tìm kiếm, click vào sản phẩm để xem chi tiết, click <strong>"Thêm vào giỏ hàng"</strong>, và tiến hành kiểm tra điền địa chỉ để đặt đơn. Nhân viên tư vấn của dientu.vn sẽ gọi điện xác minh đơn trong 10-15 phút.
            </p>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '25px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <h5 style={{ color: '#2b80dd', fontWeight: '800', marginBottom: '15px' }}>
              <i className="fas fa-truck mr-2"></i> 2. Chính sách vận chuyển siêu tốc 2h
            </h5>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, margin: 0 }}>
              Chúng tôi cung cấp dịch vụ giao hàng siêu tốc trong vòng <strong>2 giờ</strong> đối với các địa chỉ nội thành TP. Hồ Chí Minh. Các đơn hàng ở các tỉnh thành khác sẽ được chuyển phát nhanh an toàn thông qua Giao Hàng Nhanh / Viettel Post với thời gian giao nhận từ 2-4 ngày làm việc.
            </p>
          </div>
        </div>

        <div className="col-lg-6 mb-4">
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '25px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', marginBottom: '20px' }}>
            <h5 style={{ color: '#2b80dd', fontWeight: '800', marginBottom: '15px' }}>
              <i className="fas fa-undo-alt mr-2"></i> 3. Chính sách đổi trả linh hoạt
            </h5>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, margin: 0 }}>
              dientu.vn cam kết chính sách <strong>1 đổi 1 trong vòng 7 ngày</strong> đầu tiên nếu sản phẩm gặp lỗi do nhà sản xuất (áp dụng đối với thiết bị điện thoại, máy ảnh, đồng hồ thông minh và máy chơi game PS4/PS5). Sản phẩm đổi trả phải còn nguyên hộp, đầy đủ phụ kiện và không trầy xước.
            </p>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '25px', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <h5 style={{ color: '#2b80dd', fontWeight: '800', marginBottom: '15px' }}>
              <i className="fas fa-wallet mr-2"></i> 4. Các phương thức thanh toán hỗ trợ
            </h5>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.7, margin: 0 }}>
              Nhằm đem lại sự thuận tiện tốt nhất, chúng tôi hỗ trợ các phương thức: Thanh toán tiền mặt khi nhận hàng (COD), Chuyển khoản ngân hàng trực tiếp, Thanh toán qua ví điện tử, và chương trình **Hỗ trợ trả góp 0%** thủ tục nhanh gọn đối với các sản phẩm giá trị cao.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;
