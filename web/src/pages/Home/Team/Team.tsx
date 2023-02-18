import React from 'react';
import './Team.scss';

export default function Team() {
    return (
        <div id="team" className="team">
            <h1>
                Voron<span>Team</span>
            </h1>
            <div className="member">
                <div className="grid">
                    <MemberBox role="Front-end developper">Camelia</MemberBox>
                    <MemberBox role="Front-end developper">Blacky</MemberBox>
                    <MemberBox role="Front-end developper">Clara</MemberBox>
                </div>
                <div className="grid">
                    <MemberBox role="Back-end developper">Djnn</MemberBox>
                    <MemberBox role="Back-end developper">Naadi</MemberBox>
                    <MemberBox role="Back-end developper">Mat</MemberBox>
                </div>
            </div>
        </div>
    );
}

function MemberBox({
    children,
    role,
    ...props
}: {
    children: string;
    role: string;
}) {
    return (
        <div className="member-card">
            <div className="member-content">
                <div className="photo" />
                <div className="info-box">
                    <h4 className="name">{children}</h4>
                    <h5 className="role">{role}</h5>
                </div>
            </div>
        </div>
    );
}
