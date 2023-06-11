import "./App.css";
import Chat from "./components/Chat/Chat";
import ChatForm from "./components/ChatForm/ChatForm";
import SigninChatForm from "./components/SigninChatForm/SigninChatForm";

import { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import { nanoid } from "nanoid";

const socket = io.connect("http://localhost:5001");

function App() {
  const [nickname, setNickname] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("chat-message", (message) => {
      setMessages((prevState) => {
        const newMessage = {
          id: nanoid(),
          type: "user",
          message,
        };

        return [newMessage, ...prevState];
      });
    });
  }, []);

  const addNickname = useCallback(
    ({ name }) => setNickname(name),
    [setNickname]
  );

  const addMessage = useCallback(
    ({ message }) => {
      setMessages((prevState) => {
        const newMessage = {
          id: nanoid(),
          type: "you",
          message,
        };

        return [newMessage, ...prevState];
      });

      socket.emit("chat-message", message);
    },
    [setMessages]
  );

  return (
    <div className="App">
      {!nickname && <SigninChatForm onSubmit={addNickname} />}
      {nickname && <ChatForm onSubmit={addMessage} />}
      {nickname && <Chat items={messages} />}
    </div>
  );
}

export default App;
