import React, { useEffect, useState } from 'react';
import { GET_ALL } from '../../api/apiService';
import { Link } from 'react-router-dom';

const FALLBACK_PRODUCTS = [
  { productId: 15, productName: 'Camera hành trình Gopro Hero 9 - Độ phân giải 4K', image: '15.jpg', price: 9500000, specialPrice: 8200000, discount: 14, isFallback: true },
  { productId: 1, productName: 'Máy ảnh Compact Ricoh GR IIIx Urban Edition Special...', image: '1.jpg', price: 28500000, specialPrice: 26200000, discount: 8, isFallback: true },
  { productId: 11, productName: 'Máy ảnh Sony ZV - E10 Mark II Kit 16-50mm F3.5-5.6 OS...', image: '11.jpg', price: 19500000, specialPrice: 17900000, discount: 8, isFallback: true },
  { productId: 12, productName: 'Máy Ảnh Canon EOS R50 (Black) + Lens RF-S 18-45mm', image: '12.jpg', price: 18200000, specialPrice: 16800000, discount: 7, isFallback: true },
  { productId: 7, productName: 'Máy ảnh Canon PowerShot G7 X Mark III (Black)', image: '7.jpg', price: 21000000, specialPrice: 19500000, discount: 7, isFallback: true },
];

const Deal = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = {
      pageNumber: 0,
      pageSize: 40,
      sortBy: 'productId',
      sortOrder: 'asc'
    };

    GET_ALL('products', params, { usePublic: true })
      .then(response => {
        const list = response?.content || (Array.isArray(response) ? response : []);
        if (list.length > 0) {
          const shuffled = [...list].sort(() => 0.5 - Math.random());
          setProducts(shuffled.slice(0, 5));
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch random products for deal:', error);
        setProducts(FALLBACK_PRODUCTS);
        setLoading(false);
      });
  }, []);

  const getProductImage = (prod) => {
    if (prod.isFallback) {
      try {
        return require(`../../assets/images/items/${prod.image}`);
      } catch (e) {
        return '';
      }
    }
    if (prod.image) {
      if (prod.image.startsWith('http://') || prod.image.startsWith('https://')) {
        return prod.image;
      }
      try {
        return require(`../../assets/images/items/${prod.image}`);
      } catch (e) {
        return `http://localhost:8080/api/public/products/image/${prod.image}`;
      }
    }
    return '';
  };

  return (
    <section className="padding-bottom" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Header bar: Gradient background with soft shadow */}
      <div style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2b80dd 100%)', borderRadius: '16px 16px 0 0', padding: '18px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', boxShadow: '0 4px 15px rgba(43, 128, 221, 0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <h4 style={{ color: '#ffffff', fontWeight: '900', margin: 0, fontSize: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>HOT SALE CUỐI TUẦN</h4>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontSize: '13px', fontWeight: '600' }}>
            <span style={{ opacity: 0.9 }}>Kết thúc sau</span>
            <span style={{ background: '#ffffff', color: '#1d4ed8', fontWeight: '900', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>17</span>
            <span style={{ fontWeight: '800' }}>:</span>
            <span style={{ background: '#ffffff', color: '#1d4ed8', fontWeight: '900', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>18</span>
            <span style={{ fontWeight: '800' }}>:</span>
            <span style={{ background: '#ffffff', color: '#1d4ed8', fontWeight: '900', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>45</span>
          </div>
        </div>

        {/* Tab links */}
        <div style={{ display: 'flex', gap: '20px', fontSize: '13px', fontWeight: '800' }}>
          <a href="/ListingGrid" style={{ color: '#ffffff', textDecoration: 'none', borderBottom: '2px solid #ffffff', paddingBottom: '2px' }}>Điện thoại</a>
          <a href="/ListingGrid" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.8, transition: 'opacity 0.2s' }} onMouseEnter={(e)=>e.target.style.opacity=1} onMouseLeave={(e)=>e.target.style.opacity=0.8}>Công nghệ</a>
        </div>
      </div>

      {/* Grid wrapper */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderTop: 'none', borderRadius: '0 0 16px 16px', padding: '25px 20px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
        <div className="row no-gutters w-100" style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', gap: '15px', paddingBottom: '10px' }}>
          {loading ? (
            <div className="p-4 w-100 text-center text-muted">Đang tải deal sốc...</div>
          ) : (
            products.map((row) => {
              const discount = row.discount !== undefined && row.discount !== null && row.discount > 0 
                ? row.discount 
                : 10;
              const finalPrice = row.specialPrice || row.price;
              return (
                <div className="d-flex" style={{ width: '19%', minWidth: '180px', flexShrink: 0 }} key={row.productId || row.id}>
                  <figure className="card-product-grid card-sm d-flex flex-column align-items-center w-100" 
                    style={{ margin: 0, border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px', background: '#ffffff', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.transform = 'translateY(-6px)'; 
                      e.currentTarget.style.boxShadow = '0 12px 30px rgba(43, 128, 221, 0.16)'; 
                      e.currentTarget.style.borderColor = '#2b80dd';
                      const btn = e.currentTarget.querySelector('.btn-xem-chi-tiet');
                      if (btn) {
                        btn.style.background = '#2b80dd';
                        btn.style.color = '#ffffff';
                      }
                    }}
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.transform = 'translateY(0)'; 
                      e.currentTarget.style.boxShadow = 'none'; 
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      const btn = e.currentTarget.querySelector('.btn-xem-chi-tiet');
                      if (btn) {
                        btn.style.background = 'transparent';
                        btn.style.color = '#2b80dd';
                      }
                    }}
                  >
                    {/* Product Image */}
                    <Link to={`/Detail?productId=${row.productId || row.id}`} className="img-wrap d-flex justify-content-center w-100 py-2" style={{ position: 'relative' }}>
                      <img 
                        src={getProductImage(row)} 
                        alt={row.productName} 
                        style={{ maxHeight: '110px', maxWidth: '100%', objectFit: 'contain' }} 
                      />
                      {/* Small Watermark bottom right of image */}
                      <span style={{ position: 'absolute', bottom: '2px', right: '2px', fontSize: '9px', color: '#cbd5e1', fontWeight: '500' }}>Masta.vn</span>
                    </Link>
                    
                    {/* Info */}
                    <div className="text-wrap pt-3 text-left w-100 d-flex flex-column justify-content-between" style={{ flexGrow: 1 }}>
                      <Link to={`/Detail?productId=${row.productId || row.id}`} className="title d-block" style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', lineHeight: 1.4, height: '36px', overflow: 'hidden', textDecoration: 'none' }}>
                        {row.productName}
                      </Link>
                      
                      <div style={{ marginTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                          <span className="price" style={{ fontWeight: '800', fontSize: '14px', color: '#2b80dd' }}>
                            {finalPrice ? finalPrice.toLocaleString() : 'Liên hệ'} VND
                          </span>
                        </div>
                        
                        {/* Badge discount & CTA Button */}
                        <div className="d-flex align-items-center justify-content-between mt-2">
                          <span className="badge" style={{ background: '#eff6ff', color: '#2b80dd', borderRadius: '6px', fontSize: '10px', fontWeight: '700', padding: '3px 8px' }}>
                            -{discount}%
                          </span>
                        </div>
                        
                        <div className="btn-xem-chi-tiet" style={{ marginTop: '15px', border: '1px solid #2b80dd', color: '#2b80dd', borderRadius: '20px', padding: '6px 12px', fontSize: '11px', fontWeight: '750', textAlign: 'center', transition: 'all 0.3s', background: 'transparent' }}>
                          Xem chi tiết
                        </div>
                      </div>
                    </div>
                  </figure>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Deal;
