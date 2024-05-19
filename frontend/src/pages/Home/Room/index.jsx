import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const Roompage = () => {
  const { roomId } = useParams();
  const videoRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  // const [guestName, changeGuestName] = useState(" ");
  const guestName = localStorage.getItem("guestName");
  // const formData = new FormData();

  useEffect(() => {
    // @ts-ignore
    // Brython({
    //   debug: 1,
    //   pythonpath: ["https://cdn.jsdelivr.net/npm/brython@3.9.5/lib/python"],
    // });

    const loadModel = async () => {
      const constraints = { video: true };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("Error accessing video stream: ", err));

      const detectEmotions = async () => {
        try {
          // async function captureImage(imageBase64) {
          //   // Code to capture the image and get it as a base64 string
          //   const base64Image = imageBase64; // Replace with your actual base64 image string

          //   // Decode the base64 string into a binary buffer or ArrayBuffer
          //   const binaryData = atob(base64Image);
          //   const arrayBuffer = new ArrayBuffer(binaryData.length);
          //   const uint8Array = new Uint8Array(arrayBuffer);
          //   for (let i = 0; i < binaryData.length; i++) {
          //     uint8Array[i] = binaryData.charCodeAt(i);
          //   }

          //   // Send the binary data to the backend, e.g., using fetch
          // }

          function trimBase64Image(base64Image) {
            // Check if the string starts with a data URI prefix
            const prefix = "data:image/jpeg;base64,";
            if (base64Image.startsWith(prefix)) {
              // Remove the prefix from the base64 image string
              return base64Image.substring(prefix.length);
            }
            // If the string doesn't start with the prefix, return it unchanged
            return base64Image;
          }

          const video = videoRef.current;
          // Process video frames, detect faces, and analyze emotions
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageBase64 = canvas.toDataURL("image/jpeg");
          const formData = new FormData();
          setCapturedImage(imageBase64);
          formData.append("image", imageBase64);
          formData.append("meeting_id", roomId);
          formData.append("userName", guestName);
          // console.log(roomId);
          // console.log(guestName);
          // console.log(name);
          // const arrayBuffer = captureImage(trimBase64Image(imageBase64));
          // console.log(typeof arrayBuffer);
          // console.log(formData.get("image"));

          await fetch(
            "https://f857-2409-4060-2dba-28bf-4873-efd9-bdb3-e677.ngrok-free.app/predict",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              // body: formData, // Send the binary data as the request body
              // body: "hi",
              // body: trimBase64Image(imageBase64),
              body: JSON.stringify({
                image: imageBase64,
                userName: guestName,
                meeting_id: roomId,
              }),
            }
          )
            .then((response) => {
              const data = response.json();
              console.log(data);
            })
            .catch((error) => {
              console.error("Error sending image data to backend:", error);
            });
          // setCapturedImage(imageBase64);
        } catch (error) {
          console.log(error);
        }

        //   await fetch(
        //     "https://3091-2405-201-8012-a08b-841e-fb5b-6fb3-1d69.ngrok-free.app/predict",
        //     {
        //       method: "POST",
        //       body: formData, // Send the binary data as the request body
        //       // body: "hi",
        //     }
        //   )
        //     .then((response) => {
        //       console.log(response);
        //     })
        //     .catch((error) => {
        //       console.error("Error sending image data to backend:", error);
        //     });
        //   // setCapturedImage(imageBase64);
        // } catch (error) {
        //   console.log(error);
        // }
      };

      setInterval(detectEmotions, 10000); // Adjust interval as needed
    };

    loadModel();
  }, []);

  const myMeeting = (element, guestName) => {
    try {
      const appID = 1344062190;
      const serverSecret = "a6e89e8ba768f01f794bc323c4ac4d68";
      const KitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomId,
        Date.now().toString(),
        guestName
      );
      const zc = ZegoUIKitPrebuilt.create(KitToken);
      zc.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: "copy link",
            url: `http://localhost:3000/room/${roomId}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, // Update mode as needed
        },
        showScreenSharingButton: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div ref={(element) => myMeeting(element, guestName)} />
      <video
        ref={videoRef}
        autoPlay
        muted
        style={{ height: "0px", width: "0px", position: "absolute" }}
      />
      {capturedImage && (
        <div>
          {" "}
          <img
            src={capturedImage}
            alt="Captured"
            style={{ height: "100%", width: "100%", position: "absolute" }}
          ></img>{" "}
        </div>
      )}
    </div>
  );
};

export default Roompage;
