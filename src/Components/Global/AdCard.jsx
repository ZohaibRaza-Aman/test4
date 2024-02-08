import React from "react";
import "./style/index.css";
import img1 from "../../assets/Rectangle 73.png";

const AdCard = (props) => {
  const { img, title, description } = props;
  return (
    <div className="ad-card-main-area">
      <img src={img ? `${img}` : img1} alt="img" />
      <div className="ad-card-main-area-text">
        {title}{" "}
        {description ? (
          `${description}`
        ) : (
          <> New Health Campaign, ‘Ayushman Bhava’ To Reach Out...</>
        )}{" "}
        <span className="ad-card-button">Learn More</span>
      </div>
    </div>
  );
};

export default AdCard;
