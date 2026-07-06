import React, { useState, useEffect } from 'react';
import { GET_ALL } from '../../api/apiService';

const Slider = () => {
    const [categories, setCategories] = useState([]);
    const [banners, setBanners] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    const mainBanners = banners.filter(b => b.type === 'MAIN');
    const defaultMain = {
        title: "DỊCH VỤ CHÉP GAME VIỆT HÓA PS4, PS5",
        subtitle: "BẢN VIỆT HÓA: 50.000đ - CÁC BẢN CÒN LẠI: 30.000đ",
        background: "linear-gradient(135deg, #09152b 0%, #1e3a8a 100%)",
        info: "601 Nguyễn Đình Chiểu, P.2, Q.3, TP. Hồ Chí Minh | Hotline: 0988.443.789",
        image: "default.png",
        link: "#"
    };
    const activeMainBanners = mainBanners.length > 0 ? mainBanners : [defaultMain];

    useEffect(() => {
        if (activeMainBanners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % activeMainBanners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [activeMainBanners.length]);

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

        GET_ALL('banners')
            .then(response => {
                const list = Array.isArray(response) ? response : (response?.content || []);
                setBanners(list);
            })
            .catch(error => {
                console.error('Failed to fetch banners:', error);
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
                        {/* Left Column: Game Service Banner with premium crossfade slider */}
                        <div className="col-lg-8 col-md-8 mb-3 mb-lg-0" style={{ position: 'relative', height: '370px' }}>
                            <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.15)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                                {activeMainBanners.map((banner, index) => {
                                    const imgUrl = banner.image && banner.image !== 'default.png'
                                        ? `http://localhost:8080/api/public/banners/image/${banner.image}`
                                        : null;

                                    const isCurrent = index === currentSlide;

                                    return (
                                        <div 
                                            key={banner.bannerId || index}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                background: imgUrl ? `url(${imgUrl}) center/cover no-repeat` : banner.background,
                                                padding: '30px',
                                                color: '#ffffff',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'space-between',
                                                opacity: isCurrent ? 1 : 0,
                                                zIndex: isCurrent ? 2 : 1,
                                                transition: 'opacity 0.8s ease-in-out',
                                                pointerEvents: isCurrent ? 'auto' : 'none'
                                            }}
                                        >
                                            {(banner.title || banner.subtitle) && (
                                                <div style={{ zIndex: 3, background: 'transparent', padding: '0', borderRadius: '0' }}>
                                                    {banner.title && <h3 style={{ fontWeight: '900', fontSize: '26px', letterSpacing: '0.5px', color: '#ffffff', textShadow: '0 4px 10px rgba(0,0,0,0.5)', marginTop: '0' }}>{banner.title}</h3>}
                                                    {banner.subtitle && <h5 style={{ color: '#facc15', fontWeight: '800', fontSize: '16px', marginTop: '4px' }}>{banner.subtitle}</h5>}
                                                </div>
                                            )}

                                            {!imgUrl && (
                                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', margin: '20px 0', zIndex: 3, height: '120px' }}>
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
                                            )}

                                            {banner.info && banner.info.trim() !== "" && (
                                                <div style={{ 
                                                    display: 'flex', 
                                                    justifyContent: 'space-between', 
                                                    alignItems: 'center', 
                                                    fontSize: '13px', 
                                                    color: '#ffffff', 
                                                    borderTop: '1px solid rgba(255,255,255,0.25)', 
                                                    paddingTop: '12px', 
                                                    zIndex: 3,
                                                    background: 'transparent',
                                                    padding: '12px 0 0 0',
                                                    width: '100%',
                                                    textShadow: '0 2px 4px rgba(0,0,0,0.9)'
                                                }}>
                                                    <div style={{ fontWeight: '800', display: 'flex', alignItems: 'center' }}>
                                                        <i className="fas fa-map-marker-alt" style={{ marginRight: '6px', color: '#facc15' }}></i> {banner.info.split('|')[0].trim()}
                                                    </div>
                                                    {banner.info.includes('|') && (
                                                        <div style={{ color: '#facc15', fontWeight: '850', display: 'flex', alignItems: 'center' }}>
                                                            <i className="fas fa-phone-alt" style={{ marginRight: '6px' }}></i> {banner.info.split('|')[1].trim()}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div style={{ position: 'absolute', right: '-60px', top: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none', zIndex: 3 }}></div>
                                        </div>
                                    );
                                })}

                                {activeMainBanners.length > 1 && (
                                    <>
                                        <button 
                                            onClick={() => setCurrentSlide(prev => (prev - 1 + activeMainBanners.length) % activeMainBanners.length)}
                                            style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.3)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#ffffff', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'background 0.2s', cursor: 'pointer' }}
                                            onMouseEnter={(e)=>e.currentTarget.style.background='rgba(0,0,0,0.6)'}
                                            onMouseLeave={(e)=>e.currentTarget.style.background='rgba(0,0,0,0.3)'}
                                        >
                                            <i className="fas fa-chevron-left" style={{ fontSize: '14px' }}></i>
                                        </button>
                                        <button 
                                            onClick={() => setCurrentSlide(prev => (prev + 1) % activeMainBanners.length)}
                                            style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.3)', border: 'none', width: '36px', height: '36px', borderRadius: '50%', color: '#ffffff', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'background 0.2s', cursor: 'pointer' }}
                                            onMouseEnter={(e)=>e.currentTarget.style.background='rgba(0,0,0,0.6)'}
                                            onMouseLeave={(e)=>e.currentTarget.style.background='rgba(0,0,0,0.3)'}
                                        >
                                            <i className="fas fa-chevron-right" style={{ fontSize: '14px' }}></i>
                                        </button>

                                        <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 10 }}>
                                            {activeMainBanners.map((_, idx) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => setCurrentSlide(idx)}
                                                    style={{ width: '8px', height: '8px', borderRadius: '50%', border: 'none', background: idx === currentSlide ? '#facc15' : 'rgba(255,255,255,0.4)', padding: 0, cursor: 'pointer', transition: 'background 0.2s' }}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {(() => {
                            const subTopBanner = banners.find(b => b.type === 'SUB_TOP');
                            const subBottomBanner = banners.find(b => b.type === 'SUB_BOTTOM');

                            const tiktokIcon = "https://i.pinimg.com/originals/8e/41/c3/8e41c3c7e067bf63c317ba7b0d6ce441.jpg";
                            const shopeeIcon = "https://www.freepnglogos.com/uploads/shopee-logo/shopee-circle-logo-design-shopping-bag-13.png";
                            const lazadaIcon = "https://www.citypng.com/public/uploads/preview/lazada-laz-round-icon-11662642367vewyj3oggn.png";
                            const defaultSubTop = {
                                title: "GIAO NHANH CHỈ",
                                subtitle: "2 GIỜ TẠI HCM",
                                background: "linear-gradient(135deg, #1d60b3 0%, #2563eb 100%)",
                                image: "default.png",
                                link: "#"
                            };
                            const defaultSubBottom = {
                                title: "SHOP YÊU THÍCH",
                                subtitle: "Gian hàng Shopee Mall",
                                background: "linear-gradient(135deg, #ea580c 0%, #f97316 100%)",
                                image: "default.png",
                                link: "#"
                            };

                            const activeSubTop = subTopBanner || defaultSubTop;
                            const activeSubBottom = subBottomBanner || defaultSubBottom;

                            const subTopImgUrl = activeSubTop.image && activeSubTop.image !== 'default.png'
                                ? `http://localhost:8080/api/public/banners/image/${activeSubTop.image}`
                                : null;

                            const subBottomImgUrl = activeSubBottom.image && activeSubBottom.image !== 'default.png'
                                ? `http://localhost:8080/api/public/banners/image/${activeSubBottom.image}`
                                : null;

                            return (
                                <div className="col-lg-4 col-md-4">
                                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyItems: 'space-between', gap: '15px' }}>
                                        <div 
                                            style={{ 
                                                flex: 1, 
                                                background: subTopImgUrl ? `url(${subTopImgUrl}) center/cover no-repeat` : activeSubTop.background, 
                                                borderRadius: '16px', 
                                                padding: '20px', 
                                                color: '#ffffff', 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center', 
                                                minHeight: '110px', 
                                                boxShadow: '0 4px 15px rgba(37, 99, 235, 0.15)', 
                                                border: '1px solid rgba(255, 255, 255, 0.05)', 
                                                transition: 'all 0.3s ease', 
                                                cursor: 'pointer' 
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 99, 235, 0.25)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.15)'; }}
                                            onClick={() => { if(activeSubTop.link && activeSubTop.link !== '#') window.open(activeSubTop.link, '_blank'); }}
                                        >
                                            <div style={{ background: subTopImgUrl ? 'rgba(0,0,0,0.4)' : 'transparent', padding: subTopImgUrl ? '5px 10px' : '0', borderRadius: '6px' }}>
                                                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#bfdbfe', fontWeight: '800', display: 'block', marginBottom: '2px', letterSpacing: '0.5px' }}>{activeSubTop.title}</span>
                                                <strong style={{ fontSize: '26px', color: '#facc15', display: 'block', lineHeight: 1.1, fontWeight: '900' }}>{activeSubTop.subtitle}</strong>
                                            </div>
                                            <i className="fas fa-shipping-fast" style={{ fontSize: '42px', color: 'rgba(255,255,255,0.2)' }}></i>
                                        </div>

                                        <div 
                                            style={{ 
                                                flex: 1, 
                                                background: subBottomImgUrl ? `url(${subBottomImgUrl}) center/cover no-repeat` : activeSubBottom.background, 
                                                borderRadius: '16px', 
                                                padding: '20px', 
                                                color: '#ffffff', 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center', 
                                                minHeight: '110px', 
                                                boxShadow: '0 4px 15px rgba(234, 88, 12, 0.15)', 
                                                border: '1px solid rgba(255, 255, 255, 0.05)', 
                                                transition: 'all 0.3s ease', 
                                                cursor: 'pointer' 
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(234, 88, 12, 0.25)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(234, 88, 12, 0.15)'; }}
                                            onClick={() => { if(activeSubBottom.link && activeSubBottom.link !== '#') window.open(activeSubBottom.link, '_blank'); }}
                                        >
                                            <div style={{ background: subBottomImgUrl ? 'rgba(0,0,0,0.4)' : 'transparent', padding: subBottomImgUrl ? '5px 10px' : '0', borderRadius: '6px' }}>
                                                <span style={{ fontSize: '12px', fontWeight: '900', display: 'block', letterSpacing: '0.5px' }}>{activeSubBottom.title}</span>
                                                <span style={{ fontSize: '11px', opacity: 0.95, fontWeight: '600', display: 'block' }}>{activeSubBottom.subtitle}</span>
                                            </div>
                                            <i className="fas fa-shopping-bag" style={{ fontSize: '42px', color: 'rgba(255,255,255,0.2)' }}></i>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '14px 20px', justifyContent: 'space-between', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                                            <span style={{ fontSize: '12px', color: '#475569', fontWeight: '800' }}>Gian hàng chính hãng:</span>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {/* TikTok */}
                                                <a href="https://tiktok.com" target="_blank" rel="noreferrer" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#000000', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'transform 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} onMouseEnter={(e)=>e.currentTarget.style.transform='scale(1.15)'} onMouseLeave={(e)=>e.currentTarget.style.transform='scale(1)'}>
                                                    <img src={tiktokIcon} alt="TikTok" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                                                </a>

                                                {/* Shopee */}
                                                <a href="https://shopee.vn" target="_blank" rel="noreferrer" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ea580c', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'transform 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} onMouseEnter={(e)=>e.currentTarget.style.transform='scale(1.15)'} onMouseLeave={(e)=>e.currentTarget.style.transform='scale(1)'}>
                                                    <img src={shopeeIcon} alt="Shopee" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                                                </a>

                                                {/* Lazada */}
                                                <a href="https://lazada.vn" target="_blank" rel="noreferrer" style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'transform 0.2s', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }} onMouseEnter={(e)=>e.currentTarget.style.transform='scale(1.15)'} onMouseLeave={(e)=>e.currentTarget.style.transform='scale(1)'}>
                                                    <img src={lazadaIcon} alt="Lazada" style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>

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
