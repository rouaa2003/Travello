import React from 'react';
import './HolidayPlanSection.css';
import Container from 'react-bootstrap/Container';


function HolidayPlanSection(props) {
  return (
    <div className='holiday-plan-section py-5'>
        <Container className='h-100 d-flex flex-column align-items-start justify-content-end'>
            <h3 className='text-start text-light text-capitalize fw-semibold'>{props.itemHolidayPlanTitle}</h3>
            <p className='text-end fs-5 flex-grow-1 text-light text-capitalize'>خطط معنا لأفضل الرحلات لتتمتع بعطلة صيفية مليئة بالمغامرات </p>
        </ Container>
    </div>
  )
}

export default HolidayPlanSection;