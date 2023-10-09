import React, { useEffect, useState } from 'react';
import './Mission.scss';
import '../Settings/Settings.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { LocalizationProvider, DateField } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import Cookies from 'js-cookie';
import * as AiIcons from 'react-icons/ai';
import Feedbacks from '../../component/Feedback';
import TopBar from '../../component/SideBar/TopBar';
import SideBar from '../../component/SideBar/SideBar';
import config from '../../config';
import Input from '../../component/Input';

export default function EditMission() {
    const [Title, setTitle] = useState('');
    const [Team, setTeam] = useState(0);
    const [start, setStart] = useState<Dayjs>(dayjs());
    const [end, setEnd] = useState<Dayjs>(dayjs());
    const [open, setOpen] = useState(false);
    const [id, setId] = useState(0);
    const location = useLocation();
    const [scope, setScope] = useState<string[]>([]);
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    const [teamList, setTeamList] = useState<{ id: number; name: string }[]>([
        { id: 0, name: '' },
    ]);
    const [deleted, setDeleted] = useState<number[]>([]);
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
                for (let i = 0; i < data.data.length; i += 1) {
                    tab.push({
                        id: data.data[i].id,
                        name: data.data[i].name,
                    });
                }
                setTeamList(tab);
            })
            .catch((e) => {
                throw e;
            });
    };

    const getMission = async () => {
        await axios
            .get(`${config.apiUrl}/mission/${id}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            })
            .then((data) => {
                setTitle(data.data.title);
                setEnd(dayjs(data.data.end));
                setStart(dayjs(data.data.start));
                setTeam(data.data.team);
                setScope(data.data.scope);
            })
            .catch((e) => {
                throw e;
            });
    };

    const handleChange = (event: SelectChangeEvent) => {
        setTeam(Number(event.target.value));
    };

    const setMessage = (mess: string, color: string) => {
        setMess({ mess, color });
    };

    const close = () => {
        setOpen(false);
    };

    const editScope = (index: number) => {
        deleted.push(index);
    };

    const removeElement = (array: any, arr: any) => {
        const newArray = [];
        let i = 0;

        for (let y = 0; i < array.length || y < arr.length; i += 1) {
            if (arr[y] !== i) {
                newArray.push(array[i]);
            } else {
                y += 1;
            }
        }
        return newArray;
    };

    const deleteScope = () => {
        const newValue = removeElement(scope, deleted);
        setScope(newValue);
        setDeleted([]);
    };

    const UpdateMission = async () => {
        setOpen(true);
        if (Team === 0) {
            setMessage('Please choose a team', 'error');
            return;
        }
        if (end.isBefore(dayjs())) {
            setMessage(
                'Please select a date that has not already passed !',
                'error'
            );
            return;
        }
        await axios
            .patch(
                `${config.apiUrl}/mission/${id}`,
                {
                    title: Title,
                    end: end.format('YYYY-MM-DD'),
                    start: start.format('YYYY-MM-DD'),
                    team: Team,
                    scope,
                },
                {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Token ${Cookies.get('Token')}`,
                    },
                }
            )
            .then(() => {
                setMessage('Saved !', 'success');
                navigate('/dashboard');
            })
            .catch((e) => {
                setMessage(e.message, 'error');
            });
    };

    const CancelMission = () => {
        navigate('/dashboard');
    };

    useEffect(() => {
        setId(location.state.missionId);
    }, []);

    useEffect(() => {
        getTeam();
        getMission();
    }, [id]);

    useEffect(() => {
        const keyDownHandler = async (event: any) => {
            if (event.key === 'Enter') {
                UpdateMission();
            }
        };

        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [Title, start, end, Team, scope]);

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
                        <div
                            style={{
                                display: 'flex',
                                width: '100%',
                                justifyContent: 'space-evenly',
                            }}
                        >
                            <p style={{ fontSize: '14px' }}>Select</p>
                            <AiIcons.AiFillDelete
                                onClick={deleteScope}
                                className="scope-action-icons"
                                style={{
                                    color: 'purple',
                                    marginTop: '8px',
                                    height: '30px',
                                }}
                            />
                        </div>
                        <Grid
                            container
                            spacing={1}
                            columns={{ xs: 4, sm: 6, md: 10 }}
                        >
                            {scope.map((item, index) => {
                                return (
                                    <Grid item xs="auto">
                                        <FormControlLabel
                                            value="end"
                                            control={<Checkbox size="small" />}
                                            label={item}
                                            onChange={() => editScope(index)}
                                            labelPlacement="end"
                                        />
                                    </Grid>
                                );
                            })}
                        </Grid>
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
                                            value={miss.id}
                                        >
                                            {miss.name}
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
                                    UpdateMission();
                                }}
                            >
                                Save
                            </button>
                        </div>
                        {open && (
                            <Feedbacks
                                mess={message.mess}
                                close={close}
                                color={message.color}
                                open={open}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
