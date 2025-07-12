import React from 'react';
import Card from 'react-bootstrap/Card';

function RecentHolidayCard(props) {
  return (
    <div className='col-lg-6'>
        <Card className='shadow d-flex flex-sm-row h-100 overflow-hidden'>
            <div className='img-div img-hover col-sm-6'></div>
            <div className='col-sm-6'>
                <Card.Body className='p-4'>
                    <Card.Title className='text-end text-uppercase fw-bold mb-3 fs-4'>{props.itemTitle}</Card.Title>
                    <ul className='list-unstyled'>
                        <li className='text-end fs-5 flex-grow-1 '>{props.itemDescription}</li>
                        <li className='text-start'>{props.itemNights}</li>
                        <li className='price text-start text-green'>
                            <strong>{props.itemPrice}</strong>
                        </li>
                    </ul>
                </Card.Body>
            </div>
        </Card>
    </div>
  )
}

export default RecentHolidayCard;