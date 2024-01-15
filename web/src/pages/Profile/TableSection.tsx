import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableRow from './TableRow';
import './Profile.scss';
import '../Settings/Settings.scss';

type TeamProps = {
    id: number;
    leader: {
        id: number;
        auth: {
            username: string;
            email: string;
            first_name: string;
            last_name: string;
            last_login: string;
            date_joined: string;
            password: string;
            phone_number: string | null;
            role: number;
            favorites: string | null;
            profile_image: string | null;
        };
        creation_date: string;
    };
    name: string;
    people: number;
};

type MissionProps = {
    id: number;
    status: string;
    title: string;
    scope: string[];
    team: number;
}[];

export default function TableSection(props: {
    /* eslint-disable */
    teamInfo: TeamProps;
    missionList: MissionProps;
    /* eslint-enable */
}) {
    const prop = props;
    const TeamInfo = prop.teamInfo;
    const MissionList = prop.missionList;
    const [showDetail, setShowDetail] = useState(false);
    const [thisMissionList, setThisMissionList] = useState<MissionProps>([]);
    const navigate = useNavigate();

    const NavTeamDetail = () => {
        navigate(`/team/view/${TeamInfo.id}`);
    };

    const DisplayMission = () => {
        const res = [];
        for (let i = 0; i < MissionList.length; i += 1) {
            if (MissionList[i].team === TeamInfo.id) res.push(MissionList[i]);
        }
        setThisMissionList(res);
        setShowDetail(!showDetail);
    };

    return (
        <>
            <tr>
                <td>{TeamInfo.name}</td>
                <td>{TeamInfo.leader.auth.username}</td>
                <td>{TeamInfo.leader.creation_date}</td>
                <td>{TeamInfo.people}</td>
                <td>
                    <button
                        type="button"
                        className="set-button"
                        onClick={() => DisplayMission()}
                    >
                        Mission
                    </button>
                    <button
                        type="button"
                        className="main-button"
                        onClick={() => NavTeamDetail()}
                    >
                        Open
                    </button>
                </td>
            </tr>

            {showDetail && thisMissionList.length > 0 && (
                <TableRow missionList={thisMissionList} />
            )}
            {showDetail && thisMissionList.length === 0 && (
                <h3 style={{ fontFamily: 'Poppins-Regular' }}>
                    No mission in this team
                </h3>
            )}
        </>
    );
}
