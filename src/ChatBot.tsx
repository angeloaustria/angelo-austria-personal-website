import { Button, Chat, Heading, Input } from "@angeloaustria/angelo-ui";
import React from "react";
import api from "./services/api";

interface ChatMessage {
  timestamp: Date;
  isAngelo: boolean;
  message: string;
}

const ChatBot: React.FC = () => {
  const dummyLiElement = React.useRef<HTMLLIElement | null>(null);
  const [chatHistory, setChatHistory] = React.useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = React.useState("");
  const submit = async () => {
    setChatHistory((history) => [
      ...history,
      { message: userInput, isAngelo: false, timestamp: new Date() },
    ]);
    setUserInput("");
    const res = await api.post("https://angelo-qna.herokuapp.com/angeloqna", {
      message: userInput,
    });
    setChatHistory((history) => [
      ...history,
      { message: res.data.answer, isAngelo: true, timestamp: new Date() },
    ]);
  };
  React.useEffect(() => {
    dummyLiElement.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);
  return (
    <>
      {chatHistory.length === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <img
            src={require("./profilepic.jpeg")}
            width="100"
            height="100"
            style={{ borderRadius: "50%", marginRight: "0.5rem" }}
            alt="profilepic"
          />
          <Heading label="Angelo Austria" element="h1" />
          <p>Ask me anything!</p>
        </div>
      )}
      {chatHistory.length > 0 && (
        <ul
          style={{
            listStyleType: "none",
            height: "300px",
            overflowY: "scroll",
            paddingRight: "0.5rem",
          }}
        >
          {chatHistory.map((c) => (
            <li
              key={c.timestamp.toISOString()}
              style={{ marginBottom: "0.5rem" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: c.isAngelo ? "flex-start" : "flex-end",
                  alignItems: "center",
                }}
              >
                {c.isAngelo && (
                  <img
                    src={require("./profilepic.jpeg")}
                    width="50"
                    height="50"
                    style={{ borderRadius: "50%", marginRight: "0.5rem" }}
                    alt="profilepic"
                  />
                )}
                <Chat text={c.message} sender={c.isAngelo} />
              </div>
            </li>
          ))}
          <li ref={dummyLiElement} />
        </ul>
      )}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div style={{ display: "flex" }}>
          <Input
            fullWidth
            placeholder="Enter message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <Button label="Submit" type="submit" />
        </div>
      </form>
    </>
  );
};

export default ChatBot;
