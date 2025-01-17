// LiveKit2.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './LiveKit2Styles.css';

const LiveKit2 = () => {
  const { jobTitle } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [popupContent, setPopupContent] = useState(null);
  const [chatContent, setChatContent] = useState(null);

  useEffect(() => {
    // Load applicants dynamically from the folder structure
    const fetchApplicants = async () => {
      try {
        const response = await fetch(`/data/${jobTitle}/applicants.json`);
        const data = await response.json();
        setApplicants(data);
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
    };

    fetchApplicants();
  }, [jobTitle]);

  const openPopup = (filePath) => {
    fetch(filePath)
      .then((response) => response.text())
      .then((data) => setPopupContent(data))
      .catch((err) => console.error('Error loading file:', err));
  };

  const closePopup = () => {
    setPopupContent(null);
  };

  const openChatPopup = (filePath) => {
    fetch(filePath)
      .then((response) => response.text())
      .then((data) => setChatContent(data))
      .catch((err) => console.error('Error loading file:', err));
  };

  const closeChatPopup = () => {
    setChatContent(null);
  };

  return (
    <div className="container">
      <h1 className="header">{jobTitle} - Job Applicants</h1>
      <div className="applicant-count">Total Applicants: {applicants.length}</div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Job Description</th>
            <th>Audio Recording</th>
            <th>Transcription</th>
            <th>AI Summary of Transcription</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant, index) => (
            <tr key={index}>
              <td>{applicant.name}</td>
              <td>
                <button
                  className="link"
                  onClick={() => openPopup(`/details/${jobTitle}.txt`)}
                >
                  View Job Description
                </button>
              </td>
              <td>
                <audio controls>
                  <source src={`/data/${jobTitle}/${applicant.name}/audio.mp3`} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </td>
              <td>
                <button
                  className="link"
                  onClick={() => openChatPopup(`/data/${jobTitle}/${applicant.name}/transcription.json`)}
                >
                  View Transcription
                </button>
              </td>
              <td>
                <button
                  className="link"
                  onClick={() => openPopup(`/data/${jobTitle}/${applicant.name}/summary.txt`)}
                >
                  View AI Highlights of Transcription
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {popupContent && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closePopup}>
              Close
            </button>
            <br /><br /><br /><br />
            <div dangerouslySetInnerHTML={{ __html: popupContent }} /> 
          </div>
        </div>
      )}

      {chatContent && (
        <div className="popup-overlay" onClick={closeChatPopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeChatPopup}>
              Close
            </button>
            <div className="chat-container">
              {JSON.parse(chatContent).map((message, index) => (
                <div
                  key={index}
                  className={message.agent ? 'chat-message agent' : 'chat-message user'}
                >
                  <span className="chat-label">
                    {message.agent ? 'Agent:' : 'User:'}
                  </span>
                  <span className="chat-text">
                    {message.agent || message.user}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default LiveKit2;
