import React, { useEffect, useState } from 'react';
import './Mission.scss';
import '../Settings/Settings.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { LocalizationProvider, DateField } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import Feedbacks from '../../component/Feedback';

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

export default function EditMission() {
    const [Title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [Team, setTeam] = useState(0);
    const [start, setStart] = useState<Dayjs | null>(dayjs());
    const [end, setEnd] = useState<Dayjs | null>(dayjs());
    const [open, setOpen] = useState(false);
    const [id, setId] = useState(0);
    const location = useLocation();
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    let teamList: number[] = [0, 1, 2, 3];

    const navigate = useNavigate();

    const getTeam = async () => {
        try {
            await axios
                .get(`http://localhost:8080/team?page=1`)
                .then((data) => {
                    for (let i = 0; i < data.data.results.length; i += 1) {
                        teamList.push(data.data.results[i].id);
                    }
                })
                .catch((e) => {
                    console.log(e);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const getMission = async () => {
        try {
            await axios
                .get(`http://localhost:8080/mission/${id}`)
                .then((data) => {
                    for (let i = 0; i < data.data.results.length; i += 1) {
                        teamList.push(data.data.results[i].id);
                    }
                    setTitle(data.data.results.title);
                    setEnd(data.data.results.end);
                    setStart(data.data.results.start);
                    setTeam(data.data.results.team);
                })
                .catch((e) => {
                    console.log(e);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const handleChange = (event: SelectChangeEvent) => {
        setTeam(Number(event.target.value));
    };

    const setMessage = (mess: string, color: string) => {
        setMess({ mess: mess, color: color });
    };

    const UpdateMission = async () => {
            try {
                await axios
                    .patch(`http://localhost:8080/mission/${id}`, 
                    )
                    .then(() => {
                        setMessage('Saved !', 'sucess');
                        navigate('/dashboard');
                    })
                    .catch((e) => {
                        setMessage(e.message, 'error');
                    });
            } catch (error) {
                throw error;
            }
    };

    const CancelMission = () => {
        navigate('/dashboard');
    };

    useEffect(() => {
        setId(location.state.missionId);
        getTeam();
        getMission();
    }, []);

    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                <div className="page-info">
                    <div>
                        <h2 style={{ fontSize: '28px', fontFamily: 'Arial' }}>
                            Edit mission
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
                        <h3 style={{ margin: '0px' }}>Frame Mission Web</h3>
                        <p style={{ margin: '0px', fontSize: '17px' }}>
                            Change the mission's setting and details
                        </p>
                    </div>
                    <div className="edit-form">
                        <Input
                            label="Title"
                            labelState={Title}
                            setLabel={setTitle}
                            size="medium"
                        />
                        <Input
                            labelState={description}
                            setLabel={setDescription}
                            label="Description"
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
                                {teamList!.map((miss) => {
                                    return (
                                        <MenuItem
                                            sx={{
                                                fontFamily: 'Poppins-Regular',
                                                fontSize: '14px',
                                            }}
                                            value={miss}
                                        >
                                            {miss}
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
                                    setOpen(true);
                                    UpdateMission();
                                }}
                            >
                                Save
                            </button>
                        </div>
                        {open && (
                            <Feedbacks mess={message.mess} color={message.color} open={open}/>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
