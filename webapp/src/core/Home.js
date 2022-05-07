import React from "react";
import "../styles.css";
import Base from "./Base";

function Home() {
  // console.log("API is", process.env.REACT_APP_BACKEND)
  return (
    <Base title="Home Page">
      <h1 className="text-white">Hello from webapp test</h1>
      <div className="row">
        <div className="col-4">
          <button className="btn btn-success">Test</button>
        </div>
        <div className="col-4">
          <button className="btn btn-success">Test</button>
        </div>
        <div className="col-4">
          <button className="btn btn-success">Test</button>
        </div>
      </div>
    </Base>
  );
}

export default Home;
