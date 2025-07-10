import React, { useState } from 'react';
import '../CityBreaksSection/CityBreaksSection.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import EuropeDestinationsItems from '../../Assets/EuropeDestinationsItems';
import CityBreakCard from '../CityBreaksSection/CityBreakCard';

function EuropeDestinationsSection() {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const nextImage = () => {
    setCurrentImageIndex(prev => 
      (prev + 1) % selectedItem.galleryImages.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => 
      (prev - 1 + selectedItem.galleryImages.length) % selectedItem.galleryImages.length
    );
  };

  return (
    <div className='city-break-section py-5'>
      <Container>
        <h3 className='mb-5 text-start text-uppercase fw-semibold'>oriental food restaurant</h3>
        <Row className="g-4">
          {EuropeDestinationsItems.map((item) => (
            <CityBreakCard
              key={item.id}
              itemImage={item.itemImage}
              itemTitle={item.itemTitle}
              itemSubTitle={item.itemSubTitle}
              itemNights={item.itemNights}
              itemPrice={item.itemPrice}
              onClick={() => handleCardClick(item)}
            />
          ))}
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg" className="custom-modal">
        {selectedItem && (
          <>
            <Modal.Header closeButton>
              <Modal.Title className=' text-start text-uppercase fw-semibold'>{selectedItem.itemTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="custom-modal-body">
              <div className="modal-content-wrapper">
                {/* الجانب الأيسر - الصورة */}
                <div className="image-side">
                  <div className="main-image-wrapper">
                    <img 
                      src={selectedItem.galleryImages[currentImageIndex].image} 
                      alt={`Gallery ${currentImageIndex + 1}`}
                      className="main-gallery-image"
                    />
                    <button className="nav-button prev-button" onClick={prevImage}>
                      &lt;
                    </button>
                    <button className="nav-button next-button" onClick={nextImage}>
                      &gt;
                    </button>
                  </div>
                  
                  <div className="thumbnail-scroll">
                    {selectedItem.galleryImages.map((img, index) => (
                      <div 
                        key={index} 
                        className={`thumbnail-wrapper ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img
                          src={img.image}
                          alt={`Thumbnail ${index + 1}`}
                          className="thumbnail-image"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* الجانب الأيمن - المعلومات */}
                <div className="info-side" dir="rtl">
                  <div className="meal-info-container">
                    <div className="meal-info-item">
                      <span className="meal-label  text-start text-uppercase fw-bold"> اسم الوجبة :</span>
                      <span className="meal-value">{selectedItem.galleryImages[currentImageIndex].mealName}</span>
                    </div>
                    <div className="meal-info-item">
                      <span className="meal-label  text-start text-uppercase fw-bold"> سعر الوجبة :</span>
                      <span className="meal-value price-value ">{selectedItem.galleryImages[currentImageIndex].mealPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>
    </div>
  );
}

export default EuropeDestinationsSection;