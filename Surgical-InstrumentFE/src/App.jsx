import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Routing from './route/Routing'
import Chatbot from './components/Chatbot/Chatbot'
import { BrowserRouter } from 'react-router-dom'

function App() {
  return  (
    <div className='app'>
     <BrowserRouter>
       <Routing />
     </BrowserRouter>
     <Chatbot />
    </div>
  )
}

export default App
