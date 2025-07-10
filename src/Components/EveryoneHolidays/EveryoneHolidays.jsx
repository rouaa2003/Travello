import React from 'react';
import './EveryoneHolidays.css';
import Container from 'react-bootstrap/Container';
import EveryoneHolidaysItems from '../../Assets/EveryoneHolidaysItems';
import EveryoneHolidaysCard from './EveryoneHolidaysCard';

function EveryoneHolidays() {
  return (
    <div className='everyone-holidays-section my-4 my-sm-5'>
      <Container>
        <h2 className='text-uppercase fw-semibold mb-4 mb-sm-5'>Holidays for everyone</h2>
        <div className="row g-4">
          {EveryoneHolidaysItems.map((item) => (
            <EveryoneHolidaysCard 
              key={item.id}
              itemTitle={item.itemTitle}
              itemSubTitle={item.itemSubTitle}
              itemPrice={item.itemPrice}
              images={item.images || [
                // صور افتراضية في حالة عدم وجود صور محددة
                require('../../Assets/Images/header-img1.jpg'),
                require('../../Assets/Images/header-img2.jpg')
              ]}
            />
          ))}
        </div>
      </Container>
    </div>
  )
}

export default EveryoneHolidays;