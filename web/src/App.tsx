import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/Home/About/About';
import './global-variable.scss';
import Login from './pages/Login/Login';
import ProfilePage from './pages/Profile/Profile';
import EditMission from './pages/editMission/EditMission';
import CreateMission from './pages/editMission/CreateMission';
import Dashboard from './pages/Dashboard/Dashboard';
import Setting from './pages/Setting/setting';
import AddVulnerability from './pages/vulnerability/addvulnerability';
import SignUp from './pages/SignUp/SignUp';
import NotFound from './pages/Error/Error';

function App() {
    return (
        <div className="container">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sign_up" element={<SignUp />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/editmission" element={<EditMission />} />
                <Route path="/createmission" element={<CreateMission />} />
                <Route path="/addvulnerability" element={<AddVulnerability />} />
                <Route path="/settings" element={<Setting />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/mission/edit" element={<EditMission />} />
                <Route path="/mission/create" element={<CreateMission />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
