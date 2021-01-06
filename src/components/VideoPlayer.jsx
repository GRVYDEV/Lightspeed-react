import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
const posterURL = "/images/img.jpg";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (src) {
      videoRef.current.srcObject = src;
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      id="player"
      playsInline
      autoPlay
      controls
      muted
      poster={posterURL}
    ></video>
  );
};

export default VideoPlayer;

VideoPlayer.propTypes = {
  src: PropTypes.object,
};
