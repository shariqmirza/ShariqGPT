import "./Chat.css";
import { useContext, useState, useEffect } from "react";
import MyContext from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChat, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }
    //latest reply saperate - typing effect create
    if (!prevChat?.length) return;

    const content = reply.split(" ");

    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [prevChat, reply]);
  return (
    <>
      {newChat && <h2 id="new-chat">Start a New Chat</h2>}
      <div className="chats">
        {prevChat?.slice(0, -1).map((chat, idx) => (
          <div
            className={chat.role === "user" ? "user-div" : "gpt-div"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="user-div">{chat.content}</p>
            ) : (
              <ReactMarkdown rehypePlugins={rehypeHighlight}>
                {chat.content}
              </ReactMarkdown>
            )}
          </div>
        ))}
        {prevChat.length > 0 && (
          <>
            {latestReply === null ? (
              <div className="gpt-div" key={"non-typing"}>
                <ReactMarkdown rehypePlugins={rehypeHighlight}>
                  {prevChat[prevChat.length - 1].content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="gpt-div" key={"typing"}>
                <ReactMarkdown rehypePlugins={rehypeHighlight}>
                  {latestReply}
                </ReactMarkdown>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Chat;
