import React from 'react';
import './SpeechBubble.css';

const SpeechBubble = ({ text }) => {
  return (
    <div className="speech-bubble">
      <div className="speech-bubble-text">Welcome! Click here for Job Recommendations</div>
      <div className="speech-bubble-arrow"></div>
    </div>
  );
};

export default SpeechBubble;