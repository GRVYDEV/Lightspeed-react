import React, { createContext, useContext, useState } from "react";
import { url } from "../assets/constants";
import PropTypes from "prop-types";

export const SocketContext = createContext();

const webSocket = new WebSocket(url);

const SocketProvider = ({ children }) => {
  const [socket] = useState(webSocket);
  const [wsTimeout, setWsTimeout] = useState(250);
  const [connectInterval, setConnectInterval] = useState(null);

  const check = () => {
    if (!socket || socket.readyState === WebSocket.CLOSED) {
      console.log(socket);
      //socket.connect();
    } //check if websocket instance is closed, if so call `connect` function.
  };

  socket.onopen = () => {
    console.log("Connected to websocket");

    setWsTimeout(250);

    clearTimeout(connectInterval);
  };

  socket.onclose = (e) => {
    console.log(
      `Socket is closed. Reconnect will be attempted in ${Math.min(
        10,
        (2 * wsTimeout) / 1000
      )} second.`,
      e.reason
    );

    setWsTimeout(2 * wsTimeout);
    const interval = setTimeout(check, Math.min(10000, wsTimeout));
    setConnectInterval(interval);
  };

  socket.onerror = (err) => {
    console.error("Socket encountered error: ", err.message, "Closing socket");

    socket.close();
  };

  const value = {
    socket,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be nested in SocketProvider");
  }

  return context;
};

export default SocketProvider;

SocketProvider.propTypes = {
  children: PropTypes.object,
};
