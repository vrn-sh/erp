import Login from "./pages/LogIn"
import {SignUp} from './pages/SignUp';
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import About from "./pages/About"
import "./global-variable.scss"

function App() {  
  return (
    <>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App
