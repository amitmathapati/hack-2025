// import logo from './logo.svg';
// import './App.css';
// import React from "react";
// import ThreeScene from "./ThreeScene";

// const App = () => {
//   return (
//     <div style={{ width: "100vw", height: "100vh" }}>
//       <ThreeScene />
//     </div>
//   );
// };

// export default App;


// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LiveKit1 from './LiveKit1';
import LiveKit2 from './LiveKit2';
import ThreeScene from './ThreeScene';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ThreeScene />} />
        <Route path="/livekit1" element={<LiveKit1 />} />
        <Route path="/livekit2/:jobTitle" element={<LiveKit2 />} />
      </Routes>
    </Router>
  );
};

export default App;
