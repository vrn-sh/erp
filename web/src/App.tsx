import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/Home/About/About';
import './global-variable.scss';
import Login from './pages/Login/Login';
import ProfilePage from './pages/Profile/Profile';
import Dashboard from './pages/Dashboard/Dashboard';
import AddVulnerability from './pages/Vulnerability/AddVul';
import SignUp from './pages/SignUp/SignUp';
import NotFound from './pages/Error/Error';
import Settings from './pages/Settings/Settings';
import EditMission from './pages/EditMission/EditMission';
import CreateMission from './pages/EditMission/CreateMission';
import MissionDetail from './pages/MissionDetail/MissionDetail';
import Team from './pages/Team/Team';
import CreateTeam from './pages/Team/CreateTeam';
import EditTeam from './pages/Team/EditTeam';
import PrivatePolicy from './pages/Home/PrivacyPolicy';
import TermOfUse from './pages/Home/TermOfUse';
import ConfirmEmail from './pages/SignUp/ConfirmEmail';
import EditVulnerability from './pages/Vulnerability/EditVuln';
import VulnerabilityDetail from './pages/Vulnerability/VulnDetail';
import ViewTeamDetails from './pages/Team/ViewTeam';
import Accueil from './pages/Dashboard/Accueil';
import InfoForm from './pages/SignUp/InfoForm';

function App() {
    return (
        <div className="container">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/privacypolicy" element={<PrivatePolicy />} />
                <Route path="/termofuse" element={<TermOfUse />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sign_up" element={<SignUp />} />
                <Route path="/info" element={<InfoForm />} />
                <Route path="/confirm" element={<ConfirmEmail />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/accueil" element={<Accueil />} />
                <Route path="/vuln/add" element={<AddVulnerability />} />
                <Route path="/vuln/edit" element={<EditVulnerability />} />
                <Route path="/vuln/detail" element={<VulnerabilityDetail />}/>
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/mission/detail" element={<MissionDetail />} />
                <Route path="/mission/edit" element={<EditMission />} />
                <Route path="/mission/create" element={<CreateMission />} />
                <Route path="/team" element={<Team />} />
                <Route path="/team/create" element={<CreateTeam />} />
                <Route path="/team/view/:id" element={<ViewTeamDetails />}/>
                <Route path="/team/edit" element={<EditTeam />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
