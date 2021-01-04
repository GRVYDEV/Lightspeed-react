import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Plyr from "plyr";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      error: null,

      ws: null,
    };
  }

  componentDidMount() {
    fetch("config.json")
      .then(res => res.json())
      .then(
        (result) => {
          if (result.hasOwnProperty("wsUrl"))
            this.connect(result.wsUrl);
          else
            console.error("config.json is invalid")
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        });
  }

  timeout = 250;

  connect = (url) => {
    var ws = new WebSocket(url);
    let that = this;
    var connectInterval;

    ws.onopen = () => {
      console.log("Connected to websocket");

      this.setState({ws: ws});

      that.timeout = 250;

      clearTimeout(connectInterval);
    };

    ws.onclose = (e) => {
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          10000 / 1000,
          (that.timeout + that.timeout) / 1000
        )} second.`,
        e.reason
      );

      that.timeout = that.timeout + that.timeout;
      connectInterval = setTimeout(this.check, Math.min(10000, that.timeout));
    };

    // websocket onerror event listener
    ws.onerror = (err) => {
      console.error(
        "Socket encountered error: ",
        err.message,
        "Closing socket"
      );

      ws.close();
    };
  };

  check = () => {
    const {ws, isLoaded} = this.state;
    if (isLoaded && (!ws || ws.readyState == WebSocket.CLOSED)) this.connect(); //check if websocket instance is closed, if so call `connect` function.
  };

  render() {
    return <App websocket={this.state.ws}></App>;
  }
}

function App(props) {
  let pc = new RTCPeerConnection();
  let log = (msg) => {
    document.getElementById("div").innerHTML += msg + "<br>";
  };

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
  pc.addTransceiver("audio", {direction: "recvonly"});
  // pc.addTransceiver('video', { 'direction': 'recvonly' })
  pc.addTransceiver("video", {direction: "recvonly"});

  let ws = props.websocket;
  pc.onicecandidate = (e) => {
    if (!e.candidate) {
      console.log("Candidate fail");
      return;
    }

    ws.send(
      JSON.stringify({event: "candidate", data: JSON.stringify(e.candidate)})
    );
  };

  if (ws) {
    ws.onmessage = function (evt) {
      let msg = JSON.parse(evt.data);
      if (!msg) {
        return console.log("failed to parse msg");
      }

      switch (msg.event) {
        case "offer":
          console.log("offer");
          let offer = JSON.parse(msg.data);
          if (!offer) {
            return console.log("failed to parse answer");
          }
          pc.setRemoteDescription(offer);
          pc.createAnswer().then((answer) => {
            pc.setLocalDescription(answer);
            ws.send(
              JSON.stringify({event: "answer", data: JSON.stringify(answer)})
            );
          });
          return;

        case "candidate":
          console.log("candidate");
          let candidate = JSON.parse(msg.data);
          if (!candidate) {
            return console.log("failed to parse candidate");
          }

          pc.addIceCandidate(candidate);
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
                    <i class="fas fa-construction badge-icon"></i>Alpha
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
              <i class="fas fa-long-arrow-up arrow"></i>
            </div>

            <div className="chat-body">
              <i class="fas fa-construction"></i>
              <h4>Coming Soon!</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
