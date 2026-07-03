import React, { useEffect, useState } from "react";
import { GET_ALL, fetchUserProfile } from "../api/apiService";
import { Link, useNavigate } from "react-router-dom";
import us from "../assets/images/icons/flags/US.png";
import logo from "../assets/images/logo.svg";

function Header() {
    const [categories, setCategories] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [isLogged, setIsLogged] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const params = {
            pageNumber: 0,
            pageSize: 5,
            sortBy: 'categoryId',
            sortOrder: 'asc',
        };

        GET_ALL('categories', params, { usePublic: true })
            .then(response => {
                // Cập nhật state với dữ liệu nhận được (giả định cấu trúc response.content)
                setCategories(response.content);
                console.log("response", response.content);
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
                // optional: if user info stored in localStorage
                const user = JSON.parse(localStorage.getItem('user') || 'null');
                let email = user?.email || null;
                setUserInfo(user);
                
                // if no stored user info, try to decode JWT to get an email/username
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
                        // ignore decode errors
                    }
                }
                setUserEmail(email);

                // Fetch and sync cartId and products if logged in and cartId is missing
                if (email && !localStorage.getItem("cartId") && token) {
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
        // reload to update UI or navigate to home
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
        <header className="section-header">
            {/* Topbar: Ngôn ngữ và Links phụ */}
            <nav className="navbar d-none d-md-flex p-md-0 navbar-expand-sm navbar-light border-bottom">
                <div className="container">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTop4" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTop4">
                        <ul className="navbar-nav mr-auto">
                            <li>
                                <span className="nav-link">
                                    {isLogged ? (
                                        <>
                                            Xin chào,
                                            {' '}
                                            {userEmail ? <Link to="/Profile">{userEmail}</Link> : <Link to="/Profile">Tài khoản</Link>}
                                            {' '}|{' '}
                                            <a href="#" onClick={handleLogout}>Đăng xuất</a>
                                        </>
                                    ) : (
                                        <>Xin chào, <Link to="/Login">Đăng nhập</Link> hoặc <Link to="/Register">Đăng ký</Link></>
                                    )}
                                </span>
                            </li>
                            <li><a href="#" className="nav-link">Khuyến mãi</a></li>
                            <li><a href="#" className="nav-link">Bán hàng</a></li>
                            <li><a href="#" className="nav-link">Trợ giúp</a></li>
                        </ul>
                        <ul className="navbar-nav">
                            <li>
                                <a href="#" className="nav-link">
                                    <img src={us} alt="us" height="16" /> Giao hàng tới
                                </a>
                            </li>
                            {isLogged && userEmail && (
                                <li className="nav-item dropdown">
                                    <a 
                                        href="#" 
                                        className="nav-link dropdown-toggle" 
                                        data-toggle="dropdown"
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                    >
                                        <i className="fa fa-user"></i> {userEmail.split('@')[0]}
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-right">
                                        <li className="dropdown-header">
                                            <strong>{userEmail}</strong>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><Link className="dropdown-item" to="/Profile"><i className="fa fa-user-circle"></i> Hồ sơ của tôi</Link></li>
                                        <li><Link className="dropdown-item" to="/cart"><i className="fa fa-shopping-cart"></i> Đơn hàng của tôi</Link></li>
                                        <li><Link className="dropdown-item" to="#"><i className="fa fa-heart"></i> Yêu thích</Link></li>
                                        <li><Link className="dropdown-item" to="#"><i className="fa fa-cog"></i> Cài đặt</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><a className="dropdown-item" href="#" onClick={handleLogout}><i className="fa fa-sign-out"></i> Đăng xuất</a></li>
                                    </ul>
                                </li>
                            )}
                            <li className="nav-item dropdown">
                                <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">Danh sách theo dõi</a>
                                <ul className="dropdown-menu small">
                                    <li><a className="dropdown-item" href="#">Sản phẩm thứ nhất</a></li>
                                    <li><a className="dropdown-item" href="#">Sản phẩm thứ hai</a></li>
                                    <li><a className="dropdown-item" href="#">Sản phẩm thứ ba</a></li>
                                </ul>
                            </li>
                            <li><a href="#" className="nav-link">Cửa hàng của tôi</a></li>
                            <li><a href="#" className="nav-link"><i className="fa fa-bell"></i></a>
                            </li>
                            <li>
                                <a href="/cart" className="nav-link">
                                    <i className="fa fa-shopping-cart"></i>
                                    {cartCount > 0 && (
                                        <span className="badge badge-pill badge-danger ml-1">{cartCount}</span>
                                    )}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Main Header: Logo và Ô tìm kiếm */}
            <section className="header-main border-bottom">
                <div className="container">
                    <div className="row row-sm align-items-center">
                        <div className="col-6 col-sm col-md col-lg flex-grow-0">
                            <Link to="/Home" className="brand-wrap">
                                <img className="logo" src={logo} alt="Logo" />
                            </Link>
                        </div>
                        <div className="col-lg-6 col-xl col-md-5 col-sm-12 flex-grow-1">
                            <form onSubmit={handleSearch} className="search-header">
                                <div className="input-group">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Tìm kiếm" 
                                        value={searchQuery}
                                        onChange={handleSearchInputChange}
                                    />
                                    <select className="custom-select border-left" name="category_name">
                                        <option value="">Tất cả loại</option>
                                        <option value="codex">Đặc biệt</option>
                                        <option value="comments">Chỉ tốt nhất</option>
                                        <option value="content">Mới nhất</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div className="col-lg col-md" style={{ flexGrow: 0.2 }}>
                            <button className="btn btn-block btn-primary" type="submit" onClick={handleSearch}>Tìm kiếm</button>
                        </div>
                        <div className="col-lg col-md" style={{ flexGrow: 0.2 }}>
                            <div className="d-md-none float-right">
                                <a href="#" className="btn btn-light"><i className="fa fa-bell"></i></a>
                                <a href="#" className="btn btn-light"><i className="fa fa-user"></i></a>
                                <a href="#" className="btn btn-light"><i className="fa fa-shopping-cart"></i> 2</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Menu chính và Danh mục */}
            <nav className="navbar navbar-main navbar-expand pl-0">
                <ul className="navbar-nav flex-wrap">
                    <li className="nav-item">
                        <Link className="nav-link" to="/Home">Trang chủ</Link>
                    </li>
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown">
                            Danh sách sản phẩm
                        </a>
                        <div className="dropdown-menu">
                            {categories.length > 0 && categories.map((row) => (
                                <a className="dropdown-item" key={row.categoryId} href={`/ListingGrid?categoryId=${row.categoryId}`}>
                                    {row.categoryName}
                                </a>
                            ))}
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" href="/ListingGrid">Tất cả sản phẩm</a>
                        </div>
                    </li>
                    <li className="nav-item"><a className="nav-link" href="#">Điện tử</a></li>
                    <li className="nav-item"><a className="nav-link" href="#">Thời trang</a></li>
                    <li className="nav-item"><a className="nav-link" href="#">Làm đẹp</a></li>
                    <li className="nav-item"><a className="nav-link" href="#">Xe hơi</a></li>
                    <li className="nav-item"><a className="nav-link" href="#">Thể thao</a></li>
                    <li className="nav-item"><a className="nav-link" href="#">Nông trại và vườn</a></li>
                    <li className="nav-item"><a className="nav-link" href="#">Khuyến mãi</a></li>
                    <li className="nav-item"><a className="nav-link" href="#">Dưới $10</a></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;