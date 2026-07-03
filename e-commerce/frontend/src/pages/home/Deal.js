import React from 'react';

const Deal = () => (
  <section className="padding-bottom">
    <div className="card card-deal">
      <div className="row no-gutters">
        <div className="col-12 col-md-4 col-lg-3">
          <div className="col-heading content-body">
            <header className="section-heading">
              <h3 className="section-title">Deals and offers</h3>
              <p>Hygiene equipments</p>
            </header>
            <div className="timer">
              <div>
                <span className="num">04</span> <small>Days</small>
              </div>
              <div>
                <span className="num">12</span> <small>Hours</small>
              </div>
              <div>
                <span className="num">58</span> <small>Min</small>
              </div>
              <div>
                <span className="num">02</span> <small>Sec</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-8 col-lg-9">
          <div className="row no-gutters items-wrap d-flex flex-nowrap">
        <div className="col-6 col-md-2 col-lg-2 d-flex">
          <figure className="card-product-grid card-sm d-flex flex-column align-items-center w-100">
            <a href="#" className="img-wrap d-flex justify-content-center w-100">
              <img src={require('../../assets/images/items/3.jpg')} alt="Summer clothes" />
            </a>
            <div className="text-wrap p-3 text-center w-100">
              <a href="#" className="title">Summer clothes</a>
              <span className="badge badge-danger"> -20% </span>
            </div>
          </figure>
        </div>
        <div className="col-6 col-md-2 col-lg-2 d-flex">
          <figure className="card-product-grid card-sm d-flex flex-column align-items-center w-100">
            <a href="#" className="img-wrap d-flex justify-content-center w-100">
              <img src={require('../../assets/images/items/4.jpg')} alt="Some category" />
            </a>
            <div className="text-wrap p-3 text-center w-100">
              <a href="#" className="title">Some category</a>
              <span className="badge badge-danger"> -5% </span>
            </div>
          </figure>
        </div>
        <div className="col-6 col-md-2 col-lg-2 d-flex">
          <figure className="card-product-grid card-sm d-flex flex-column align-items-center w-100">
            <a href="#" className="img-wrap d-flex justify-content-center w-100">
              <img src={require('../../assets/images/items/5.jpg')} alt="Another category" />
            </a>
            <div className="text-wrap p-3 text-center w-100">
              <a href="#" className="title">Another category</a>
              <span className="badge badge-danger"> -20% </span>
            </div>
          </figure>
        </div>
        <div className="col-6 col-md-2 col-lg-2 d-flex">
          <figure className="card-product-grid card-sm d-flex flex-column align-items-center w-100">
            <a href="#" className="img-wrap d-flex justify-content-center w-100">
              <img src={require('../../assets/images/items/6.jpg')} alt="Home apparel" />
            </a>
            <div className="text-wrap p-3 text-center w-100">
              <a href="#" className="title">Home apparel</a>
              <span className="badge badge-danger"> -15% </span>
            </div>
          </figure>
        </div>
        <div className="col-6 col-md-2 col-lg-2 d-flex">
          <figure className="card-product-grid card-sm d-flex flex-column align-items-center w-100">
            <a href="#" className="img-wrap d-flex justify-content-center w-100">
              <img src={require('../../assets/images/items/7.jpg')} alt="Smart watches" />
            </a>
            <div className="text-wrap p-3 text-center w-100">
              <a href="#" className="title text-truncate">Smart watches</a>
              <span className="badge badge-danger"> -10% </span>
            </div>
          </figure>
        </div>
      </div>
    </div>
  </div>
    </div>
  </section>
);

export default Deal;
