import React, { useEffect, useState } from 'react';
import './Mission.scss';
import '../Settings/Settings.scss';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    SelectChangeEvent,
    Chip,
    Grid,
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
import { getCookiePart } from '../../crypto-utils';

interface MissionData {
    title: string;
    logo: string;
    description: string;
    start: string;
    end: string;
    scope: string[];
    team?: number;
}
export default function CreateMission() {
    const [Title, setTitle] = useState('');
    const [logo, setLogo] = useState('');
    const [Des, setDes] = useState('');
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
    const [label, setLabel] = useState('');
    const [scope, setScope] = useState<string[]>([]);

    const navigate = useNavigate();

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

    const setScopes = (event: any) => {
        if (event.keyCode === 13) {
            const tab = scope;
            tab.push(event.target.value);
            setScope(tab);
            setLabel('');
        }
    };

    const deleteScope = (id: number) => {
        const newValue = scope.filter((_, index) => index !== id);
        setScope(newValue);
    };

    /* eslint-disable */
    function timeout(delay: number) {
        return new Promise((res) => setTimeout(res, delay));
    }
    /* eslint-enable */

    const handleSubmit = async () => {
        setOpen(true);
        if (
            Team === 0 &&
            getCookiePart(Cookies.get('Token')!, 'role')?.toString() !== '3'
        ) {
            setMessage('Please choose a team', 'error');
            return;
        }
        if (Title.length < 3) {
            setMessage('Please set a correct title name', 'error');
            return;
        }
        if (start.isBefore(dayjs(), 'day') || end.isBefore(dayjs(), 'day')) {
            setMessage(
                'Please select a date that has not already passed !',
                'error'
            );
            return;
        }
        let requestData: MissionData = {
            title: Title,
            logo,
            description: Des,
            start: start.format('YYYY-MM-DD'),
            end: end.format('YYYY-MM-DD'),
            scope,
        };

        if (getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '3') {
            console.log(requestData);
            // Si le rôle est égal à 3, enlève le paramètre team de la requête
            requestData = {
                ...requestData,
                team: undefined,
            };
        } else {
            // Sinon, ajoute le paramètre team à la requête
            requestData = {
                ...requestData,
                team: Team,
            };
        }
        await axios
            .post(`${config.apiUrl}/mission`, requestData, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then(async (data) => {
                setMessage('Created!', 'success');
                await timeout(1000);
                navigate('/accueil');
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

                        {/* Team */}
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

                        {/* Scopes */}
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
                                    handleSubmit();
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
