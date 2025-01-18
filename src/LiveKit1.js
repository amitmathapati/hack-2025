// LiveKit1.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LiveKitStyles.css'; // Import the CSS file

const jobs = [
 
  { id: 1, title: 'Security Detection Engineer - Meta', department: 'Security', location: 'San Francisco' },
  { id: 2, title: 'Privacy Engineer Implementation Review - Meta', department: 'Security', location: 'San Francisco' },
  { id: 3, title: '[DRAFT] Senior Staff Software Engineering Manager - Meta', department: 'Engineering', location: 'Remote' },
  { id: 4, title: '[DRAFT] Staff Software Engineer - Generative AI - Meta', department: 'Engineering', location: 'San Francisco' },
  { id: 5, title: '[DRAFT] GenAI Senior Staff Machine Learning Engineer - Platform - Meta', department: 'Engineering', location: 'Remote' },
  { id: 6, title: '[DRAFT] Staff Software Engineer - Backend - Meta', department: 'Engineering', location: 'New York' },
  // Add more job entries as needed
];

const LiveKit1 = () => {
  return (
    <div className="container">
      <h1 className="header-main">LinkedIn CareerVerse</h1>
      <br/><br/>
      <h2 className="header">Meta Recruiter Dashboard</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Department</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>
                <Link to={`/livekit2/${job.title}`} className="link">{job.title}</Link>
              </td>
              <td>{job.department}</td>
              <td>{job.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LiveKit1;
