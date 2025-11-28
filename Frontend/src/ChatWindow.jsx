import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { useContext, useState, useEffect} from "react";
import MyContext from './MyContext.jsx'
import {CircleLoader} from 'react-spinners'
const API_URL = import.meta.env.VITE_API_URL;

function ChatWindow() {
  const {prompt, setPrompt, reply, setReply, currThreadId, prevChat, setPrevChat, setNewChat} = useContext(MyContext);
  const [loading, setLoading] = useState(false);

  const getReply = async ()=>{
    setLoading(true)
    setNewChat(false)
    const options = {
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
          message: prompt,
          threadId: currThreadId,
      }),
    }
    try {
        const response = await fetch(`${API_URL}/api/chat`, options);
        const res = await response.json();
        console.log(res)
        setReply(res.reply)
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  //Append new chat to prevchat
  useEffect(() => {
  if ( prevChat && reply) {
    setPrevChat(prevChat => [
      ...prevChat,
      { role: "user", content: prompt },
      { role: "assistant", content: reply }
    ]);
  }

  setPrompt("");
}, [reply]);

  return (
    <div className="chat-window">
      <div className="nav-bar">
        <span>
          ShariqGPT <i className="fa-solid fa-angle-down"></i>
        </span>
        <div className="user-profile-icon">
          <span>
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      <Chat></Chat>
      <CircleLoader color="#a92c3b" loading={loading}>

      </CircleLoader>
      <div className="chat-input">
        <div className="user-input">
          <input type="text" placeholder="Ask anything"
            value={prompt} onChange={(e)=> setPrompt(e.target.value)}
            onKeyDown={(e)=> e.key === "Enter"? getReply(): ''}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
          ShariqGPT can make mistakes. Check important info. See Cookie
          Preferences.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
