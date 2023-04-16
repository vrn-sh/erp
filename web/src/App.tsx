import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/Home/About/About';
import './global-variable.scss';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Setting from './pages/Setting/Setting';
import SignUp from './pages/SignUp/SignUp';
import NotFound from './pages/Error/Error';

function App() {
    return (
        <div className="container">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
