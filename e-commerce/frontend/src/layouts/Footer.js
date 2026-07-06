import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="section-footer" style={{ background: '#0f172a', color: '#cbd5e1', fontFamily: 'Inter, sans-serif', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="container">
                <section className="footer-top padding-y-lg" style={{ padding: '50px 0 30px' }}>
                    <div className="row">
                        {/* Brands Column */}
                        <aside className="col-md col-6 mb-4 mb-md-0">
                            <h6 className="title" style={{ color: '#ffffff', fontWeight: '800', fontSize: '15px', marginBottom: '20px' }}>Thương hiệu nổi tiếng</h6>
                            <ul className="list-unstyled d-flex flex-column gap-2" style={{ padding: 0 }}>
                                <li>
                                    <Link to="/ListingGrid" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '13px' }} onMouseEnter={(e)=>e.target.style.color='#facc15'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>
                                        Apple Store
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/ListingGrid" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '13px' }} onMouseEnter={(e)=>e.target.style.color='#facc15'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>
                                        Samsung Galaxy
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/ListingGrid" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '13px' }} onMouseEnter={(e)=>e.target.style.color='#facc15'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>
                                        Sony Entertainment
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/ListingGrid" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '13px' }} onMouseEnter={(e)=>e.target.style.color='#facc15'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>
                                        ASUS Republic of Gamers
                                    </Link>
                                </li>
                            </ul>
                        </aside>

                        {/* About Us Column */}
                        <aside className="col-md col-6 mb-4 mb-md-0">
                            <h6 className="title" style={{ color: '#ffffff', fontWeight: '800', fontSize: '15px', marginBottom: '20px' }}>Về chúng tôi</h6>
                            <ul className="list-unstyled d-flex flex-column gap-2" style={{ padding: 0 }}>
                                <li>
                                    <Link to="/AboutUs" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '13px' }} onMouseEnter={(e)=>e.target.style.color='#facc15'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>
                                        Giới thiệu dientu.vn
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/ListingGrid" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '13px' }} onMouseEnter={(e)=>e.target.style.color='#facc15'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>
                                        Tuyển dụng dụng
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/AboutUs" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '13px' }} onMouseEnter={(e)=>e.target.style.color='#facc15'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>
                                        Hệ thống cửa hàng
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/Information" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '13px' }} onMouseEnter={(e)=>e.target.style.color='#facc15'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>
                                        Chính sách bảo mật
                                    </Link>
                                </li>
                            </ul>
                        </aside>

                        {/* Customer Support Column */}
                        <aside className="col-md col-6 mb-4 mb-md-0">
                            <h6 className="title" style={{ color: '#ffffff', fontWeight: '800', fontSize: '15px', marginBottom: '20px' }}>Hỗ trợ khách hàng</h6>
                            <ul className="list-unstyled d-flex flex-column gap-2" style={{ padding: 0 }}>
                                <li>
                                    <Link to="/AboutUs" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '13px' }} onMouseEnter={(e)=>e.target.style.color='#facc15'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>
                                        Liên hệ hỗ trợ kỹ thuật
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/Information" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '13px' }} onMouseEnter={(e)=>e.target.style.color='#facc15'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>
                                        Chính sách đổi trả 1-đổi-1
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/cart" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '13px' }} onMouseEnter={(e)=>e.target.style.color='#facc15'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>
                                        Tra cứu đơn hàng
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/Information" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '13px' }} onMouseEnter={(e)=>e.target.style.color='#facc15'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>
                                        Chính sách vận chuyển 2h
                                    </Link>
                                </li>
                            </ul>
                        </aside>

                        {/* Account Column */}
                        <aside className="col-md col-6 mb-4 mb-md-0">
                            <h6 className="title" style={{ color: '#ffffff', fontWeight: '800', fontSize: '15px', marginBottom: '20px' }}>Tài khoản của tôi</h6>
                            <ul className="list-unstyled d-flex flex-column gap-2" style={{ padding: 0 }}>
                                <li>
                                    <Link to="/Login" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '13px' }} onMouseEnter={(e)=>e.target.style.color='#facc15'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>
                                        Đăng nhập thành viên
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/Register" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '13px' }} onMouseEnter={(e)=>e.target.style.color='#facc15'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>
                                        Đăng ký tài khoản mới
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/Profile" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '13px' }} onMouseEnter={(e)=>e.target.style.color='#facc15'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>
                                        Cài đặt tài khoản
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/cart" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '13px' }} onMouseEnter={(e)=>e.target.style.color='#facc15'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>
                                        Giỏ hàng mua sắm
                                    </Link>
                                </li>
                            </ul>
                        </aside>

                        {/* Social Media Column */}
                        <aside className="col-md mb-4 mb-md-0">
                            <h6 className="title" style={{ color: '#ffffff', fontWeight: '800', fontSize: '15px', marginBottom: '20px' }}>Kết nối với chúng tôi</h6>
                            <ul className="list-unstyled d-flex flex-column gap-2" style={{ padding: 0 }}>
                                <li>
                                    <a href="https://facebook.com" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '13px' }} onMouseEnter={(e)=>e.target.style.color='#facc15'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>
                                        <i className="fab fa-facebook mr-1"></i> Facebook Page
                                    </a>
                                </li>
                                <li>
                                    <a href="https://youtube.com" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '13px' }} onMouseEnter={(e)=>e.target.style.color='#facc15'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>
                                        <i className="fab fa-youtube mr-1"></i> YouTube Channel
                                    </a>
                                </li>
                                <li>
                                    <a href="https://instagram.com" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s', fontSize: '13px' }} onMouseEnter={(e)=>e.target.style.color='#facc15'} onMouseLeave={(e)=>e.target.style.color='#94a3b8'}>
                                        <i className="fab fa-instagram mr-1"></i> Instagram Feed
                                    </a>
                                </li>
                            </ul>
                        </aside>
                    </div>
                </section>

                <hr style={{ borderColor: 'rgba(255,255,255,0.06)', margin: '0 0 25px 0' }} />

                <section className="footer-bottom pb-4 text-center" style={{ fontSize: '12px', lineHeight: 1.8 }}>
                    <div style={{ color: '#ffffff', fontWeight: '700', marginBottom: '8px' }}>
                        CỬA HÀNG THƯƠNG MẠI ĐIỆN TỬ CÔNG NGHỆ DIENTU.VN
                    </div>
                    <div style={{ color: '#94a3b8', marginBottom: '6px' }}>
                        Địa chỉ: 601 Nguyễn Đình Chiểu, Phường 2, Quận 3, TP. Hồ Chí Minh
                    </div>
                    <div style={{ color: '#64748b' }}>
                        MST: 0316495810 - Điện thoại: 0972.495.788 - Email: hotro@dientu.vn
                    </div>
                    <div style={{ color: '#475569', marginTop: '15px' }}>
                        &copy; 2026 dientu.vn. Tất cả quyền được bảo lưu.
                    </div>
                </section>
            </div>
        </footer>
    );
};

export default Footer;
