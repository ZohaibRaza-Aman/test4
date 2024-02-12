import React from "react";
import img from "../../assets/Rectangle 73.png";
import "./style/index.css";
import { useNavigate } from "react-router-dom";

const AdCard = (props) => {
  const navigate = useNavigate();

  const handleCardClick = (newsData) => {
    console.log("newsData", newsData);
    navigate(`/videos/${newsData._id}`, {
      state: { newsData, newsContent: props?.newsContent },
    });
  };

  let numberOfItemsToShow = 4; // Default number of items to show

  // Conditionally update the number of items to show
  if (props?.newsContent.length < 4) {
    numberOfItemsToShow = 2; // If newsContent length is less than 4, show only 2 items
  }

  // Slice the newsContent array based on the determined number of items to show
  const slicedNewsContent = props?.newsContent.slice(0, numberOfItemsToShow);

  return (
    <>
      {slicedNewsContent.map((eachNews, index) => {
        console.log("eachNews", eachNews);
        const { image, description} = eachNews;
        return (
          <div
            key={index}
            className="ad-card-main-area"
            onClick={() => handleCardClick(eachNews)}
          >
            <img src={image} alt="img" />
            <div className="ad-card-main-area-text">
              {description}New Health Campaign, ‘Ayushman Bhava’ To Reach Out...{" "}
              <span className="ad-card-button">Learn More</span>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default AdCard;
