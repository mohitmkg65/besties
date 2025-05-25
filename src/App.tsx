import { BrowserRouter, Routes, Route } from "react-router-dom"
import 'remixicon/fonts/remixicon.css'
import 'animate.css';
import 'font-awesome/css/font-awesome.min.css'
import Home from "./components/Home"
import Login from "./components/Login"
import Signup from "./components/Signup"
import Layout from "./components/app/Layout"
import Dashboard from "./components/app/Dashboard"
import Post from "./components/app/Post"
// import Freinds from "./components/app/Freinds"
import FreindList from "./components/app/freind/FreindList";
import Video from "./components/app/Video";
import Audio from "./components/app/Audio";
import Chat from "./components/app/Chat";
import NotFound from "./components/NotFound";
import Context from "./Context";
import { useState } from "react";
import { ToastContainer } from 'react-toastify'
import AuthGuard from "./guards/Guard";
import RedirecctGuard from "./guards/RedirectGuard";

const App = () => {
  const [session, setSession] = useState(null)
  return (
    <Context.Provider value={{session, setSession}}>  
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<RedirecctGuard />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          <Route element={<AuthGuard />}>
            <Route path="/app" element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />}></Route>
              <Route path="my-posts" element={<Post />}></Route>
              <Route path="freinds" element={<FreindList />}></Route>
              <Route path="video-chat" element={<Video />}></Route>
              <Route path="audio-chat" element={<Audio />}></Route>
              <Route path="chat" element={<Chat />}></Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </Context.Provider>
  )
}

export default App