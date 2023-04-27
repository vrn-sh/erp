import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/Home/About/About';
import './global-variable.scss';
import Login from './pages/Login/Login';
import ProfilePage from './pages/Profile/Profile';
import Dashboard from './pages/Dashboard/Dashboard';
import AddVulnerability from './pages/Vulnerability/Add';
import SignUp from './pages/SignUp/SignUp';
import NotFound from './pages/Error/Error';
import Settings from './pages/Settings/Settings';
import EditMission from './pages/EditMission/EditMission';
import CreateMission from './pages/EditMission/CreateMission';
import MissionDetail from './pages/Dashboard/SubDashboards/MissionDetail/MissionDetail';

function App() {
    return (
        <div className="container">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sign_up" element={<SignUp />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/vuln/add" element={<AddVulnerability />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/mission/detail" element={<MissionDetail />} />
                <Route path="/mission/edit" element={<EditMission />} />
                <Route path="/mission/create" element={<CreateMission />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
