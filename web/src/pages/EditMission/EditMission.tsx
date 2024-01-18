import React, { useEffect, useState } from 'react';
import './Mission.scss';
import '../Settings/Settings.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Chip,
} from '@mui/material';
import { LocalizationProvider, DateField } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import Cookies from 'js-cookie';
import Feedbacks from '../../component/Feedback';
import TopBar from '../../component/SideBar/TopBar';
import SideBar from '../../component/SideBar/SideBar';
import config from '../../config';
import { getCookiePart } from '../../crypto-utils';

export default function EditMission() {
    const [Title, setTitle] = useState('');
    const [logo, setLogo] = useState('');
    const [Des, setDes] = useState('');
    const [Team, setTeam] = useState(0);
    const [start, setStart] = useState<Dayjs>(dayjs());
    const [end, setEnd] = useState<Dayjs>(dayjs());
    const [open, setOpen] = useState(false);
    const [id, setId] = useState(0);
    const location = useLocation();
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    const [teamList, setTeamList] = useState<{ id: number; name: string }[]>([
        { id: 0, name: '' },
    ]);
    const navigate = useNavigate();
    const [label, setLabel] = useState('');
    const [scope, setScope] = useState<string[]>([]);

    const getTeam = async () => {
        await axios
            .get(`${config.apiUrl}/team?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
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
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then((data) => {
                setTitle(data.data.title);
                setEnd(dayjs(data.data.end));
                setStart(dayjs(data.data.start));
                setTeam(data.data.team);
                setScope(data.data.scope);
                setDes(data.data.description);
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

    const deleteScope = (scope_id: number) => {
        const newValue = scope.filter((_, index) => index !== scope_id);
        setScope(newValue);
    };

    const setScopes = (event: any) => {
        if (event.keyCode === 13) {
            const tab = scope;
            tab.push(event.target.value);
            setScope(tab);
            setLabel('');
        }
    };

    const UpdateMission = async () => {
        setOpen(true);
        if (
            Team === 0 &&
            getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '3'
        ) {
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
                    logo,
                    description: Des,
                    end: end.format('YYYY-MM-DD'),
                    start: start.format('YYYY-MM-DD'),
                    team: Team,
                    scope,
                },
                {
                    headers: {
                        'Content-type': 'application/json',
                        Authorization: `Token ${getCookiePart(
                            Cookies.get('Token')!,
                            'token'
                        )}`,
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

    const convertImageToBase64 = (file: File) => {
        return new Promise<string | ArrayBuffer | null>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const base64Image = await convertImageToBase64(file);
            if (typeof base64Image === 'string') {
                setLogo(base64Image);
            } else {
                console.error('La conversion en base64 a échoué.');
            }
        }
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
                <div className="page-info" />
                <div className="edit-container">
                    <div
                        style={{
                            margin: '20px',
                            textAlign: 'left',
                            width: '30%',
                        }}
                    >
                        <h3 style={{ margin: '0px' }}>Edit Mission</h3>
                        <p style={{ margin: '0px', fontSize: '17px' }}>
                            Change the mission's setting and details
                        </p>
                    </div>
                    <div className="edit-form">
                        <TextField
                            fullWidth
                            label="Title"
                            value={Title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                            }}
                            style={{ padding: '.8rem' }}
                            size="small"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={Des}
                            onChange={(e) => {
                                setDes(e.target.value);
                            }}
                            style={{ padding: '.8rem' }}
                            size="small"
                        />

                        <FormControl
                            style={{ padding: '.8rem' }}
                            fullWidth
                            size="small"
                        >
                            <InputLabel
                                sx={{
                                    fontFamily: 'Poppins-Regular',
                                    fontSize: '14px',
                                    paddingLeft: '10px',
                                }}
                            >
                                Team
                            </InputLabel>
                            <Select
                                required
                                labelId="Team"
                                label="Team"
                                id="Team-select"
                                value={Team.toString()}
                                onChange={handleChange}
                                disabled={
                                    getCookiePart(
                                        Cookies.get('Token')!,
                                        'role'
                                    )?.toString() === '3'
                                } // Désactive la sélection pour le rôle '3'
                            >
                                {teamList!.map((team) => {
                                    return (
                                        <MenuItem
                                            key={team.id}
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

                        {/* DatePicker */}
                        <div style={{ padding: '.5rem' }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateField
                                    label="Start date"
                                    value={start}
                                    sx={{ padding: '6px', width: '50%' }}
                                    onChange={(newValue: any) =>
                                        setStart(newValue)
                                    }
                                    format="DD-MM-YYYY"
                                />
                            </LocalizationProvider>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateField
                                    label="End date"
                                    value={end}
                                    sx={{ padding: '6px', width: '50%' }}
                                    onChange={(newValue: any) =>
                                        setEnd(newValue)
                                    }
                                    format="DD-MM-YYYY"
                                />
                            </LocalizationProvider>
                        </div>

                        {/* Scope */}
                        <div
                            style={{ padding: '.8rem', paddingTop: '0' }}
                            className="form-group"
                        >
                            <label
                                htmlFor="scopes"
                                style={{ padding: 0, margin: 0, color: 'gray' }}
                            >
                                Scopes
                            </label>
                            <Grid
                                container
                                spacing={{ xs: 2, md: 3 }}
                                columns={{ xs: 4, sm: 8, md: 12 }}
                                style={{ paddingBottom: '.5rem' }}
                            >
                                {scope.map((item, index) => {
                                    return (
                                        <Grid item xs="auto">
                                            <Chip
                                                sx={{
                                                    fontFamily:
                                                        'Poppins-Regular',
                                                    fontSize: '14px',
                                                }}
                                                label={item}
                                                onDelete={() => {
                                                    deleteScope(index);
                                                }}
                                            />
                                        </Grid>
                                    );
                                })}
                            </Grid>
                            <input
                                id="input-scope"
                                type="text"
                                required
                                className="form-control"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                onKeyDown={setScopes}
                                placeholder="Enter an url, press Enter to add. Ex:https://www.epitech.eu"
                            />
                        </div>

                        {/* Logo */}
                        <div
                            className="form-group"
                            style={{ padding: '.8rem', paddingTop: '0' }}
                        >
                            <label
                                htmlFor="logo"
                                style={{ padding: 0, margin: 0, color: 'gray' }}
                            >
                                Logo
                            </label>
                            <input
                                type="file"
                                id="logo"
                                accept="image/*"
                                className="form-control"
                                placeholder="Upload a logo for the mission"
                                onChange={(e) => handleFileUpload(e)}
                            />
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                width: '150px',
                                justifyContent: 'space-between',
                                paddingLeft: '.8rem',
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
