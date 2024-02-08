import React from "react";
import { BsPlayCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const DetailsVideoCard = (props) => {
  const navigate = useNavigate();

  const handleCardClick = (newsData) => {
    console.log("newsData", newsData);
    navigate(`/videos/${newsData._id}`, {
      state: { newsData, newsContent: props?.newsContent },
    });
  };

  return (
    <>
      {props?.newsContent.map((eachNews, index) => {
        console.log("eachNews", eachNews);
        const { image, description, duration, title } = eachNews;
        return (
          <div
            key={index}
            className="Detail-video-card-main-box"
            onClick={() => handleCardClick(eachNews)}
          >
            <div className="Detail-video-card">
              <img src={image} alt="img" className="Detail-video-card-img" />
              <div className="Detail-video-card-length">
                <BsPlayCircle style={{ marginRight: "3px" }} />
                {/* {duration ? `${duration}` : <>8:15</>} */}
              </div>
            </div>
            <div className="Detail-video-card-text">
              {title}{" "}
              {description ? (
                `${description}`
              ) : (
                <>
                  {" "}
                  Enhancing Health Accessibility With ‘Ayushman Bhav’ Initiative
                  patients free
                </>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default DetailsVideoCard;
