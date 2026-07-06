import React, { useEffect, useState } from "react";
import { GET_ALL, fetchUserProfile } from "../api/apiService";
import { Link, useNavigate } from "react-router-dom";

function Header() {
    const [categories, setCategories] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [isLogged, setIsLogged] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const close = () => setShowDropdown(false);
        window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, []);

    useEffect(() => {
        const params = {
            pageNumber: 0,
            pageSize: 15,
            sortBy: 'categoryId',
            sortOrder: 'asc',
        };

        GET_ALL('categories', params, { usePublic: true })
            .then(response => {
                const list = response?.content || (Array.isArray(response) ? response : []);
                setCategories(list);
            })
            .catch(error => {
                console.error('Failed to fetch categories:', error);
            });
    }, []);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const token = localStorage.getItem('authToken');
                setIsLogged(!!token);
                const user = JSON.parse(localStorage.getItem('user') || 'null');
                let email = user?.email || null;
                setUserInfo(user);
                
                if (!email && token) {
                    try {
                        const parts = token.split('.');
                        if (parts.length >= 2) {
                            const payload = parts[1];
                            const decoded = JSON.parse(decodeURIComponent(atob(payload.replace(/-/g, '+').replace(/_/g, '/')).split('').map(function(c) {
                                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                            }).join('')));
                            email = decoded.email || decoded.sub || decoded.username || decoded.user || decoded.preferred_username || null;
                        }
                    } catch (e) {
                        // ignore
                    }
                }
                setUserEmail(email);

                const storedCartId = localStorage.getItem("cartId");
                const hasValidCartId = storedCartId && storedCartId !== "null" && storedCartId !== "undefined";
                if (email && !hasValidCartId && token) {
                    fetchUserProfile(email)
                        .then(profile => {
                            if (profile && profile.cart) {
                                localStorage.setItem("cartId", profile.cart.cartId);
                                const backendCart = profile.cart.products || [];
                                localStorage.setItem("cart", JSON.stringify(backendCart));
                                window.dispatchEvent(new CustomEvent('cartUpdated'));
                            }
                        })
                        .catch(err => console.error("Failed to sync cart on init:", err));
                }
            } catch (e) {
                setIsLogged(false);
                setUserEmail(null);
                setUserInfo(null);
            }
        };

        checkAuth();
        window.addEventListener('storage', checkAuth);
        window.addEventListener('authChanged', checkAuth);
        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('authChanged', checkAuth);
        };
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('cartId');
        localStorage.setItem('cart', JSON.stringify([]));
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        window.dispatchEvent(new CustomEvent('authChanged'));
        setIsLogged(false);
        window.location.href = '/';
    };

    useEffect(() => {
        const update = () => {
            try {
                const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                const count = cart.reduce((s, it) => s + (it.quantity || 1), 0);
                setCartCount(count);
            } catch (e) {
                setCartCount(0);
            }
        };

        update();
        window.addEventListener('cartUpdated', update);
        window.addEventListener('storage', update);
        return () => {
            window.removeEventListener('cartUpdated', update);
            window.removeEventListener('storage', update);
        };
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/SearchResults?query=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <header className="section-header" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div style={{ background: '#1d60b3', padding: '6px 0', fontSize: '12px', color: '#ffffff' }}>
                <div className="container d-flex justify-content-between align-items-center flex-wrap">
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Link to="/WarrantyPolicy" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}>Chính sách bảo hành</Link>
                        <span style={{ opacity: 0.4 }}>|</span>
                        <a href="/ListingGrid" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}>Trả góp</a>
                        <span style={{ opacity: 0.4 }}>|</span>
                        <a href="/ListingGrid" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}>Thu cũ đổi mới</a>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Link to="/AboutUs" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}>Về chúng tôi</Link>
                        <span style={{ opacity: 0.4 }}>|</span>
                        <Link to="/Information" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.9 }}>Thông tin</Link>
                        <span style={{ opacity: 0.4 }}>|</span>
                        {isLogged ? (
                            <span>
                                Xin chào, <Link to="/Profile" style={{ color: '#ffffff', textDecoration: 'underline' }}><strong>{userEmail}</strong></Link> | <a href="#" onClick={handleLogout} style={{ color: '#facc15', fontWeight: 'bold' }}>Đăng xuất</a>
                            </span>
                        ) : (
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                                <Link to="/Login" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 'bold' }}>Đăng nhập</Link>
                                <span style={{ opacity: 0.5 }}>/</span>
                                <Link to="/Register" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 'bold' }}>Đăng ký</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ background: '#2b80dd', padding: '15px 0', color: '#ffffff' }}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-12 col-md-3 col-lg-3 mb-2 mb-md-0">
                            <Link to="/Home" style={{ textDecoration: 'none' }}>
                                <span style={{ fontSize: '28px', fontWeight: '800', color: '#ffffff', display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                                    <span>dientu.vn</span>
                                    <span style={{ height: '3px', background: 'linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0) 100%)', width: '100px', display: 'block', marginTop: '2px', borderRadius: '2px' }}></span>
                                </span>
                            </Link>
                        </div>

                        <div className="col-12 col-md-5 col-lg-5 mb-2 mb-md-0">
                            <form onSubmit={handleSearch} style={{ width: '100%' }}>
                                <div style={{ display: 'flex', borderRadius: '30px', overflow: 'hidden', background: '#ffffff', padding: '2px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                                    <input
                                        type="text"
                                        style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 20px', fontSize: '14px', borderRadius: '30px 0 0 30px' }}
                                        placeholder="Tìm kiếm..."
                                        value={searchQuery}
                                        onChange={handleSearchInputChange}
                                    />
                                    <button type="submit" style={{ background: 'none', color: '#2b80dd', border: 'none', outline: 'none', padding: '8px 20px', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}>
                                        <i className="fa fa-search"></i>
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="col-12 col-md-4 col-lg-4 d-flex justify-content-end align-items-center" style={{ gap: '25px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="fas fa-headset" style={{ color: '#ffffff', fontSize: '24px' }}></i>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontSize: '11px', color: '#eff6ff', lineHeight: 1.2 }}>Gọi mua hàng:</div>
                                    <strong style={{ fontSize: '15px', color: '#facc15' }}>0972495788</strong>
                                </div>
                            </div>
                            
                            <Link to="/cart" style={{ color: '#ffffff', textDecoration: 'none', position: 'relative' }}>
                                <i className="fa fa-shopping-cart" style={{ fontSize: '26px' }}></i>
                                {cartCount > 0 && (
                                    <span className="badge badge-pill badge-danger" style={{ position: 'absolute', top: '-8px', right: '-10px', fontSize: '10px', background: '#ef4444', border: '2px solid #2b80dd' }}>
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <nav style={{ background: '#2570c2', padding: '10px 0' }}>
                <div className="container d-flex justify-content-center align-items-center flex-wrap" style={{ gap: '20px' }}>
                    <Link 
                        to="/Home" 
                        style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'opacity 0.2s' }}
                    >
                        <i className="fas fa-home"></i>
                        <span>Trang chủ</span>
                    </Link>
                    <span style={{ color: '#ffffff', opacity: 0.3 }}>|</span>

                    <div className={`dropdown ${showDropdown ? 'show' : ''}`} style={{ marginRight: '10px' }}>
                        <a 
                            className="dropdown-toggle" 
                            href="#" 
                            style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowDropdown(!showDropdown);
                            }}
                        >
                            <i className="fas fa-bars"></i>
                            <span>Danh mục sản phẩm</span>
                        </a>
                        <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`} style={{ minWidth: '220px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: 'none', borderRadius: '8px' }}>
                            {categories.length > 0 ? (
                                categories.map((row) => (
                                    <a className="dropdown-item py-2" key={row.categoryId} href={`/ListingGrid?categoryId=${row.categoryId}`} style={{ fontSize: '13px', fontWeight: '500' }}>
                                        {row.categoryName}
                                    </a>
                                ))
                            ) : (
                                <>
                                    <a className="dropdown-item py-2" href="/ListingGrid" style={{ fontSize: '13px' }}>Điện thoại di động</a>
                                    <a className="dropdown-item py-2" href="/ListingGrid" style={{ fontSize: '13px' }}>Laptop & Máy tính</a>
                                    <a className="dropdown-item py-2" href="/ListingGrid" style={{ fontSize: '13px' }}>Máy tính bảng</a>
                                    <a className="dropdown-item py-2" href="/ListingGrid" style={{ fontSize: '13px' }}>Phụ kiện</a>
                                </>
                            )}
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item py-2 font-weight-bold text-primary" href="/ListingGrid" style={{ fontSize: '13px' }}>Tất cả sản phẩm</a>
                        </div>
                    </div>

                    {categories.length > 0 ? (
                        categories.map((row) => (
                            <Link 
                                key={row.categoryId} 
                                to={`/ListingGrid?categoryId=${row.categoryId}`} 
                                style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700', fontSize: '13px', transition: 'opacity 0.2s' }}
                                onMouseEnter={(e) => { e.currentTarget.style.opacity = 0.8; }}
                                onMouseLeave={(e) => { e.currentTarget.style.opacity = 1; }}
                            >
                                {row.categoryName}
                            </Link>
                        ))
                    ) : (
                        <>
                            <Link to="/ListingGrid?categoryId=1" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700', fontSize: '13px' }}>Mac</Link>
                            <Link to="/ListingGrid?categoryId=2" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700', fontSize: '13px' }}>Iphone</Link>
                            <Link to="/ListingGrid?categoryId=3" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700', fontSize: '13px' }}>Ipad</Link>
                            <Link to="/ListingGrid" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700', fontSize: '13px' }}>Máy cũ</Link>
                            <Link to="/ListingGrid" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700', fontSize: '13px' }}>Apple Watch</Link>
                            <Link to="/ListingGrid" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700', fontSize: '13px' }}>Phụ kiện</Link>
                        </>
                    )}
                    <Link to="/ListingGrid" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700', fontSize: '13px' }}>Sony Playstation 5</Link>
                    <Link to="/ListingGrid" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: '700', fontSize: '13px' }}>Tin tức</Link>
                </div>
            </nav>
        </header>
    );
}

export default Header;