import React from "react";
import { Link } from "react-router-dom";
import Spline from '@splinetool/react-spline';
import "./land.css";

const Land = () => {
  return (
    <div className="landing-page">
      <img 
        className="image-gradient" 
        src="/gradient.png" 
        alt="gradient" 
      />
      <div className="layer-blur"></div>


      <div className="container">
        <main>
          <div className="content">
            <div className="tag-box">
              <div className="tag">INTRODUCING</div>
            </div>
            <h1>LEARN FROM <br />VHASS</h1>
            <p className="description">
              VHASS Software Pvt Ltd is a leading ed-tech company specializing in cybersecurity training, offering a range of courses designed to equip learners with in-demand skills. Through interactive live sessions and personalized mentorship from industry experts, students gain hands-on experience in ethical hacking, penetration testing, threat detection, and more.
            </p>
            <br />
            <div className="buttons">
              <Link to="/home" className="btn-signing-main">
                Get Started &gt;
              </Link>
            </div>
          </div>
        </main>
        <div className="robot-3d">
          <Spline 
            scene="https://prod.spline.design/Vo2LtVr884vxCyA9/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Land;