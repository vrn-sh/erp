import React, { useState } from 'react';
import './Accueil.scss';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import { Chip } from '@mui/material';
import * as AiIcons from 'react-icons/ai';
import pp from '../../assets/testpp2.jpg';

type SevProps = {
    title: string;
    value: number;
};

type TeamProps = {
    teamTitle: string;
};

type MissionProps = {
    title: string;
    Vuln: string;
    date: string;
    progressValue: number;
};

type MemberProps = {
    name: string;
};

type ILinearProgressBar = {
    percent: number;
};

function LinearProgressBar({ percent }: ILinearProgressBar) {
    return (
        <div className="mainProgressBarDiv">
            <div className="emptyProgressBar" style={{ width: '100%' }}>
                <div
                    className={
                        percent === 100
                            ? 'greenProgressBar'
                            : 'fillingProgressBar'
                    }
                    style={{
                        left: `${percent - 100}%`,
                        transition: '3s',
                    }}
                />
            </div>
        </div>
    );
}

function SeverityVuln({ title, value }: SevProps) {
    return (
        <div
            style={{
                textAlign: 'left',
                marginLeft: '15px',
                marginRight: '10px',
                marginBottom: '1rem',
            }}
        >
            <label style={{ padding: 0, margin: 0 }}>{title}</label>
            <LinearProgressBar percent={value} />
        </div>
    );
}

function TeamMemberContainer({ name }: MemberProps) {
    return (
        <div className="accueil-team-member-container">
            <img src={pp} alt="profile-pp" className="accueil-team-pp" />
            <p>{name}</p>
        </div>
    );
}

function TeamListContainer({ teamTitle }: TeamProps) {
    return (
        <div className="accueil-team-container">
            <p className="accueil-team-title">{teamTitle}</p>
            <TeamMemberContainer name="co-worker1" />
            <TeamMemberContainer name="co-worker2" />
            <TeamMemberContainer name="co-worker3" />
            <TeamMemberContainer name="co-worker4" />
        </div>
    );
}

function MissionList({ title, Vuln, date, progressValue }: MissionProps) {
    return (
        <div
            style={{
                marginLeft: '15px',
                marginRight: '10px',
                marginBottom: '1rem',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    textAlign: 'left',
                    marginBottom: '1rem',
                }}
            >
                <div className="mission-left-half">
                    <label style={{ padding: 0, margin: 0 }}>{title}</label>
                    <Chip
                        label={Vuln}
                        color="warning"
                        variant="outlined"
                        size="small"
                        style={{
                            margin: 0,
                            fontSize: '10px',
                        }}
                    />
                </div>

                <div className="mission-right-half">
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignContent: 'center',
                        }}
                    >
                        <p>{date}</p>
                        <p>Preview date</p>
                    </div>
                    <AiIcons.AiOutlineMore />
                </div>
            </div>
            <LinearProgressBar percent={progressValue} />
        </div>
    );
}

export default function Accueil() {
    const [numProjects, setNumProjects] = useState(3);

    const data = [
        { value: 5, label: 'in progress' }, // purple
        { value: 10, label: 'finished' }, // green
        { value: 15, label: 'on hold' }, // gray
    ];

    const size = {
        width: 200,
        height: 200,
    };

    const StyledText = styled('text')(({ theme }) => ({
        fill: theme.palette.text.primary,
        textAnchor: 'middle',
        dominantBaseline: 'central',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    }));

    // eslint-disable-next-line
    function PieCenterLabel({ children }: { children: React.ReactNode }) {
        const { width, height, left, top } = useDrawingArea();
        return (
            <StyledText x={left + width / 2} y={top + height / 2}>
                {children}
            </StyledText>
        );
    }

    return (
        <div className="dashboard-pages">
            <div className="page-info">
                <h1>Overviews</h1>
            </div>
            <div className="accueil-container">
                <div className="accueil-grid-3">
                    <div className="accueil-rect" style={{ height: '30vh' }}>
                        <h5>Projects analytics</h5>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <PieChart
                                colors={['#A687E9', '#55D872', '#EAEBEE']}
                                series={[
                                    {
                                        data,
                                        innerRadius: 70,
                                        outerRadius: 50,
                                    },
                                ]}
                                sx={{
                                    '--ChartsLegend-itemWidth': '30px',
                                    '--ChartsLegend-itemMarkSize': '10px',
                                    '--ChartsLegend-rootSpacing': '30px',
                                }}
                                margin={{ left: 80, top: -10 }}
                                {...size}
                                slotProps={{
                                    legend: {
                                        direction: 'row',
                                        position: {
                                            vertical: 'bottom',
                                            horizontal: 'middle',
                                        },
                                    },
                                }}
                                legend={{ hidden: true }}
                            >
                                <PieCenterLabel>
                                    {numProjects} projects
                                </PieCenterLabel>
                            </PieChart>
                        </div>
                    </div>
                    <div className="accueil-rect" style={{ height: '35vh' }}>
                        <h5 style={{ marginBottom: '15px' }}>
                            Top severity of Vulnerability
                        </h5>
                        <div className="rect-scroll">
                            <SeverityVuln title="XSS-Medium" value={76} />
                            <SeverityVuln title="Insecure Design" value={45} />
                            <SeverityVuln title="Injection" value={5} />
                        </div>
                    </div>
                </div>

                <div className="accueil-grid-3">
                    <div className="accueil-rect-long">
                        <h5 style={{ marginBottom: '15px' }}>My mission</h5>
                        <div className="rect-scroll">
                            <MissionList
                                title="Voron"
                                Vuln="XSS-Medium"
                                date="01/11/2023"
                                progressValue={45}
                            />
                            <MissionList
                                title="test"
                                Vuln="Insecure design"
                                date="12/10/2023"
                                progressValue={100}
                            />
                            <MissionList
                                title="test2"
                                Vuln="XSS-Medium"
                                date="30/10/2023"
                                progressValue={80}
                            />
                        </div>
                    </div>
                </div>

                <div className="accueil-grid-3">
                    <div className="accueil-rect-long">
                        <h5
                            style={{ marginBottom: '15px', position: 'sticky' }}
                        >
                            Co-workers
                        </h5>
                        <div className="rect-scroll">
                            <TeamListContainer teamTitle="Team test" />
                            <TeamListContainer teamTitle="Voron" />
                            <TeamListContainer teamTitle="SG groupe" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
