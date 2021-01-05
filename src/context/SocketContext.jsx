import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { url } from "../assets/constants";
import PropTypes from "prop-types";

export const SocketContext = createContext();

const socketReducer = (state, action) => {
  switch (action.type) {
    case "renewSocket": {
      let timeout = state.wsTimeoutDuration * 2;
      if (timeout > 10000) {
        timeout = 10000;
      }
      console.log("creating websocket");
      return {
        ...state,
        socket: new WebSocket(url),
        wsTimeoutDuration: timeout,
      };
    }
    case "updateInterval": {
      return { ...state, connectInterval: action.interval };
    }
    case "clearInterval": {
      clearInterval(state.connectInterval);
      return { ...state };
    }
    case "resetTimeoutDuration": {
      return { ...state, wsTimeoutDuration: 250 };
    }
    default: {
      return { ...state };
    }
  }
};

const initialState = {
  socket: new WebSocket(url),
  wsTimeoutDuration: 250,
  connectInterval: null,
};

const SocketProvider = ({ children }) => {
  const [state, dispatch] = useReducer(socketReducer, initialState);

  const { socket, wsTimeoutDuration } = state;

  useEffect(() => {
    socket.onopen = () => {
      dispatch({ type: "resetTimeoutDuration" });
      console.log("Connected to websocket");
    };

    socket.onclose = (e) => {
      const { reason } = e;
      console.log(
        `Socket is closed. Reconnect will be attempted in ${Math.min(
          wsTimeoutDuration / 1000
        )} second. ${reason}`
      );

      const interval = setTimeout(() => {
        //check if websocket instance is closed, if so call `setupConnect` function.
        if (!socket || socket.readyState === WebSocket.CLOSED) {
          dispatch({ type: "renewSocket" });
        }
      }, wsTimeoutDuration);

      dispatch({ type: "updateInterval", interval });
    };

    socket.onerror = (err) => {
      const { message } = err;
      console.error(`Socket encountered error: ${message}, Closing socket.`);
      socket.close();
    };
  }, [socket]);

  const value = {
    socket: state.socket,
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
