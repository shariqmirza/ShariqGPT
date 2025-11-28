import './Sidebar.css'
import { useContext, useEffect } from 'react';
import MyContext from './MyContext.jsx'
import {v1 as uuidv1} from "uuid"
const API_URL = import.meta.env.VITE_API_URL;

function Sidebar(){
    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChat} = useContext(MyContext);

    const getAllThreads = async ()=> {
        try{
            const response = await fetch(`${API_URL}/api/thread`)
            const res = await response.json();
            const filteredData = await res.map(thread => ({threadId: thread.threadId, title: thread.title}))
            // console.log(filteredData);
            setAllThreads(filteredData)
            
        }catch(err){
            console.log(err)
        }
    }
    useEffect(()=>{
        getAllThreads();
    }, [currThreadId])


    const createNewChat = ()=>{
        setNewChat(true)
        setPrompt("")
        setReply(null)
        setCurrThreadId(uuidv1())
        setPrevChat([])
    }

    const changeThread = async (newThredId) =>{
        setCurrThreadId(newThredId)

        try{
           const response = await fetch(`${API_URL}/api/thread/${newThredId}`)
           const res = await response.json()
           console.log(res)
           setPrevChat(res)
           setNewChat(false)
           setReply(null)

        }catch(err){
            console.log(err)
        }
    }

    const deleteThread = async (threadId)=>{
        try{
            const response = await fetch(`${API_URL}/api/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json()
            // console.log(res)

            // update all thread re-render threads
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
            if(threadId === currThreadId){
                createNewChat();
            }


        }catch(err){
            console.log(err)
        }
    }

    return(
        <section className="sidebar">
            {/* logo */}
                <div>
                    <img src="/src/assets/ShariqGPT.png" alt="ShariqGPT Logo" id="logo"></img>
                </div>

            {/* new chat */}
            <button className="new-chat" onClick={createNewChat}>
                <span><i className="fa-solid fa-pen-to-square"></i>New Chat</span>
            </button>

            {/* //history chat */}
                <ul className="history">
                    {
                        allThreads?.map((thread, idx)=>(
                            <li key={idx}
                                onClick={(e)=>changeThread(thread.threadId)}
                            >
                            
                            {thread.title}
                            <i className="fa-solid fa-trash"
                                onClick={(e)=>{
                                    e.stopPropagation() // event bubbling
                                    deleteThread(thread.threadId)
                                }}
                            ></i>
                            </li>
                            
                            
                        ))
                    }
                    
                </ul>

            {/* //sign */}
            
            <div className="sign">
                
                <i><p>Developed by Shariq</p></i>
            </div>
            
        </section>
    )
}

export default Sidebar;