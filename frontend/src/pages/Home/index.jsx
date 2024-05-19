import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import "../Home/Homepage.css"; // Import CSS file for styling

const HomePage = () => {
  const [value, setValue] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = useCallback(() => {
    // localStorage.setItem("guestName", JSON.stringify(name));
    // console.log(`Stored guestName in local storage: ${name}`);
    navigate(`/room/${value}`);
  }, [navigate, value]);

  // const handleJoinRoom = () => {
  //   localStorage.setItem("guestName", JSON.stringify(name));
  // };

  const debouncedHandleChange = debounce((value) => {
    console.log(value); // Log the new name
    localStorage.setItem("guestName", value); // Store the new name in localStorage
  }, 300);

  const handleChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    debouncedHandleChange(newName); // Trigger debounced function
  };
  return (
    <div className="home-card">
      <div className="home-container">
        <input
          className="input-field"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder="Enter room code"
        />
        <input
          className="input-field"
          value={name}
          onChange={handleChange}
          type="text"
          placeholder="Enter name"
        />
        <button className="join-button" onClick={handleJoinRoom}>
          Join
        </button>
      </div>
    </div>
  );
};

export default HomePage;
