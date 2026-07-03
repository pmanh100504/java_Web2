import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { searchProducts } from "../../api/apiService"; // Assume you've defined this
const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query") || "";

  useEffect(() => {
    if (!searchQuery) {
      console.log('⚠️ No search query provided');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    console.log("🔍 Starting search for:", searchQuery);
    
    searchProducts(searchQuery)
      .then((response) => {
        console.log("✅ Raw search response:", response);
        console.log("📊 Response type:", typeof response);
        console.log("📊 Response is array?", Array.isArray(response));
        
        // Handle different response structures
        let productList = [];
        if (Array.isArray(response)) {
          productList = response;
        } else if (response?.content) {
          productList = response.content;
        } else if (response?.data) {
          productList = response.data;
        }
        
        console.log("📦 Product list:", productList);
        console.log("📊 Product count:", productList.length);
        setProducts(productList);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Failed to fetch search results:", error);
        console.error("❌ Error response:", error.response);
        console.error("❌ Error data:", error.response?.data);
        console.error("❌ Error status:", error.response?.status);
        setProducts([]);
        setLoading(false);
      });
  }, [searchQuery]);
  const handleProductClick = (id) => {
    if (!id) {
      return;
    }
    navigate(`/Detail?productId=${id}`);
  };
  return (
    <section className="section-content padding-y">
      <div className="container">
        <h2>Kết quả tìm kiếm cho: "{searchQuery}"</h2>
        {loading && <p>Loading...</p>}
        {!loading && products.length === 0 && (
          <p>No products found for "{searchQuery}".</p>
        )}
       <div className="row">
  {!loading && products.length > 0 && products.map((row) => {
    const productId = row.productId || row.id || row.productID;
    return (
    <div
      className="col-md-3 col-sm-6 mb-4"
      key={productId || row.productName}
      onClick={() => handleProductClick(productId)}
      style={{ cursor: "pointer" }}
    >
      <figure className="card card-product-grid">
        <div className="img-wrap position-relative">
          <span className="badge badge-danger position-absolute top-0 start-0 m-2">MỚI</span>
          <img
            src={`http://localhost:8080/api/public/products/image/${row.image}`}
            alt={row.productName}
            className="img-fluid"
          />
        </div>
        <figcaption className="info-wrap p-3">
          <Link
            to={`/Detail?productId=${productId}`}
            className="title mb-2 d-block text-truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {row.productName}
          </Link>
          <div className="price-wrap d-flex align-items-center justify-content-between">
  <del className="price text-muted text-decoration-line-through mr-2 ">{row.price} VND</del>
  <span className="price text-primary">{row.specialPrice} VND</span>
</div>
          
          <hr />
          <p className="mb-3">
            <span className="tag">
              <i className="fa fa-check text-success"></i> Đã xác minh
            </span>
          </p>
          
          <Link
            to={`/Detail?productId=${productId}`}
            className="btn btn-outline-primary btn-block"
            onClick={(e) => e.stopPropagation()}
          >
            Xem chi tiết
          </Link>
        </figcaption>
      </figure>
    </div>
    );
            })}
        </div>
      </div>
    </section>
  );
};

export default SearchResults;
