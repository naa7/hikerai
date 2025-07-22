import React from "react";
import { ParallaxLayer } from "@react-spring/parallax";
import logo from "../images/logo2.png";

const ParallaxBlock = () => {
  return (
    <div>
      <ParallaxLayer offset={0} speed={0.25}>
        <div className="animation_layer parallax" id="artback"></div>
      </ParallaxLayer>
      <ParallaxLayer offset={0} speed={0.3}>
        <div className="animation_layer parallax" id="mountain"></div>
      </ParallaxLayer>
      <ParallaxLayer offset={0} speed={-1} className="animation_layer parallax">
        <div className="flex justify-center mt-[30%] lg:mt-[15%]">
          <img src={logo} alt="logo" />
        </div>
      </ParallaxLayer>
      <ParallaxLayer offset={0.1} speed={-0.1}>
        <div className="animation_layer parallax" id="jungle1"></div>
      </ParallaxLayer>
      <ParallaxLayer offset={0.25} speed={0.3}>
        <div className="animation_layer parallax" id="jungle1"></div>
      </ParallaxLayer>
      <ParallaxLayer offset={0.25} speed={0.35}>
        <div className="animation_layer parallax" id="jungle2"></div>
      </ParallaxLayer>
      <ParallaxLayer offset={0.25} speed={0.5}>
        <div className="animation_layer parallax" id="jungle3"></div>
      </ParallaxLayer>
      <ParallaxLayer offset={0.3} speed={0.45}>
        <div className="animation_layer parallax" id="jungle4"></div>
      </ParallaxLayer>
      <ParallaxLayer offset={0.27} speed={0.4}>
        <div className="animation_layer parallax" id="manonmountain"></div>
      </ParallaxLayer>
      <ParallaxLayer offset={0.23} speed={0.3}>
        <div className="animation_layer parallax" id="jungle5"></div>
      </ParallaxLayer>
    </div>
  );
};

export default ParallaxBlock;
