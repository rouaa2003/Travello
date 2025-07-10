import React from 'react';
import './HeroSection.css';
import Carousel from 'react-bootstrap/carousel';
import GreenBtn from '../GreenBtn/GreenBtn';

function HeroSection() {
  return (
    <div className='hero-section'>
        <Carousel interval={3000}>
            <Carousel.Item className='carousel-item1 vh-100'>
                <Carousel.Caption className='h-100 d-flex flex-column align-items-center justify-content-top'>
                    <div className="row h-100">
                        <div className='col-lg-6 d-flex flex-column align-items-start justify-content-center'>
                            <h1 className='text-capitalize text-start'>Find your perfect holiday</h1>
                            <p className='text-start'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit molestiae blanditiis assumenda laboriosam id error minus esse odio cumque quod!</p>
                            <GreenBtn btnTitle='Check our holidays' btnLink='/holidays' />
                        </div>
                        <div className='col-lg-6 d-none d-lg-block'></div>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item className='carousel-item2 vh-100'>
                <Carousel.Caption className='h-100'>
                    <div className="row h-100">
                        <div className='col-lg-6 d-flex flex-column align-items-start justify-content-center'>
                            <h1 className='text-capitalize text-start'>Do you need a city break?</h1>
                            <p className='text-start'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Suscipit totam nam consectetur vel praesentium eligendi?</p>
                            <GreenBtn btnTitle='Our city breaks' btnLink='/city-breaks' />
                        </div>
                        <div className='col-lg-6 d-none d-lg-block'></div>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item className='carousel-item3 vh-100'>
                <Carousel.Caption className='h-100'>
                    <div className="row h-100">
                        <div className='col-lg-6 d-none d-lg-block'></div>
                        <div className='col-lg-6 d-flex flex-column align-items-end justify-content-center'>
                            <h1 className='text-capitalize text-end'>Are you hungry ?</h1>
                            <p className='text-end'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit molestiae blanditiis assumenda laboriosam id error minus esse odio cumque quod!</p>
                            <GreenBtn btnTitle='Check all Restaurants' btnLink='/restaurant' />
                        </div>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item className='carousel-item4 vh-100'>
                <Carousel.Caption className='h-100'>
                    <div className="row h-100">
                        <div className='col-lg-6 d-none d-lg-block'></div>
                        <div className='col-lg-6 d-flex flex-column align-items-end justify-content-center'>
                            <h1 className='text-capitalize text-end'>Are you sick?</h1>
                            <p className='text-end'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit molestiae blanditiis assumenda laboriosam id error minus esse odio cumque quod!</p>
                            <GreenBtn btnTitle='Check all Hospitals' btnLink='/hospital' />
                        </div>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    </div>
  )
}

export default HeroSection;