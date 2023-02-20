import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home/Home"
import About from "./pages/Home/About/About"
import "./global-variable.scss"
import Login from "./pages/Login/Login"
import SignUp from "./pages/SignUp"
import Dashboard from "./pages/Dashboard/Dashboard"

function App() {  
  return (
    <>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App;
