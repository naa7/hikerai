import React, { useState, useRef } from "react";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";
import ParallaxLoader from "../components/ParallaxLoader";
import ScrollingArrow from "../components/ScrollingArrow";
import TextBlock from "../components/TextBlock";
import ParallaxBlock from "../components/ParallaxBlock";
import "../App.css";

function Home() {
  const [parallaxReady, setParallaxReady] = useState(false);
  const parallaxRef = useRef(null);

  const handleParallaxReady = () => {
    setParallaxReady(true);
  };

  return (
    <div className="App">
      {!parallaxReady && <ParallaxLoader />}

      <Parallax
        pages={2}
        style={{ top: "0", left: "0" }}
        className="animation"
        ref={parallaxRef}
        onScroll={handleParallaxReady}
      >
        <ParallaxLayer>
          <ParallaxBlock />
        </ParallaxLayer>

        <ParallaxLayer offset={0.9} speed={-10}>
          <ScrollingArrow targetRef={parallaxRef} />
        </ParallaxLayer>

        <ParallaxLayer offset={1} speed={0.25}>
          <TextBlock />
        </ParallaxLayer>
      </Parallax>
    </div>
  );
}

export default Home;
