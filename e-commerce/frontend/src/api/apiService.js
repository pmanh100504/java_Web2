import axiosPublic, { axiosPrivate } from "./axiosConfig";

function callApi(endpoint, method = "GET", body, params, options = {}) {
  const { usePublic = method === "GET", headers: extraHeaders } = options;
  const axiosToUse = usePublic ? axiosPublic : axiosPrivate;

  // DEBUG: Log để kiểm tra
  console.log('🔍 callApi:', { endpoint, method, usePublic, axiosInstance: usePublic ? 'PUBLIC' : 'PRIVATE' });
  const token = localStorage.getItem("authToken");
  console.log('🔑 Token in localStorage:', token ? 'EXISTS' : 'MISSING');

  const config = {
    method,
    url: endpoint,
    params,
    headers: { 
      "Content-Type": "application/json", 
      ...(extraHeaders || {}),
      // Thêm token trực tiếp vào đây
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    data: body || null,
  };

  console.log('📤 Request config:', config);

  return axiosToUse(config)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        console.warn("❌ Unauthorized (401)");
      } else {
        console.error("❌ API call error:", error);
      }
      throw error;
    });
}

export function GET_ALL(endpoint, params, options) {
  return callApi(endpoint, "GET", null, params, options);
}
export function GET_ID(endpoint, id, options) {
  return callApi(`${endpoint}/${id}`, "GET", null, null, options);
}

export function POST_ADD(endpoint, data, options) {
  return callApi(endpoint, "POST", data, null, options);
}

export function PUT_EDIT(endpoint, data, options) {
  return callApi(endpoint, "PUT", data, null, options);
}

export function DELETE_ID(endpoint, options) {
  return callApi(endpoint, "DELETE", null, null, options);
}

export function fetchUserProfile(email) {
  return callApi(`public/users/email/${email}`, "GET", null, null, { usePublic: false });
}

export function fetchCartById(cartId, email) {
  return callApi(`public/carts/${cartId}?email=${encodeURIComponent(email)}`, "GET", null, null, { usePublic: false });
}

export function addProductToCartBackend(cartId, productId, quantity) {
  return callApi(`public/carts/${cartId}/products/${productId}/quantity/${quantity}`, "POST", null, null, { usePublic: false });
}

export function updateCartProductBackend(cartId, productId, quantity) {
  return callApi(`public/carts/${cartId}/products/${productId}/quantity/${quantity}`, "PUT", null, null, { usePublic: false });
}

export function deleteProductFromCartBackend(cartId, productId) {
  return callApi(`public/carts/${cartId}/product/${productId}`, "DELETE", null, null, { usePublic: false });
}

export function LOGIN(body) {
  const API_URL_LOGIN = "/login"; // relative to axiosInstance baseURL

  console.log("Sending login request:", body);

  return axiosPrivate
    .post(API_URL_LOGIN, body, {
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      if (response.status === 200) {
        console.log("Login successful, response:", response);
        const data = response.data || {};
        const tokenFromBody =
          data.token || data["jwt-token"] || data.accessToken || data.jwt || data.authToken || data.data?.token;
        const headerAuth = response.headers?.authorization || response.headers?.Authorization || response.headers?.['x-auth-token'] || response.headers?.['X-Auth-Token'];
        const tokenFromHeader = headerAuth ? headerAuth.replace(/^Bearer\s+/i, '') : null;
        const token = tokenFromBody || tokenFromHeader;

        if (token) {
          localStorage.setItem("authToken", token);
          
          // Try to store user info from response or decode from JWT
          let userInfo = data.user || {};
          
          // Decode JWT to get user info if available
          try {
            const parts = token.split('.');
            if (parts.length >= 2) {
              const payload = parts[1];
              const decoded = JSON.parse(decodeURIComponent(atob(payload.replace(/-/g, '+').replace(/_/g, '/')).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')));
              userInfo = { ...userInfo, ...decoded };
            }
          } catch (e) {
            console.warn('Could not decode token:', e);
          }
          
          localStorage.setItem("user", JSON.stringify(userInfo));

          const userEmail = userInfo.email || userInfo.username || userInfo.sub || userInfo.user;
          if (userEmail) {
            return fetchUserProfile(userEmail)
              .then(profile => {
                if (profile && profile.cart) {
                  localStorage.setItem("cartId", profile.cart.cartId);
                  const backendCart = profile.cart.products || [];
                  localStorage.setItem("cart", JSON.stringify(backendCart));
                  window.dispatchEvent(new CustomEvent('cartUpdated'));
                }
                return { success: true, token, user: userInfo, raw: response };
              })
              .catch(err => {
                console.error("Failed to sync cart on login:", err);
                return { success: true, token, user: userInfo, raw: response };
              });
          }

          return { success: true, token, user: userInfo, raw: response };
        }

        console.warn('Login response did not include a recognized token.');
        return { success: false, message: "Token not found in response", raw: response };
      }

      return { success: false, message: `Login failed with status ${response.status}`, raw: response };
    })
    .catch((error) => {
      console.log("Login error:", error);
      const message = error.response?.data?.message || error.message || "Login request failed";
      throw new Error(message);
    });
}

export function searchProducts(keyword) {
  console.log('🔎 searchProducts called with keyword:', keyword);
  // Try the API search endpoint first
  const endpoint = `products/search?keyword=${encodeURIComponent(keyword)}`;
  console.log('📡 API endpoint:', endpoint);
  
  return callApi(endpoint, "GET", null, null, { usePublic: true })
    .catch((error) => {
      // If search endpoint fails, fall back to fetching all products and filtering client-side
      console.warn('⚠️ Search endpoint failed, falling back to client-side filtering:', error);
      
      return GET_ALL('products', {
        pageNumber: 0,
        pageSize: 1000,
        sortBy: 'productId',
        sortOrder: 'asc'
      }, { usePublic: true })
        .then((response) => {
          const allProducts = response?.content || response || [];
          const filtered = allProducts.filter(p => 
            p.productName?.toLowerCase().includes(keyword.toLowerCase()) ||
            p.description?.toLowerCase().includes(keyword.toLowerCase())
          );
          console.log('📦 Filtered products:', filtered);
          return filtered;
        });
    });
}

export function createOrder(orderPayload) {
  console.log('📦 Creating order:', orderPayload);
  // Create order using private endpoint (requires authentication)
  return callApi('orders', 'POST', orderPayload, null, { usePublic: false });
}
export function REGISTER(data, navigate) {

  // Construct the payload with default values
  const payload = {
    userId: 0, // Assuming userId is auto-generated or not required during registration
    firstName: data.firstName,
    lastName: data.lastName,
    mobileNumber: data.mobileNumber,
    email: data.email,
    password: data.password,
    roles: [
      {
        roleId: 0, // Assuming roleId should be provided or can be defaulted to 0
        roleName: data.roleName || "USER", // Default role can be USER or according to your needs
      },
    ],
    address: {
      addressId: 0, // Assuming addressId should be provided or can be defaulted to 0
      street: data.street || "Default Street",
      buildingName: data.buildingName || "Default Building",
      city: data.city || "Default City",
      state: data.state || "Default State",
      country: data.country || "Default Country",
      pincode: data.pincode || "000000",
    },
    cart: {
      cartId: 0,
      totalPrice: 0,
      products: [
        {
          productId: 0,
          productName: "Default Product",
          image: "default.png",
          description: "Default Description",
          quantity: 1,
          price: 0,
          discount: 0,
          specialPrice: 0,
          categoryId: 0,
        },
      ],
    },
  };

  // Log the payload for debugging
  console.log("Register payload:", payload);

  return axiosPrivate
    .post("/register", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("Registration successful:", response.data);
      alert("Registration successful!");
      navigate("/login");
      return {
        success: true,
        message: response.data.message || "Registration successful",
      };
    })
    .catch((error) => {
      if (error.response) {
        console.error("Registration failed:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }

      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      alert(message); // Show an error alert
      return {
        success: false,
        message,
      };
    });
}

export async function getOrFetchCartId() {
  let cartId = localStorage.getItem('cartId');
  if (cartId === 'null' || cartId === 'undefined') {
    cartId = null;
  }
  const token = localStorage.getItem('authToken');
  if (!cartId && token) {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const email = user.email || user.username || user.sub || user.user;
      if (email) {
        const profile = await fetchUserProfile(email);
        if (profile && profile.cart) {
          cartId = profile.cart.cartId;
          localStorage.setItem("cartId", cartId);
        }
      }
    } catch (e) {
      console.error("Failed to fetch cartId dynamically:", e);
    }
  }
  return cartId;
}

export async function addToCart(product, quantity) {
  const productId = product.productId || product.id || product.productID;
  const cartRaw = localStorage.getItem('cart') || '[]';
  const cart = JSON.parse(cartRaw);
  const existing = cart.find(item => item.productId === productId || item.id === productId);

  const token = localStorage.getItem('authToken');
  let cartId = await getOrFetchCartId();

  if (token && cartId) {
    try {
      if (existing) {
        const newQuantity = (existing.quantity || 1) + quantity;
        await updateCartProductBackend(cartId, productId, newQuantity);
        existing.quantity = newQuantity;
      } else {
        await addProductToCartBackend(cartId, productId, quantity);
        cart.push({
          productId,
          productName: product.productName,
          image: product.image,
          price: product.price,
          specialPrice: product.specialPrice,
          quantity,
        });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      return { success: true };
    } catch (err) {
      if (err?.response?.status === 404) {
        console.warn('⚠️ Stale cartId detected in addToCart. Re-fetching correct cartId and retrying...');
        localStorage.removeItem('cartId');
        const newCartId = await getOrFetchCartId();
        if (newCartId) {
          if (existing) {
            const newQuantity = (existing.quantity || 1) + quantity;
            await updateCartProductBackend(newCartId, productId, newQuantity);
            existing.quantity = newQuantity;
          } else {
            await addProductToCartBackend(newCartId, productId, quantity);
            cart.push({
              productId,
              productName: product.productName,
              image: product.image,
              price: product.price,
              specialPrice: product.specialPrice,
              quantity,
            });
          }
          localStorage.setItem('cart', JSON.stringify(cart));
          window.dispatchEvent(new CustomEvent('cartUpdated'));
          return { success: true };
        }
      }
      console.error('Failed to sync add to cart with backend:', err);
      throw err;
    }
  } else {
    // Guest cart
    if (existing) {
      existing.quantity = (existing.quantity || 1) + quantity;
    } else {
      cart.push({
        productId,
        productName: product.productName,
        image: product.image,
        price: product.price,
        specialPrice: product.specialPrice,
        quantity,
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    return { success: true };
  }
}

export async function updateCartItemQuantity(productId, newQuantity) {
  const token = localStorage.getItem('authToken');
  let cartId = await getOrFetchCartId();

  if (token && cartId) {
    try {
      await updateCartProductBackend(cartId, productId, newQuantity);
    } catch (err) {
      if (err?.response?.status === 404) {
        console.warn('⚠️ Stale cartId detected in updateCartItemQuantity. Re-fetching and retrying...');
        localStorage.removeItem('cartId');
        const newCartId = await getOrFetchCartId();
        if (newCartId) {
          await updateCartProductBackend(newCartId, productId, newQuantity);
        }
      } else {
        console.error('Failed to sync update quantity with backend:', err);
      }
    }
  }

  const raw = localStorage.getItem('cart') || '[]';
  const arr = JSON.parse(raw);
  const updated = arr.map(i => 
    (i.productId === productId || i.id === productId) 
      ? { ...i, quantity: newQuantity }
      : i
  );
  localStorage.setItem('cart', JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('cartUpdated'));
  return updated;
}

export async function removeFromCart(productId) {
  const token = localStorage.getItem('authToken');
  let cartId = await getOrFetchCartId();

  if (token && cartId) {
    try {
      await deleteProductFromCartBackend(cartId, productId);
    } catch (err) {
      if (err?.response?.status === 404) {
        console.warn('⚠️ Stale cartId detected in removeFromCart. Re-fetching and retrying...');
        localStorage.removeItem('cartId');
        const newCartId = await getOrFetchCartId();
        if (newCartId) {
          await deleteProductFromCartBackend(newCartId, productId);
        }
      } else {
        console.error('Failed to sync remove from cart with backend:', err);
      }
    }
  }

  const raw = localStorage.getItem('cart') || '[]';
  const arr = JSON.parse(raw).filter(i => i.productId !== productId && i.id !== productId);
  localStorage.setItem('cart', JSON.stringify(arr));
  window.dispatchEvent(new CustomEvent('cartUpdated'));
  return arr;
}

export function updateUserBackend(userId, userDTO) {
  return callApi(`public/users/${userId}`, "PUT", userDTO, null, { usePublic: false });
}
