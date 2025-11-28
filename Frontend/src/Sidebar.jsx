import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import MyContext from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
const API_URL = import.meta.env.VITE_API_URL;

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChat,
    sidebarOpen,
    setSidebarOpen,
  } = useContext(MyContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getAllThreads = async () => {
    try {
      const response = await fetch(`${API_URL}/api/thread`);
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));
      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChat([]);
    setIsOpen(false);
  };

  const changeThread = async (newThredId) => {
    setCurrThreadId(newThredId);
    try {
      const response = await fetch(`${API_URL}/api/thread/${newThredId}`);
      const res = await response.json();
      setPrevChat(res);
      setNewChat(false);
      setReply(null);
      setIsOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      await fetch(`${API_URL}/api/thread/${threadId}`, { method: "DELETE" });
      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );
      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {/* Hamburger only when sidebar is closed */}
      {!sidebarOpen && (
        <button className="hamburger" onClick={toggleSidebar}>
          <i className="fa-solid fa-bars"></i>
        </button>
      )}

      <section className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="top">
          <img src="/ShariqGPT.png" alt="ShariqGPT Logo" id="logo" />
          {sidebarOpen && (
            <i
              className="fa-solid fa-xmark close-btn"
              onClick={toggleSidebar}
            ></i>
          )}
        </div>

        <button className="new-chat" onClick={createNewChat}>
          <span>
            <i className="fa-solid fa-pen-to-square"></i> New Chat
          </span>
        </button>

        <ul className="history">
          {allThreads?.map((thread, idx) => (
            <li key={idx} onClick={() => changeThread(thread.threadId)}>
              {thread.title}
              <i
                className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))}
        </ul>

        <div className="sign">
          <i>
            <p>Developed by Shariq</p>
          </i>
        </div>
      </section>
    </>
  );
}

export default Sidebar;
