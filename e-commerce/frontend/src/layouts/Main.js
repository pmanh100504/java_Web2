import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home";

import UserLogin from "./UserLogin";
import UserRegister from "./UserRegister";
 import ListingGrid from "./ListingGrid";
import DetailProduct from "./DetailProduct";
import SearchResults from "../pages/product/SearchResults";
import Cart from "../pages/cart/Cart";
import Checkout from "../pages/cart/Checkout";
import Profile from "../pages/user/Profile";


const Main = () => (
  <main>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/Detail" element={<DetailProduct />} />
      <Route path="/Login" element={<UserLogin />} />
      <Route path="/Register" element={<UserRegister />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/ListingGrid" element={<ListingGrid />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/SearchResults" element={<SearchResults />} />
    </Routes>
  </main>
);

export default Main;
