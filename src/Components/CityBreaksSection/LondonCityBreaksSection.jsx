import React, { useState } from 'react';
import './CityBreaksSection.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import LondonCityBreaksItems from '../../Assets/LondonCityBreaksItems';
import CityBreakCard from './CityBreakCard';

function LondonCityBreaksSection() {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setCurrentImageIndex(0); // نبدأ من الصورة الأولى
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
        <h3 className='mb-5 text-start text-uppercase fw-semibold'>four-star hotel</h3>
        <Row className="g-4">
          {LondonCityBreaksItems.map((item) => (
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

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg" fullscreen="md-down">
        {selectedItem && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{selectedItem.itemTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* معرض الصور المخصص */}
              <div className="image-gallery-container">
                <div className="main-image-wrapper">
                  <button className="nav-button prev-button" onClick={prevImage}>
                    &lt;
                  </button>
                  <img 
                    src={selectedItem.galleryImages[currentImageIndex]} 
                    alt={`Gallery ${currentImageIndex + 1}`}
                    className="main-gallery-image"
                  />
                  <button className="nav-button next-button" onClick={nextImage}>
                    &gt;
                  </button>
                </div>
                
                <div className="thumbnail-container">
                  {selectedItem.galleryImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>

            </Modal.Body>
          </>
        )}
      </Modal>
    </div>
  );
}

export default LondonCityBreaksSection;