import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/Home/About/About';
import './global-variable.scss';
import Login from './pages/Login/Login';
import {SignUp} from './pages/Register/SignUp';
import Dashboard from './pages/Dashboard/Dashboard';
import Setting from './pages/Setting/setting';
import ProfilePage from './pages/Profile/profile';
import EditMission from './pages/editMission/editMission';
import CreateMission from './pages/editMission/createMission';
import AddVulnerability from './pages/vulnerability/addvulnerability';

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
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/editmission" element={<EditMission />} />
                <Route path="/createmission" element={<CreateMission />} />
                <Route path="/addvulnerability" element={<AddVulnerability />} />
            </Routes>
        </div>
    );
}

export default App;
