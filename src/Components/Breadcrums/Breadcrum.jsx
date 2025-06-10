import React from 'react';
import './Breadcrum.css';

const Breadcrum = ({ category, productName }) => {
  return (
    <div className="breadcrum">
      Home <span> &gt; </span>
      {category && (
        <>
          {category} <span> &gt; </span>
        </>
      )}
      <span>{productName}</span>
    </div>
  );
};

export default Breadcrum;
