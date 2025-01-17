// LiveKit1.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LiveKitStyles.css'; // Import the CSS file

const jobs = [
  { id: 1, title: 'GenAI Senior Staff Machine Learning Engineer - Platform - Databricks', department: 'Engineering', location: 'Remote' },
  { id: 2, title: 'Staff Software Engineer - Backend - Databricks', department: 'Engineering', location: 'New York' },
  { id: 3, title: 'Privacy Engineer Implementation Review - Meta', department: 'Security', location: 'San Francisco' },
  { id: 4, title: 'Security Detection Engineer - Meta', department: 'Security', location: 'San Francisco' },
  { id: 5, title: 'Senior Staff Software Engineering Manager - Youtube', department: 'Engineering', location: 'Remote' },
  { id: 6, title: 'Staff Software Engineer - Generative AI - Google Cloud AI', department: 'Engineering', location: 'San Francisco' },
  // Add more job entries as needed
];

const LiveKit1 = () => {
  return (
    <div className="container">
      <h1 className="header">CompanyName</h1>
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
