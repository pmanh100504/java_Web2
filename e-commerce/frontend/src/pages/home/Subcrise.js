import React from 'react';
const Subscrise = () =>{
    return (
        <>
          <article className="my-4">
            <img src={require("../../assets/images/banners/ad.png")} className="w-100" alt="Advertisement" />
          </article>
          
          <section className="section-subscribe padding-y-lg" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)', borderRadius: '16px', padding: '40px' }}>
            <div className="container">
              <p className="pb-2 text-center text-white" style={{ fontSize: '16px', fontWeight: '500' }}>
                Đăng ký nhận thông tin khuyến mãi và cập nhật công nghệ mới nhất từ ElectroTech
              </p>
    
              <div className="row justify-content-md-center">
                <div className="col-lg-5 col-md-6">
                  <form className="form-row d-flex">
                    <div className="col-md-8 col-7 mr-2">
                      <input
                        className="form-control border-0"
                        placeholder="Địa chỉ Email của bạn"
                        type="email"
                        style={{ borderRadius: '30px', padding: '12px 20px', height: '46px' }}
                      />
                    </div>
                    <div className="col-md-4 col-5">
                      <button type="submit" className="btn btn-block btn-primary" style={{ height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa fa-envelope mr-2"></i> Đăng ký
                      </button>
                    </div>
                  </form>
                  <small className="form-text text-white-50 text-center mt-2" style={{ fontSize: '12px' }}>
                    Chúng tôi cam kết bảo mật và không chia sẻ email của bạn cho bên thứ ba.
                  </small>
                </div>
              </div>
            </div>
          </section>
        </>
      );
    };
    
    export default Subscrise;