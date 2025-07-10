import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import ChevronRight from '../../Assets/Icons/chevron-right.svg';
import ChevronLeft from '../../Assets/Icons/chevron-left.svg';

function EveryoneHolidaysCard(props) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
    // استخراج بيانات الصورة الحالية
    const currentImage = props.images[currentImageIndex];
  
    const nextImage = () => {
      setCurrentImageIndex((prev) => (prev + 1) % props.images.length);
    };
  
    const prevImage = () => {
      setCurrentImageIndex((prev) => (prev - 1 + props.images.length) % props.images.length);
    };
  
    return (
      <div className='col-md-6 col-lg-4 mb-4'>
        <Card className='shadow h-100'>
          <div 
            className='image-div'
            style={{ 
              backgroundImage: `url(${currentImage.url})`,
              minHeight: '250px'
            }}
          >
            <h4 className='image-title'>
              {currentImage.title} {/* العنوان الخاص بالصورة الحالية */}
            </h4>
            
            {/* أزرار التنقل */}
            <button onClick={prevImage} className='nav-btn left'>
              <img src={ChevronLeft} alt="السابق" />
            </button>
            <button onClick={nextImage} className='nav-btn right'>
              <img src={ChevronRight} alt="التالي" />
            </button>
          </div>
  
          <Card.Body>
            <h4 className='fw-bold fs-2'>{props.itemSubTitle}</h4>
            
          </Card.Body>
        </Card>
      </div>
    );
  }
export default EveryoneHolidaysCard;