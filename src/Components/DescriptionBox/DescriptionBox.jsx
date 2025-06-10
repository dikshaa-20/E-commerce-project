import React from 'react'
import './DescriptionBox.css'
export const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
       <div className="descriptionbox-navigator">
        <div className="descriptionbox-nav-box">Description</div>
        <div className="descriptionbox-nav-box fade">Reviews (122)</div>
       </div>
       <div className="descriptionbox-description">
        <p>
            An e-commerce website is an online platform that allows businesses to sell products or services directly to consumers over the internet. It provides a virtual storefront where customers can browse, select, and purchase items, often with features like secure payment processing, order tracking, and customer reviews. E-commerce websites can range from small independent shops to large marketplaces, offering a wide variety of goods and services.
        </p>
        <p>
           E-commerce websites typically include features such as product listings with images and descriptions, a shopping cart for managing purchases, user accounts for personalized experiences, and various payment options. They may also incorporate search functionality, filters, and recommendations to enhance the shopping experience. Additionally, many e-commerce sites offer customer support through chat, email, or phone to assist with inquiries and issues. 
        </p>
       </div>
    </div>
  )
}

export default DescriptionBox