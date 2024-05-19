import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../src/emotion.css";

function EmotionScreenComponent() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const roomId = searchParams.get("roomId");
  const [userEmotions, setUserEmotions] = useState([]);

  const fetchEmotions = async () => {
    try {
      const res = await axios.post(
        "https://f857-2409-4060-2dba-28bf-4873-efd9-bdb3-e677.ngrok-free.app/fetchEmotions",
        {
          meeting_id: roomId,
        }
      );
      // console.log(res.data.users);
      setUserEmotions(res?.data?.users);
      // console.log(userEmotions);
      // if (res && res?.data) {
      //   setUserEmotions(res?.data?.users);
      //   console.log(userEmotions);
      // }
    } catch (error) {}
  };

  useEffect(() => {
    fetchEmotions();
  }, [location, roomId]);

  return (
    <div>
      {userEmotions && userEmotions.length > 0 ? (
        <>
          <h2>
            Emotion Screen for Room :{" "}
            <span className="highlight">{roomId}</span>
          </h2>
          <hr />
          <table className="emotion-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Happy</th>
                <th>Neutral</th>
                <th>Angry</th>
                <th>Surprise</th>
                <th>Sad</th>
                <th>Fear</th>
                <th>Disgust</th>
              </tr>
            </thead>
            <tbody>
              {/* <tr style={{ height: "400px" }}>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr> */}
              {userEmotions.map((e) => (
                <tr>
                  <td style={{ fontWeight: "bold" }}>{e.name}</td>
                  <td>{e.happy}%</td>
                  <td>{e.neutral}%</td>
                  <td>{e.angry}%</td>
                  <td>{e.surprise}%</td>
                  <td>{e.sad}%</td>
                  <td>{e.fear}%</td>
                  <td>{e.disgust}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <h2>Meeting ID does not exist</h2>
          <hr />
        </>
      )}
    </div>
  );
}

export default EmotionScreenComponent;
