import React from "react";

import Weather from "./components/Weather/Weather";

import './App.css'
const App: React.FC = () => {

  return (
    <div className="body">
      <Weather />
    </div>
  );
};

export default App;
