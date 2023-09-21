import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Chip } from '@mui/material';

type MissionDetail = {
    id: number;
    name: string;
    scope: string[];
    status: string;
};

type MissionProps = {
    id: number;
    status: string;
    title: string;
    scope: string[];
    team: number;
}[];

function MissionCard({ id, name, scope, status }: MissionDetail) {
    const navigate = useNavigate();

    const NavMissionDetail = () => {
        navigate('/mission/detail', {
            state: {
                missionId: id,
                scopeList: scope,
            },
        });
    };

    return (
        <div className="profile-mission-card">
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    gap: '1rem',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignContent: 'center',
                    }}
                >
                    <h4>{name}</h4>
                    {status === 'In progress' ? (
                        <Chip
                            label={status}
                            color="warning"
                            variant="outlined"
                            size="small"
                        />
                    ) : (
                        <Chip
                            label={status}
                            color="success"
                            variant="outlined"
                            size="small"
                        />
                    )}
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '50px',
                        overflow: 'scroll',
                    }}
                >
                    {scope.map((s) => {
                        return <h4>{s}</h4>;
                    })}
                </div>
                <div
                    style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'end',
                    }}
                >
                    <button
                        type="button"
                        className="detail-btn"
                        onClick={() => NavMissionDetail()}
                    >
                        Open
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function TableRow(props: {
    // eslint-disable-next-line
    missionList: MissionProps 
}) {
    const prop = props;

    return (
        <tr>
            <td colSpan={5}>
                <div className="profile-mission-detail">
                    {prop.missionList.map((mission) => {
                        return (
                            <MissionCard
                                id={mission.id}
                                name={mission.title}
                                scope={mission.scope}
                                status={mission.status}
                            />
                        );
                    })}
                </div>
            </td>
        </tr>
    );
}
