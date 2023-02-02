import NavBar from "./component/NavBar"
import Login from "./pages/LogIn"
import SignUp from "./pages/SignUp"
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Footer from "./component/Footer"

function App() {  
  return (
    <>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/about" element={<About />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
