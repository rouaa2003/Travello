import React from 'react';
import Card from 'react-bootstrap/Card';

function CityBreakCard({ 
  itemImage, 
  itemTitle, 
  itemSubTitle,  
  fullWidth = false,
  onClick 
}) {
  return (
    <div className={fullWidth ? 'modal-card-container' : 'col-md-6 col-lg-4 mb-4'}>
      <Card 
        className={`h-100 ${fullWidth ? 'border-0' : 'shadow'}`}
        onClick={onClick}
        style={{ 
          cursor: onClick ? 'pointer' : 'default',
          overflow: 'hidden'
        }}
      >
        <div className="card-img-container">
          <Card.Img 
            variant='top' 
            src={itemImage} 
            className="card-img"
            style={{ 
              height: fullWidth ? '300px' : '250px',
              objectFit: 'cover',
              width: '100%'
            }}
          />
        </div>
        <Card.Body className='p-4 d-flex flex-column'>
          <Card.Title className='text-start text-uppercase fw-bold mb-2'>
            {itemTitle}
          </Card.Title>
          <Card.Text className='text-start text-muted flex-grow-1'>
            {itemSubTitle}
          </Card.Text>
          <div className='d-flex justify-content-between align-items-end mt-3'>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CityBreakCard;