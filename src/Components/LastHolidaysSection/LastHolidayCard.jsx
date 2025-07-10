import React from 'react';
import Card from 'react-bootstrap/Card';

function LastHolidayCard(props) {
  return (
    <div className='col-lg-4 d-flex mb-4'>
      <Card className='shadow flex-grow-1 d-flex flex-column'>
        {/* حاوية الصورة مع خلفية محايدة */}
        <div 
          style={{ 
            height: '300px', 
            backgroundColor: '#f8f9fa', // لون خلفية محايد
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <img className="img-hover"
            src={props.itemImage}
            alt={props.itemTitle}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'scale-down' // يعرض الصورة كاملة دون تشويه
            }}
          />
        </div>

        <Card.Body className='p-4 d-flex flex-column flex-grow-1'>
          <Card.Title className='text-start text-uppercase fw-bold mb-3 fs-4'>
            {props.itemTitle}
          </Card.Title>
          <Card.Text className='text-end fs-5 flex-grow-1' style={{ lineHeight: '1.8' }}>
            {props.itemDescription}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  )
}

export default LastHolidayCard;