import React, { useState } from 'react';
import './CityBreaksSection.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import AmsterdamCityBreaksItems from '../../Assets/ParisCityBreaksItems';
import CityBreakCard from './CityBreakCard';

function ParisCityBreaksSection() {
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleCardClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className='city-break-section py-5'>
      <Container>
        <h3 className='mb-5 text-start text-uppercase fw-semibold'>three-star hotel</h3>
        <Row className="g-4">
          {AmsterdamCityBreaksItems.map((item) => (
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

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Body className="p-0">
          {selectedItem && (
            <CityBreakCard
              itemImage={selectedItem.itemImage}
              itemTitle={selectedItem.itemTitle}
              itemSubTitle={selectedItem.itemSubTitle}
              itemNights={selectedItem.itemNights}
              itemPrice={selectedItem.itemPrice}
              fullWidth
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ParisCityBreaksSection;