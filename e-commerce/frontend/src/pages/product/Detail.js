import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GET_ID, addToCart } from "../../api/apiService"; // Import your GET_ID function for API calls

const Detail = () => {
  const [searchParams] = useSearchParams();
  // support both 'id' and 'productId' query param names used across the app
  const id = searchParams.get("id") || searchParams.get("productId") || searchParams.get("productID"); // Extract productId from URL
  const [product, setProduct] = useState(null); // State to store product details
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrease = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };
  useEffect(() => {
    if (id) {
      GET_ID("products", id) // Fetch product details by ID
        .then((response) => {
          setProduct(response); // Set product details in state
        })
        .catch((error) => {
          console.error("Failed to fetch product details:", error); // Handle errors
        });
    }
  }, [id]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      await addToCart(product, quantity);
      alert('Đã thêm vào giỏ hàng');
    } catch (err) {
      console.error('Add to cart failed', err);
      const msg = err?.response?.data?.message || err?.message || 'Vui lòng thử lại sau.';
      alert('Không thể thêm vào giỏ hàng: ' + msg);
    }
  };

  if (!product) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  return (
    <section className="section-content bg-white padding-y">
      <div className="container">
        <div className="row">
          <aside className="col-md-6">
            <div className="card">
              <article className="gallery-wrap">
                <div className="img-big-wrap">
                  <div>
                    <a href="#">
                      <img
                        src={`http://localhost:8080/api/public/products/image/${product.image}`}
                        alt={product.productName}
                      />
                    </a>
                  </div>
                </div>
                <div className="thumbs-wrap">
                  {/* Render thumbnails if available */}
                  {product.images &&
                    product.images.map((img, index) => (
                      <a key={index} href="#" className="item-thumb">
                        <img
                          src={`http://localhost:8080/api/public/products/image/${img}`}
                          alt={`Thumbnail ${index + 1}`}
                        />
                      </a>
                    ))}
                </div>
              </article>
            </div>
          </aside>
          <main className="col-md-6">
            <article className="product-info-aside">
              <h2 className="title mt-3">{product.productName}</h2>
              <div className="rating-wrap my-3">
                <ul className="rating-stars">
                  <li key="stars-active" style={{ width: "80%" }} className="stars-active">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                  </li>
                  <li key="stars-inactive">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                  </li>
                </ul>
                <small className="label-rating text-muted">
                  {product.reviews || 0} reviews
                </small>
                <small className="label-rating text-success">
                  <i className="fa fa-clipboard-check"></i>{" "}
                  {product.orders || 0} orders
                </small>
              </div>
              <div className="mb-3">
                <var className="price h5 mr-3">{product.specialPrice} VND</var>
                <del className="text-muted ">
                   {product.price} VND
                </del>
              </div>
              <p>{product.description}</p>
            
              <div className="form-row mt-4">
                <div className="col-md-8">
                  <div className="input-group mb-3 input-spinner">
                  <div className="input-group">
      <div className="input-group-prepend">
        <button
          className="btn btn-light"
          type="button"
          id="button-minus"
          onClick={handleDecrease}
        >
          −
        </button>
      </div>
      <input
        type="text"
        className="form-control text-center"
        value={quantity}
        readOnly
      />
      <div className="input-group-append">
        <button
          className="btn btn-light"
          type="button"
          id="button-plus"
          onClick={handleIncrease}
        >
          +
        </button>
      </div>
    </div>
                  </div>
                  <div className="form-group">
                    <button className="btn btn-primary" type="button" onClick={handleAddToCart}>
                      <i className="fas fa-shopping-cart"></i>{" "}
                      <span className="text">Thêm vào giỏ hàng</span>
                    </button>
                  </div>
                </div>
                <div className="col-md-4"></div>
              </div>
            </article>
          </main>
        </div>
      </div>
    </section>
  );
};

export default Detail;
