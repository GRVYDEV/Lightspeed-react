import "./App.css";
import React, { useEffect, useState } from "react";
import { useSocket } from "./context/SocketContext";
import { useRTC } from "./context/RTCPeerContext";

const App = () => {
  const { pc } = useRTC();
  const { socket } = useSocket();

  // const log = (msg) => {
  //   document.getElementById("div").innerHTML += msg + "<br>";
  // };

  pc.ontrack = function (event) {
    if (event.track.kind === "audio") {
      return;
    }
    var el = document.getElementById("player");
    el.srcObject = event.streams[0];
    el.autoplay = true;
    el.controls = true;
  };

  // pc.oniceconnectionstatechange = e => log(pc.iceConnectionState)
  // pc.onicecandidate = event => {
  //     if (event.candidate === null) {
  //         console.log(pc.localDescription);
  //         document.getElementById('localSessionDescription').value = btoa(JSON.stringify(pc.localDescription))
  //     }
  // }

  // Offer to receive 1 audio, and 1 video tracks
  pc.addTransceiver("audio", { direction: "recvonly" });
  // pc.addTransceiver('video', { 'direction': 'recvonly' })
  pc.addTransceiver("video", { direction: "recvonly" });

  pc.onicecandidate = (e) => {
    if (!e.candidate) {
      console.log("Candidate fail");
      return;
    }

    socket.send(
      JSON.stringify({ event: "candidate", data: JSON.stringify(e.candidate) })
    );
  };

  if (socket) {
    socket.onmessage = function (evt) {
      let msg = JSON.parse(evt.data);
      if (!msg) {
        return console.log("failed to parse msg");
      }

      const offerCandidate = JSON.parse(msg.data);
      switch (msg.event) {
        case "offer":
          console.log("offer");

          if (!offerCandidate) {
            return console.log("failed to parse answer");
          }
          pc.setRemoteDescription(offerCandidate);
          pc.createAnswer().then((answer) => {
            pc.setLocalDescription(answer);
            socket.send(
              JSON.stringify({ event: "answer", data: JSON.stringify(answer) })
            );
          });
          return;

        case "candidate":
          console.log("candidate");

          if (!offerCandidate) {
            return console.log("failed to parse candidate");
          }

          pc.addIceCandidate(offerCandidate);
      }
    };
  }

  // let sd = document.getElementById('remoteSessionDescription').value
  // if (sd === '') {
  //     return alert('Session Description must not be empty')
  // }

  // try {
  //     pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(atob(sd))))
  // } catch (e) {
  //     alert(e)
  //

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-header">
          <img id="logo-img" src="/images/lightspeedlogo.svg"></img>
          <h1>Project Lightspeed</h1>
        </div>
        <div></div>
      </header>
      <div className="container">
        <div className="video-container">
          <video
            id="player"
            playsInline
            controls
            poster="/images/img.jpg"
          ></video>
          <div className="video-details">
            <div className="detail-heading-box">
              <div className="detail-title">
                <span className="alpha-tag">
                  <div>
                    {" "}
                    <i className="fas fa-construction badge-icon"></i>Alpha
                  </div>
                </span>
                <h4 className="details-heading">
                  Welcome to Project Lightspeed - The future of live
                  entertainment
                </h4>
              </div>

              <img id="detail-img" src="/images/lightspeedlogo.svg"></img>
            </div>
          </div>
        </div>

        <div className="chat-container">
          <div className="chat-main">
            <div className="chat-heading chat-pad">
              <h6>Live Chat Room</h6>
              <i className="fas fa-long-arrow-up arrow"></i>
            </div>

            <div className="chat-body">
              <i className="fas fa-construction"></i>
              <h4>Coming Soon!</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
