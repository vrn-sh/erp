import React from 'react';
import Modal from 'react-modal';
import './Dashboard.scss';
import Mission from './SubDashboards/Mission';

Modal.setAppElement('#root'); // Make sure to set your root element here

export default function SubDashboard() {
    return (
        <div className="dashboard-pages">
            <div className="page-info">
                <h1>Assigned Missions</h1>
            </div>
            <div className="assigned-missions">
                <Mission />
            </div>
        </div>
    );
}
