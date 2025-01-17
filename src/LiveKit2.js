// LiveKit2.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './LiveKit2Styles.css';

const LiveKit2 = () => {
  const { jobTitle } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [popupContent, setPopupContent] = useState(null);

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

  return (
    <div className="container">
      <h1 className="header">{jobTitle} - Job Applicants</h1>
      <div className="applicant-count">Total Applicants: {applicants.length}</div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Name</th>
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
                <audio controls>
                  <source src={`/data/${jobTitle}/${applicant.name}/audio.mp3`} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </td>
              <td>
                <button
                  className="link"
                  onClick={() => openPopup(`/data/${jobTitle}/${applicant.name}/transcription.txt`)}
                >
                  View Transcription
                </button>
              </td>
              <td>
                <button
                  className="link"
                  onClick={() => openPopup(`/data/${jobTitle}/${applicant.name}/transcription.txt`)}
                >
                  View AI Summary of Transcription
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
            {/* <div className="popup-text">{popupContent}</div> */}
            <div dangerouslySetInnerHTML={{ __html: popupContent }} /> 
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveKit2;
