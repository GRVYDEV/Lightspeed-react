import React from "react";
import {
  DetailHeadingBox,
  VideoDetailsContainer,
  DetailsTitle,
  DetailsHeading,
  AlphaTag,
} from "../styles/videoDetailsStyles";
import { LightspeedLogoURL } from "../assets/constants";

const VideoDetails = () => {
  return (
    <VideoDetailsContainer>
      <DetailHeadingBox>
        <DetailsTitle>
          <AlphaTag>
            <i className="fas fa-construction badge-icon"></i>
            <span>Alpha</span>
          </AlphaTag>
          <DetailsHeading>
            Welcome to Project Lightspeed - The future of live entertainment
          </DetailsHeading>
        </DetailsTitle>
        <img id="detail-img" src={LightspeedLogoURL}></img>
      </DetailHeadingBox>
    </VideoDetailsContainer>
  );
};

export default VideoDetails;
