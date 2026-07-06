// import React, { useEffect, useState } from "react";
// import { GET_ALL } from "../../api/apiService";

// import startsActive from "../../assets/images/icons/stars-active.svg";
// import startsDisable from "../../assets/images/icons/starts-disable.svg";
// import { Link } from "react-router-dom";

// const cardTextStyle = {
//   maxWidth: "80%",
// };

// const Section1 = (category) => {
//   const { categoryName, categoryId } = category;
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const params = {
//       pageNumber: 0,
//       pageSize: 5,
//       sortBy: "productId",
//       sortOrder: "asc",
//     };

//     GET_ALL(`categories/${categoryId}/products`, params)
//       .then((response) => {
//         console.log("response", response.content);
//         setProducts(response.content); // Set the products state
//       })
//       .catch((error) => {
//         console.error("Failed to fetch products:", error); // Handle errors
//       });
//   }, [categoryId]);

//   return (
//     <section className="padding-bottom">
//       <header className="section-heading mb-4">
//         <h3 className="title-section">{categoryName}</h3>
//       </header>
//       <div className="row">
//         {products.length > 0 &&
//           products.map((row) => (
//             <div className="col-xl-3 col-lg-3 col-md-4 col-6" key={row.id}>
//               <div className="card card-product-grid">
//                 <Link to={`/Detail?productId=${row.id}`} className="img-wrap">
//                   <img
//                     src={`http://localhost:8080/api/public/products/image/${row.image}`}
//                     alt={row.productName}
//                   />
//                 </Link>
//                 <figcaption className="info-wrap">
//                   <ul className="rating-stars mb-1">
//                     <li style={cardTextStyle} className="stars-active">
//                       <img src={startsActive} alt="" />
//                     </li>
//                     <li>
//                       <img src={startsDisable} alt="" />
//                     </li>
//                   </ul>
//                   <Link to={`/Detail?productId=${row.id}`} className="title">
//                     {row.productName}
//                   </Link>
//                   <div className="price h5 mt-2">${row.price}</div>
//                 </figcaption>
//               </div>
//             </div>
//           ))}
//       </div>
//     </section>
//   );
// };

// export default Section1;
import React, { useEffect, useState } from "react";
import { GET_ALL } from "../../api/apiService";
import startsActive from "../../assets/images/icons/stars-active.svg";
import startsDisable from "../../assets/images/icons/starts-disable.svg";
import { Link } from "react-router-dom";

const cardTextStyle = {
  maxWidth: "80%",
};

const Section1 = ({ categoryName, categoryId, image }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!categoryId) {
      console.error("Category ID is undefined");
      return;
    }

    console.log("Fetching products for categoryId:", categoryId); // Debugging line

    const params = {
      pageNumber: 0,
      pageSize: 3,
      sortBy: "productId",
      sortOrder: "asc",
    };

    GET_ALL(`categories/${categoryId}/products`, params)
      .then((response) => {
        console.log("response", response.content);
        setProducts(response.content); // Set the products state
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error); // Handle errors
      });
  }, [categoryId]);

  return (
    <section className="padding-bottom" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="card" style={{ border: 'none', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden', background: '#ffffff' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <h4 style={{ margin: 0, fontWeight: '800', fontSize: '18px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '4px', height: '18px', background: '#2563eb', borderRadius: '2px', display: 'inline-block' }}></span>
            {categoryName}
          </h4>
          <Link to={`/ListingGrid?categoryId=${categoryId}`} style={{ fontSize: '13px', color: '#2563eb', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            Xem tất cả <i className="fas fa-chevron-right" style={{ fontSize: '10px' }}></i>
          </Link>
        </div>

        {/* Content Row */}
        <div className="row no-gutters">
          {/* Left Banner Column */}
          {(() => {
            const categoryImgUrl = image && image !== 'default.png'
              ? `http://localhost:8080/api/public/categories/image/${image}`
              : null;
            const bannerBackground = categoryImgUrl 
              ? `linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%), url(${categoryImgUrl}) center/cover no-repeat`
              : `linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%), url(${require('../../assets/images/banners/banner' + ((categoryId % 8) + 1) + '.jpg')}) center/cover no-repeat`;

            return (
              <div className="col-lg-3 d-none d-lg-block">
                <div style={{ 
                  background: bannerBackground, 
                  height: '100%', 
                  minHeight: '340px', 
                  padding: '30px 24px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'flex-end',
                  color: '#ffffff'
                }}>
                  <div>
                    <Link to={`/ListingGrid?categoryId=${categoryId}`} className="btn btn-light btn-sm" style={{ fontWeight: '800', borderRadius: '8px', color: '#2563eb', border: 'none', padding: '8px 16px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                      Xem ngay
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Products Column */}
          <div className="col-lg-9 col-md-12 col-12 p-4">
            <div className="row">
              {products.length > 0 ? (
                products.map((row) => {
                  const formattedPrice = typeof row.price === 'number' ? row.price.toLocaleString() : row.price;
                  const formattedSpecial = typeof row.specialPrice === 'number' ? row.specialPrice.toLocaleString() : row.specialPrice;

                  return (
                    <div className="col-lg-4 col-md-6 col-sm-6 col-12 mb-3 mb-md-0" key={row.productId || row.id}>
                      <div className="card h-100" style={{ border: '1px solid #f1f5f9', borderRadius: '12px', overflow: 'hidden', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}
                           onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'; }}
                           onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.01)'; }}
                      >
                        <Link to={`/Detail?productId=${row.productId}`} className="img-wrap" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px', padding: '20px', background: '#ffffff', position: 'relative' }}>
                          {row.discount > 0 && (
                            <span style={{ position: 'absolute', top: '12px', left: '12px', background: '#ef4444', color: '#ffffff', fontSize: '10px', fontWeight: '850', padding: '3px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                              -{row.discount}%
                            </span>
                          )}
                          <img src={`http://localhost:8080/api/public/products/image/${row.image}`} alt={row.productName} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                        </Link>
                        <figcaption className="info-wrap p-3" style={{ borderTop: '1px solid #f8fafc', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
                          <div>
                            <Link to={`/Detail?productId=${row.productId}`} className="title d-block text-truncate" style={{ fontWeight: '700', color: '#192a56', textDecoration: 'none', fontSize: '14px', marginBottom: '8px' }}>
                              {row.productName}
                            </Link>
                            
                            {/* Rating stars */}
                            <div style={{ display: 'flex', gap: '3px', marginBottom: '10px' }}>
                              <img src={startsActive} alt="star" style={{ width: '11px' }} />
                              <img src={startsActive} alt="star" style={{ width: '11px' }} />
                              <img src={startsActive} alt="star" style={{ width: '11px' }} />
                              <img src={startsActive} alt="star" style={{ width: '11px' }} />
                              <img src={startsActive} alt="star" style={{ width: '11px' }} />
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {row.specialPrice < row.price && (
                              <del style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
                                {formattedPrice} VND
                              </del>
                            )}
                            <span style={{ fontWeight: '800', color: '#2563eb', fontSize: '15px' }}>
                              {formattedSpecial} VND
                            </span>
                          </div>
                        </figcaption>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-12 text-center text-muted py-5">
                  Không có sản phẩm nào trong danh mục này.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section1;
