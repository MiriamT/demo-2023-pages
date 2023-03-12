import { useState, useEffect } from "react";
import { useInterval } from "../../hooks/use-interval";

export const Chat = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInputText, setMessageInputText] = useState("");

  function fetchChats() {
    fetch(`https://z36h06gqg7.execute-api.us-east-1.amazonaws.com/chats`)
      .then((response) => response.json())
      .then((data) => {
        setChats(data.Items);
      });
  }

  function sendMessage() {
    const message = {
      chatId: currentChat.id,
      username: "prof",
      text: messageInputText,
    };
    fetch("https://z36h06gqg7.execute-api.us-east-1.amazonaws.com/messages", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // tells REST that we will send the body data in JSON format
      },
      body: JSON.stringify(message),
    });
    setMessageInputText("");
  }

  function onInputChange(event) {
    setMessageInputText(event.target.value);
  }

  useEffect(() => {
    fetchChats();
  }, []);

  useInterval(
    (params) => {
      const chatId = params[0];
      if (chatId) {
        fetch(
          `https://z36h06gqg7.execute-api.us-east-1.amazonaws.com/chats/${chatId}/messages`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data.Items);
            setMessages(data.Items);
          });
      }
    },
    1000, // fast polling
    // 60000, // slow polling
    currentChat && currentChat.id
  );

  return (
    <div style={{ display: "flex" }}>
      <div style={{}}>
        <h2> Chats </h2>

        {chats.map((chat) => (
          <div key={chat.id}>
            <button onClick={() => setCurrentChat(chat)}>{chat.name}</button>
          </div>
        ))}
      </div>
      <div style={{ flex: 1 }}>
        <h2>{(currentChat && currentChat.name) || ""} Messages </h2>
        <div>
          <input value={messageInputText} onChange={onInputChange} />{" "}
          <button onClick={sendMessage}>POST</button>
        </div>
        {currentChat &&
          messages.map((message, index) => (
            <div key={index}>
              {message.isoDate} {message.username}: {message.text}
            </div>
          ))}
      </div>
    </div>
  );
};
