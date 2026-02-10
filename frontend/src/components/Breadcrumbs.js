import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ items }) => {
  return (
    <div className="breadcrumbs">
      <Link to="/">Home</Link>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <span>/</span>
          {item.link ? (
            <Link to={item.link}>{item.label}</Link>
          ) : (
            <span>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
