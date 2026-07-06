import React, { useState, useEffect } from 'react';
import { GET_ALL } from '../../api/apiService';

const Slider = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const params = {
            pageNumber: 0,
            pageSize: 15,
            sortBy: 'categoryId',
            sortOrder: 'asc',
        };

        GET_ALL('categories', params)
            .then(response => {
                const list = response?.content || (Array.isArray(response) ? response : []);
                setCategories(list);
            })
            .catch(error => {
                console.error('Failed to fetch categories:', error);
            });
    }, []);

    const getCategoryIcon = (categoryName, index) => {
        const name = categoryName.toLowerCase();
        if (name.includes('watch') || name.includes('đồng hồ') || name.includes('clock')) {
            return 'fas fa-stopwatch';
        }
        if (name.includes('iphone') || name.includes('điện thoại') || name.includes('phone') || name.includes('mobile')) {
            return 'fas fa-mobile-alt';
        }
        if (name.includes('macbook') || name.includes('laptop') || name.includes('computer') || name.includes('máy tính')) {
            return 'fas fa-laptop';
        }
        if (name.includes('sony') || name.includes('playstation') || name.includes('game') || name.includes('console')) {
            return 'fas fa-gamepad';
        }
        if (name.includes('ipad') || name.includes('tablet') || name.includes('máy tính bảng')) {
            return 'fas fa-tablet-alt';
        }
        if (name.includes('phụ kiện') || name.includes('headphones') || name.includes('tai nghe') || name.includes('accessories')) {
            return 'fas fa-headphones';
        }
        if (name.includes('trả góp') || name.includes('finance')) {
            return 'fas fa-hand-holding-usd';
        }
        if (name.includes('thu cũ') || name.includes('trade')) {
            return 'fas fa-exchange-alt';
        }
        if (name.includes('tin tức') || name.includes('news')) {
            return 'far fa-newspaper';
        }

        const defaultIcons = [
            'fas fa-mobile-alt',
            'fas fa-laptop',
            'fas fa-tablet-alt',
            'fas fa-headphones',
            'fas fa-clock',
            'fas fa-plug'
        ];
        return defaultIcons[index % defaultIcons.length];
    };

    return (
        <section className="section-main padding-y" style={{ fontFamily: 'Inter, sans-serif' }}>
            <main className="card" style={{ border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', borderRadius: '20px', background: '#f8fafc', padding: '20px' }}>
                <div className="card-body p-0">
                    <div className="row">
                        {/* Left Column: Game Service Banner with premium overlapping cards */}
                        <div className="col-lg-8 col-md-8 mb-3 mb-lg-0">
                            <div style={{ background: 'linear-gradient(135deg, #09152b 0%, #1e3a8a 100%)', borderRadius: '16px', padding: '30px', color: '#ffffff', height: '370px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.15)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                <div style={{ zIndex: 2 }}>
                                    <span style={{ background: '#facc15', color: '#09152b', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>DỊCH VỤ VIP</span>
                                    <h3 style={{ fontWeight: '900', fontSize: '26px', letterSpacing: '0.5px', color: '#ffffff', textShadow: '0 4px 10px rgba(0,0,0,0.4)', marginTop: '8px' }}>DỊCH VỤ CHÉP GAME VIỆT HÓA PS4, PS5</h3>
                                    <h5 style={{ color: '#facc15', fontWeight: '800', fontSize: '16px', marginTop: '4px' }}>BẢN VIỆT HÓA: 50.000đ - CÁC BẢN CÒN LẠI: 30.000đ</h5>
                                </div>

                                {/* Overlapping visual cards with smooth straight-on-hover effect */}
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', margin: '20px 0', zIndex: 2, height: '120px' }}>
                                    <div 
                                        style={{ width: '75px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)', transform: 'rotate(-8deg) translateY(5px)', background: '#1e293b', boxShadow: '0 8px 16px rgba(0,0,0,0.3)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', zIndex: 1 }}
                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2) rotate(0deg) translateY(-10px)'; e.currentTarget.style.zIndex = 10; e.currentTarget.style.borderColor = '#facc15'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotate(-8deg) translateY(5px)'; e.currentTarget.style.zIndex = 1; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                                    >
                                        <img src={require('../../assets/images/items/15.jpg')} alt="Game" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div 
                                        style={{ width: '80px', height: '110px', borderRadius: '8px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.3)', transform: 'scale(1.05) translateY(-5px)', background: '#1e293b', boxShadow: '0 12px 24px rgba(0,0,0,0.4)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', zIndex: 3 }}
                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.25) rotate(0deg) translateY(-10px)'; e.currentTarget.style.zIndex = 10; e.currentTarget.style.borderColor = '#facc15'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1.05) translateY(-5px)'; e.currentTarget.style.zIndex = 3; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
                                    >
                                        <img src={require('../../assets/images/items/1.jpg')} alt="Console" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div 
                                        style={{ width: '75px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)', transform: 'rotate(8deg) translateY(5px)', background: '#1e293b', boxShadow: '0 8px 16px rgba(0,0,0,0.3)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', zIndex: 1 }}
                                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.2) rotate(0deg) translateY(-10px)'; e.currentTarget.style.zIndex = 10; e.currentTarget.style.borderColor = '#facc15'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotate(8deg) translateY(5px)'; e.currentTarget.style.zIndex = 1; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                                    >
                                        <img src={require('../../assets/images/items/11.jpg')} alt="Controller" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                                        <i className="fas fa-gamepad" style={{ fontSize: '56px', color: 'rgba(255,255,255,0.12)' }}></i>
                                    </div>
                                </div>

                                {/* Bottom info bar */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#cbd5e1', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '15px', zIndex: 2 }}>
                                    <div>
                                        <i className="fas fa-map-marker-alt" style={{ marginRight: '6px', color: '#facc15' }}></i> 601 Nguyễn Đình Chiểu, P.2, Q.3, TP. Hồ Chí Minh
                                    </div>
                                    <div style={{ color: '#facc15', fontWeight: '800' }}>
                                        <i className="fas fa-phone-alt" style={{ marginRight: '6px' }}></i> Hotline: 0988.443.789
                                    </div>
                                </div>

                                {/* Decorative glow */}
                                <div style={{ position: 'absolute', right: '-60px', top: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none' }}></div>
                            </div>
                        </div>

                        {/* Right Column: Banners and social circles */}
                        <div className="col-lg-4 col-md-4">
                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyItems: 'space-between', gap: '15px' }}>
                                {/* Top Banner: Giao nhanh 2h */}
                                <div 
                                    style={{ flex: 1, background: 'linear-gradient(135deg, #1d60b3 0%, #2563eb 100%)', borderRadius: '16px', padding: '20px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '110px', boxShadow: '0 4px 15px rgba(37, 99, 235, 0.15)', border: '1px solid rgba(255, 255, 255, 0.05)', transition: 'all 0.3s ease', cursor: 'pointer' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.25)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.15)'; }}
                                >
                                    <div>
                                        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#bfdbfe', fontWeight: '800', display: 'block', marginBottom: '2px', letterSpacing: '0.5px' }}>GIAO NHANH CHỈ</span>
                                        <strong style={{ fontSize: '26px', color: '#facc15', display: 'block', lineHeight: 1.1, fontWeight: '900' }}>2 GIỜ <small style={{ fontSize: '11px', color: '#ffffff', fontWeight: '700' }}>TẠI HCM</small></strong>
                                    </div>
                                    <i className="fas fa-shipping-fast" style={{ fontSize: '42px', color: 'rgba(255,255,255,0.2)' }}></i>
                                </div>

                                {/* Bottom Banner: Shop yêu thích Shopee */}
                                <div 
                                    style={{ flex: 1, background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)', borderRadius: '16px', padding: '20px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '110px', boxShadow: '0 4px 15px rgba(234, 88, 12, 0.15)', border: '1px solid rgba(255, 255, 255, 0.05)', transition: 'all 0.3s ease', cursor: 'pointer' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(234, 88, 12, 0.25)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(234, 88, 12, 0.15)'; }}
                                >
                                    <div>
                                        <span style={{ fontSize: '12px', fontWeight: '900', display: 'block', letterSpacing: '0.5px' }}>SHOP YÊU THÍCH</span>
                                        <span style={{ fontSize: '11px', opacity: 0.95, fontWeight: '600' }}>Gian hàng Shopee Mall</span>
                                    </div>
                                    <i className="fas fa-shopping-bag" style={{ fontSize: '42px', color: 'rgba(255,255,255,0.2)' }}></i>
                                </div>

                                {/* Social Shops block */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '14px 20px', justifyContent: 'space-between', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                                    <span style={{ fontSize: '12px', color: '#475569', fontWeight: '800' }}>Gian hàng chính hãng:</span>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <a href="https://tiktok.com" target="_blank" rel="noreferrer" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#000000', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ffffff', transition: 'transform 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} onMouseEnter={(e)=>e.currentTarget.style.transform='scale(1.15)'} onMouseLeave={(e)=>e.currentTarget.style.transform='scale(1)'}>
                                            <i className="fab fa-tiktok" style={{ fontSize: '14px' }}></i>
                                        </a>
                                        <a href="https://shopee.vn" target="_blank" rel="noreferrer" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ea580c', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ffffff', transition: 'transform 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} onMouseEnter={(e)=>e.currentTarget.style.transform='scale(1.15)'} onMouseLeave={(e)=>e.currentTarget.style.transform='scale(1)'}>
                                            <i className="fas fa-shopping-cart" style={{ fontSize: '13px' }}></i>
                                        </a>
                                        <a href="https://lazada.vn" target="_blank" rel="noreferrer" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ffffff', transition: 'transform 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} onMouseEnter={(e)=>e.currentTarget.style.transform='scale(1.15)'} onMouseLeave={(e)=>e.currentTarget.style.transform='scale(1)'}>
                                            <i className="fas fa-heart" style={{ fontSize: '13px' }}></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom circular links: polished design with hover transitions */}
                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="d-flex align-items-center justify-content-start flex-wrap" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '24px 20px', gap: '20px 25px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                                {categories.length > 0 ? (
                                    categories.map((cat, idx) => (
                                        <a 
                                            key={cat.categoryId}
                                            href={`/ListingGrid?categoryId=${cat.categoryId}`} 
                                            className="d-flex flex-column align-items-center text-center text-dark" 
                                            style={{ textDecoration: 'none', width: '9%', minWidth: '85px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} 
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                const iconBox = e.currentTarget.querySelector('.icon-box');
                                                if (iconBox) {
                                                    iconBox.style.background = '#eff6ff';
                                                    iconBox.style.borderColor = '#2b80dd';
                                                }
                                            }} 
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                const iconBox = e.currentTarget.querySelector('.icon-box');
                                                if (iconBox) {
                                                    iconBox.style.background = '#ffffff';
                                                    iconBox.style.borderColor = '#e2e8f0';
                                                }
                                            }}
                                        >
                                            <div 
                                                className="icon-box"
                                                style={{ borderRadius: '50%', width: '54px', height: '54px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px', background: '#ffffff', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}
                                            >
                                                <i className={getCategoryIcon(cat.categoryName, idx)} style={{ color: '#2b80dd', fontSize: '22px' }}></i>
                                            </div>
                                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569', transition: 'color 0.2s' }}>{cat.categoryName}</span>
                                        </a>
                                    ))
                                ) : (
                                    // Static fallback links
                                    <>
                                        <a href="/ListingGrid" className="d-flex flex-column align-items-center text-center text-dark" style={{ textDecoration: 'none', width: '9%', minWidth: '85px' }}>
                                            <div style={{ borderRadius: '50%', width: '54px', height: '54px', border: '1px solid #cbd5e1', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '8px' }}>
                                                <i className="fas fa-stopwatch" style={{ color: '#2b80dd', fontSize: '20px' }}></i>
                                            </div>
                                            <span style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>Apple Watch</span>
                                        </a>
                                        <a href="/ListingGrid" className="d-flex flex-column align-items-center text-center text-dark" style={{ textDecoration: 'none', width: '9%', minWidth: '85px' }}>
                                            <div style={{ borderRadius: '50%', width: '54px', height: '54px', border: '1px solid #cbd5e1', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '8px' }}>
                                                <i className="fas fa-mobile-alt" style={{ color: '#2b80dd', fontSize: '20px' }}></i>
                                            </div>
                                            <span style={{ fontSize: '11px', fontWeight: '600', color: '#475569' }}>Iphone</span>
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </section>
    );
}

export default Slider;
