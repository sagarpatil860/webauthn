// components/HomePage.js
import React, { useState, useEffect } from "react";
import "./HomePage.css";

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();
  const formattedDate = currentTime.toLocaleDateString();

  return (
    <div className="HomePage-container">
      <h2>Welcome to Our Application</h2>
      <div className="time-container">
        <p className="date">{`Date: ${formattedDate}`}</p>
        <p className="time">{`Time: ${formattedTime}`}</p>
      </div>
    </div>
  );
};

export default HomePage;
