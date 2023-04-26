import React, { useEffect, useState } from 'react';
import './Mission.scss';
import '../Settings/Settings.scss';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import Cookies from 'js-cookie';
import Feedbacks from '../../component/Feedback';
import TopBar from '../../component/SideBar/TopBar';
import SideBar from '../../component/SideBar/SideBar';
import config from '../../config';

type InputSizes = 'small' | 'medium' | 'large';

type InputProps = {
    label: string;
    labelState: any;
    setLabel: React.Dispatch<React.SetStateAction<string>>;
    size: InputSizes;
};

function Input({ label, labelState, setLabel, size }: InputProps) {
    return (
        <div className={`input input-${size}`}>
            <label htmlFor={`input-${label}`} className="input-label">
                {label}
            </label>
            <input
                id={`input-${label}`}
                type="text"
                required
                value={labelState}
                onChange={(e) => setLabel(e.target.value)}
            />
        </div>
    );
}

export default function CreateMission() {
    const [Title, setTitle] = useState('');
    const [Team, setTeam] = useState(0);
    const [start, setStart] = useState<Dayjs>(dayjs());
    const [end, setEnd] = useState<Dayjs>(dayjs());
    const [open, setOpen] = useState(false);
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    const [teamList, setTeamList] = useState<{ id: number; name: string }[]>([
        { id: 0, name: '' },
    ]);

    const navigate = useNavigate();

    const getTeam = async () => {
        await axios
            .get(`${config.apiUrl}/team?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            })
            .then((data) => {
                const tab = [];
                for (let i = 0; i < data.data.results.length; i += 1) {
                    tab.push({
                        id: data.data.results[i].id,
                        name: data.data.results[i].name,
                    });
                }
                setTeamList(tab);
            })
            .catch((e) => {
                throw e;
            });
    };

    const close = () => {
        setOpen(false);
    };

    const handleChange = (event: SelectChangeEvent) => {
        setTeam(Number(event.target.value));
    };

    const setMessage = (mess: string, color: string) => {
        setMess({ mess, color });
    };

    const CancelMission = () => {
        navigate('/dashboard');
    };

    const handleSubmit = async () => {
        if (Team === 0) {
            setMessage('Please choose a team', 'error');
            return;
        }
        if (start.isBefore(dayjs(), 'day') || end.isBefore(dayjs(), 'day')) {
            setMessage(
                'Please select a date that has not already passed !',
                'error'
            );
            return;
        }
        await axios
            .post(
                `${config.apiUrl}/mission`,
                {
                    title: Title,
                    start: start.format('YYYY-MM-DD'),
                    end: end.format('YYYY-MM-DD'),
                    team: Team,
                },
                {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Token ${Cookies.get('Token')}`,
                    },
                }
            )
            .then(() => {
                setMessage('Created!', 'success');
            })
            .catch((e) => {
                setMessage(e.message, 'error');
            });
    };

    useEffect(() => {
        getTeam();
    }, []);

    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                <div className="page-info">
                    <div>
                        <h2 style={{ fontSize: '28px', fontFamily: 'Arial' }}>
                            Create new mission
                        </h2>
                    </div>
                    <div className="page-searcher">
                        <label>Search on page</label>
                        <input type="text" placeholder="Search..." />
                    </div>
                </div>
                <div className="edit-container">
                    <div
                        style={{
                            margin: '20px',
                            textAlign: 'left',
                            width: '30%',
                        }}
                    >
                        <h3 style={{ margin: '0px' }}>New Mission</h3>
                        <p style={{ margin: '0px', fontSize: '17px' }}>
                            You can create a new mission
                        </p>
                    </div>
                    <div className="edit-form">
                        <Input
                            label="Title"
                            labelState={Title}
                            setLabel={setTitle}
                            size="medium"
                        />
                        <FormControl
                            sx={{ paddingY: 2, width: '100%' }}
                            size="small"
                        >
                            <InputLabel
                                id="Team"
                                sx={{
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: '14px',
                                }}
                            >
                                Team
                            </InputLabel>
                            <Select
                                labelId="Team"
                                id="Team-select"
                                value={Team.toString()}
                                required
                                label="Team"
                                onChange={handleChange}
                            >
                                {teamList!.map((team) => {
                                    return (
                                        <MenuItem
                                            sx={{
                                                fontFamily: 'Poppins-Regular',
                                                fontSize: '14px',
                                            }}
                                            value={team.id}
                                        >
                                            {team.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateField
                                label="Start date"
                                value={start}
                                sx={{ padding: '6px', width: '50%' }}
                                onChange={(newValue: any) => setStart(newValue)}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateField
                                label="End date"
                                value={end}
                                sx={{ padding: '6px', width: '50%' }}
                                onChange={(newValue: any) => setEnd(newValue)}
                            />
                        </LocalizationProvider>
                        <br />
                        <div
                            style={{
                                display: 'flex',
                                width: '150px',
                                justifyContent: 'space-between',
                            }}
                        >
                            <button
                                type="submit"
                                className="cancel-btn"
                                onClick={CancelMission}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="submit-button"
                                onClick={() => {
                                    handleSubmit();
                                    setOpen(true);
                                }}
                            >
                                Save
                            </button>
                        </div>
                        {open && (
                            <Feedbacks
                                mess={message.mess}
                                color={message.color}
                                close={close}
                                open={open}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
