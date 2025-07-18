import React from "react";
import "./NeedInspirationSection.css";
import Container from "react-bootstrap/Container";

function NeedInspirationSection() {
  return (
    <div className="need-inspiration-section py-5 position-relative">
      <div className="bg-shape position-absolute"></div>
      <Container>
        <div className="row">
          <div className="col-md-4 z-2">
            <h2 className="text-start text-light text-capitalize fw-semibold">
              Need inspiration?
            </h2>
            <p className="text-end text-light fs-5 flex-grow-1">
              هل تريد إيجاد أماكن رائعة وغير مألوفة ؟؟
            </p>
            <div className="d-flex">
              <h5 className="text-end text-light fs-5 flex-grow-1 text-capitalize fw-semibold text-nowrap">
                اتصل بنا :
              </h5>
              <a
                href="/"
                className="text-light mx-2 text-decoration-none h5 fw-semibold"
              >
                0956739697
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default NeedInspirationSection;
