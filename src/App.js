import "./App.css";
import React, { useEffect, useReducer } from "react";
import { useSocket } from "./context/SocketContext";
import { useRTC } from "./context/RTCPeerContext";
import VideoPlayer from "./components/VideoPlayer";
import LiveChat from "./components/LiveChat";
import Header from "./components/Header";
import {
  DetailHeadingBox,
  VideoContainer,
  VideoDetails,
  MainContainer,
} from "./styles/appStyles";

const appReducer = (state, action) => {
  switch (action.type) {
    case "initStream": {
      return { ...state, stream: action.stream };
    }
    default: {
      return { ...state };
    }
  }
};

const initialState = {
  stream: null,
};

const App = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { pc } = useRTC();
  const { socket } = useSocket();

  // Offer to receive 1 audio, and 1 video tracks
  pc.addTransceiver("audio", { direction: "recvonly" });
  // pc.addTransceiver('video', { 'direction': 'recvonly' })
  pc.addTransceiver("video", { direction: "recvonly" });

  pc.ontrack = (event) => {
    const {
      track: { kind },
      streams,
    } = event;

    if (kind === "video") {
      dispatch({ type: "initStream", stream: streams[0] });
    }
  };

  pc.onicecandidate = (e) => {
    const { candidate } = e;
    if (candidate) {
      console.log("Candidate success");
      socket.send(
        JSON.stringify({
          event: "candidate",
          data: JSON.stringify(e.candidate),
        })
      );
    }
  };

  if (socket) {
    socket.onmessage = async (event) => {
      const msg = JSON.parse(event.data);

      if (!msg) {
        console.log("Failed to parse msg");
        return;
      }

      const offerCandidate = JSON.parse(msg.data);

      if (!offerCandidate) {
        console.log("Failed to parse offer msg data");
        return;
      }

      switch (msg.event) {
        case "offer":
          console.log("Offer");
          pc.setRemoteDescription(offerCandidate);

          try {
            const answer = await pc.createAnswer();
            pc.setLocalDescription(answer);
            socket.send(
              JSON.stringify({
                event: "answer",
                data: JSON.stringify(answer),
              })
            );
          } catch (e) {
            console.error(e.message);
          }

          return;
        case "candidate":
          console.log("Candidate");
          pc.addIceCandidate(offerCandidate);
          return;
      }
    };
  }

  return (
    <>
      <Header></Header>
      <MainContainer>
        <VideoContainer>
          <VideoPlayer src={state.stream} />
          <VideoDetails>
            <DetailHeadingBox>
              <div className="detail-title">
                <span className="alpha-tag">
                  <div>
                    <i className="fas fa-construction badge-icon"></i>Alpha
                  </div>
                </span>
                <h4 className="details-heading">
                  Welcome to Project Lightspeed - The future of live
                  entertainment
                </h4>
              </div>
              <img id="detail-img" src="/images/lightspeedlogo.svg"></img>
            </DetailHeadingBox>
          </VideoDetails>
        </VideoContainer>
        <LiveChat></LiveChat>
      </MainContainer>
    </>
  );
};

export default App;
