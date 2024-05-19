import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../src/button.css";
import bookbut from "../src/assest/bookbut.jpeg";

function ButtonComponent() {
  const [roomId, setRoomId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  if (localStorage.getItem("guestName") !== null) {
    localStorage.removeItem("guestName");
  }

  const handleButton2Click = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <div className="but">
        <h2 style={{ marginLeft: "37%" }}>
          <b>Choose any one</b>
        </h2>
        <hr></hr>
        <Link to="/home">
          <button className="enter-room-button">Enter room</button>
        </Link>
        <img
          src={bookbut}
          alt="book"
          style={{ height: "80px", marginLeft: "70px" }}
        />
        {/* <div className="button-container"> */}
        <button className="click-emotion-button" onClick={handleButton2Click}>
          Click here to see the emotion
        </button>
        {/* </div> */}
      </div>
      {showPopup && (
        <div className="card-popup">
          <div className="card-content">
            <div className="close" onClick={handlePopupClose}>
              &times;
            </div>
            <h2>Enter Room ID</h2>
            <input
              type="text"
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            <Link to={`/emotion?roomId=${roomId}`}>
              <button className="fetchbutton">Fetch Emotion Screen</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default ButtonComponent;
