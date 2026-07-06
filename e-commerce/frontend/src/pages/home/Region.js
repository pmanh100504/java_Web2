import React from 'react';

const brands = [
  { name: 'Apple', icon: 'fab fa-apple', color: '#000000', gradient: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' },
  { name: 'Samsung', icon: 'fas fa-mobile-alt', color: '#0c4da2', gradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' },
  { name: 'Sony', icon: 'fas fa-headphones', color: '#000000', gradient: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)' },
  { name: 'Asus', icon: 'fas fa-laptop', color: '#00539b', gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' },
  { name: 'Dell', icon: 'fas fa-desktop', color: '#0076c0', gradient: 'linear-gradient(135deg, #0284c7 0%, #075985 100%)' },
  { name: 'MSI', icon: 'fas fa-gamepad', color: '#ff0000', gradient: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' },
  { name: 'Xiaomi', icon: 'fas fa-tablet-alt', color: '#ff6700', gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
  { name: 'Logitech', icon: 'fas fa-mouse', color: '#00b0f0', gradient: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)' },
];

const Region = () => {
    return (
      <section className="padding-bottom">
        <header className="section-heading heading-line" style={{ borderLeft: '4px solid #2563eb', paddingLeft: '16px' }}>
          <h4 className="title-section text-uppercase" style={{ fontWeight: '800', color: '#0f172a' }}>THƯƠNG HIỆU ĐỐI TÁC CHÍNH HÃNG</h4>
        </header>

        <div className="row mt-4">
          {brands.map((brand, i) => (
            <div className="col-lg-3 col-md-4 col-6 mb-3" key={i}>
              <a 
                href="/ListingGrid" 
                className="card p-3 d-flex flex-row align-items-center justify-content-center" 
                style={{ 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s',
                  textDecoration: 'none',
                  background: '#ffffff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px rgba(37, 99, 235, 0.1)';
                  e.currentTarget.style.borderColor = '#2563eb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div 
                  className="d-flex align-items-center justify-content-center" 
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '8px', 
                    background: brand.gradient, 
                    color: '#ffffff',
                    fontSize: '18px',
                    marginRight: '12px'
                  }}
                >
                  <i className={brand.icon}></i>
                </div>
                <span style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>{brand.name}</span>
              </a>
            </div>
          ))}
        </div>
      </section>
    );
};

export default Region;