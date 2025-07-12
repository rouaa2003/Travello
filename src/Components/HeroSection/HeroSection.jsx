import React from 'react';
import './HeroSection.css';
import Carousel from 'react-bootstrap/Carousel';
import GreenBtn from '../GreenBtn/GreenBtn';

function HeroSection() {
  return (
    <div className='hero-section'>
      <Carousel interval={3000}>
        {/* الشريحة 1 */}
        <Carousel.Item className='carousel-item1 vh-100'>
          <Carousel.Caption className='h-100 d-flex flex-column justify-content-center'>
            <div className="row h-100">
              <div className='col-lg-6 d-none d-lg-block'></div>
              <div className='col-lg-6 d-flex flex-column align-items-end justify-content-center'>
                <h1 className='text-end'>اكتشف أجمل الرحلات السياحية داخل سوريا</h1>
                <p className='text-end'>سافر معنا إلى أجمل المدن السورية، رحلات جماعية وفردية تشمل أماكن تاريخية وثقافية</p>
                <GreenBtn btnTitle='استعرض الرحلات' btnLink='/trips' />
              </div>
            </div>
          </Carousel.Caption>
        </Carousel.Item>

        {/* الشريحة 2 */}
        <Carousel.Item className='carousel-item2 vh-100'>
          <Carousel.Caption className='h-100 d-flex flex-column justify-content-center'>
            <div className="row h-100">
              <div className='col-lg-6 d-none d-lg-block'></div>
              <div className='col-lg-6 d-flex flex-column align-items-end justify-content-center'>
                <h1 className='text-end'>هل تبحث عن مغامرة؟</h1>
                <p className='text-end'>اكتشف أروع الأماكن السياحية في كل مدينة سورية، من الجبال إلى المواقع الأثرية</p>
                <GreenBtn btnTitle='استعرض المدن' btnLink='/explore-cities' />
              </div>
            </div>
          </Carousel.Caption>
        </Carousel.Item>

        {/* الشريحة 3 */}
        <Carousel.Item className='carousel-item3 vh-100'>
          <Carousel.Caption className='h-100 d-flex flex-column justify-content-center'>
            <div className="row h-100">
              <div className='col-lg-6 d-none d-lg-block'></div>
              <div className='col-lg-6 d-flex flex-column align-items-end justify-content-center'>
                <h1 className='text-end'>هل أنت جائع؟</h1>
                <p className='text-end'>تعرف على أفضل المطاعم في سوريا وتذوّق أشهى الأطباق المحلية</p>
                <GreenBtn btnTitle='استعرض المطاعم' btnLink='/restaurants' />
              </div>
            </div>
          </Carousel.Caption>
        </Carousel.Item>

        {/* الشريحة 4 */}
        <Carousel.Item className='carousel-item4 vh-100'>
          <Carousel.Caption className='h-100 d-flex flex-column justify-content-center'>
            <div className="row h-100">
              <div className='col-lg-6 d-none d-lg-block'></div>
              <div className='col-lg-6 d-flex flex-column align-items-end justify-content-center'>
                <h1 className='text-end'>هل تحتاج إلى رعاية طبية؟</h1>
                <p className='text-end'>إليك قائمة بأفضل المشافي والمراكز الصحية في مختلف المحافظات السورية</p>
                <GreenBtn btnTitle='استعرض المشافي' btnLink='/hospital' />
              </div>
            </div>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default HeroSection;
