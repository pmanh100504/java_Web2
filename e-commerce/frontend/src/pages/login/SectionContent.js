import React, { useState } from "react";
import { LOGIN } from "../../api/apiService"; // Adjust the path based on your project structure
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate and Link for navigation

const SectionContent = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const body = {
      email,
      password,
    };

    try {
      const result = await LOGIN(body);
      console.log('Login result:', result);
      if (result && result.success && result.token) {
        // token already saved by the API service; navigate now
        window.alert("Login successful!");
        navigate("/");
      } else {
        // Show detailed message when available and log the raw response for debugging
        console.warn('Login did not return token, raw:', result?.raw);
        const msg = result?.message || result?.raw?.data?.message || 'Login failed. Please check your credentials.';
        window.alert("Login failed: " + msg);
      }
    } catch (error) {
      const msg = error?.message || error?.message || JSON.stringify(error);
      window.alert("Login failed: " + msg);
    }
  };

  return (
    <section className="section-content padding-y" style={{ minHeight: "84vh" }}>
      {/* ========================= COMPONENT LOGIN ======================== */}
      <div className="card mx-auto" style={{ maxWidth: "380px", marginTop: "100px" }}>
        <div className="card-body">
          <h4 className="card-title mb-4">Sign in</h4>
          <form onSubmit={handleSubmit}>
            {/* Facebook and Google sign-in buttons */}
            <a href="#" className="btn btn-info btn-block mb-2">
              <i className="fab fa-facebook-f"></i>&nbsp; Sign in with Facebook
            </a>
            <a href="#" className="btn btn-danger btn-block mb-4">
              <i className="fab fa-google"></i>&nbsp; Sign in with Google
            </a>
            <div className="form-group">
              <input
                name="email"
                className="form-control"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                name="password"
                className="form-control"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <a href="#" className="float-right">
                Forgot password?
              </a>
              <label className="float-left custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" />
                <div className="custom-control-label"> Remember </div>
              </label>
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <p className="text-center mt-4">
        Don't have an account? <Link to="/Register">Sign up</Link>
      </p>
      <br />
      <br />
      {/* ========================= COMPONENT LOGIN END ======================== */}
    </section>
  );
};

export default SectionContent;
