import logo from './logo.svg';
import './App.css';
import React from "react";
import ThreeScene from "./ThreeScene";
import { BrowserRouter as Router, Route, Routes, Link, Switch } from 'react-router-dom';

// function App() {
//   // return (
//   //   <div className="App">
//   //     <header className="App-header">
//   //       <img src={logo} className="App-logo" alt="logo" />
//   //       <p>
//   //         Edit <code>src/App.js</code> and save to reload.
//   //       </p>
//   //       <a
//   //         className="App-link"
//   //         href="https://reactjs.org"
//   //         target="_blank"
//   //         rel="noopener noreferrer"
//   //       >
//   //         Learn React
//   //       </a>
//   //     </header>
//   //   </div>
//   // );
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<ThreeScene />} /> {/* Dashboard at root path */}
      

//       </Routes>
//     </Router>
//   );
// }

const App = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ThreeScene />
    </div>
  );
};

export default App;
