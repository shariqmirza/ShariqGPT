import './App.css'
import Sidebar from './Sidebar.jsx'
import ChatWindow from './ChatWindow.jsx'
import MyContext from './MyContext.jsx'
import Background from './Background.jsx'
import { useState } from 'react'
import {v1 as uuidv1} from 'uuid'

function App() {
  const [prompt, setPrompt] = useState("")
  const [reply, setReply] = useState(null)
  const [currThreadId, setCurrThreadId] = useState(uuidv1())
  const [newChat, setNewChat] = useState(true)
  const [prevChat, setPrevChat] = useState([])
  const [allThreads, setAllThreads] = useState([])

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChat, setPrevChat,
    allThreads, setAllThreads,
  }
  return (
    <div className='main'>
      <MyContext.Provider value={providerValues}>
        <Background></Background>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
        </MyContext.Provider>
    </div>
  )
}

export default App
