import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../EditMission/Mission.scss';
import '../Settings/Settings.scss';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    OutlinedInput,
    Box,
    Chip,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import Feedbacks from '../../component/Feedback';
import TopBar from '../../component/SideBar/TopBar';
import SideBar from '../../component/SideBar/SideBar';
import config from '../../config';
import Input from '../../component/Input';
import { getCookiePart } from '../../crypto-utils';

const ITEM_HEIGHT = 55;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function CreateTeam() {
    const [Title, setTitle] = useState('');
    const [Team, setTeam] = useState<string[]>([]);
    const [open, setOpen] = useState(false);
    const [message, setMess] = useState<{ mess: string; color: string }>({
        mess: '',
        color: 'success',
    });
    const [penList, setListPen] = useState<{ id: number; name: string }[]>([]); // recupère la liste des pentester dispo
    const navigate = useNavigate();
    const location = useLocation();
    const [id, setId] = useState(0);
    const [personName, setPersonName] = React.useState<string[]>([]); // reécupère la liste des pen à mettre dans la team
    const [manager, setManager] = useState(''); // reécupère la liste des pen à mettre dans la team
    const [managerList, setManagerList] = useState<
        { id: number; name: string }[]
    >([]);

    const handleChange = (event: SelectChangeEvent) => {
        const {
            target: { value },
        } = event;
        setPersonName(typeof value === 'string' ? value.split(',') : value);
        const tab = [];
        for (let i = 0; i < value.length; i += 1) {
            const note = penList.filter((elem) => elem.id === Number(value[i]));
            tab.push(note[0].name);
        }
        setTeam(tab);
    };

    const handleChangeMana = (event: SelectChangeEvent) => {
        setManager(event.target.value as string);
    };

    const getManager = async () => {
        await axios
            .get(`${config.apiUrl}/manager?page=1`, {
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
                for (let i = 0; i < data.data.results.length; i += 1) {
                    tab.push({
                        id: data.data.results[i].id,
                        name: data.data.results[i].auth.username,
                    });
                }
                setManagerList(tab);
            })
            .catch((e) => {
                throw e;
            });
    };

    const getPentester = async () => {
        let result: {
            id: any;
            name: any;
        }[] = [];
        await axios
            .get(`${config.apiUrl}/pentester?page=1`, {
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
                for (let i = 0; i < data.data.results.length; i += 1) {
                    tab.push({
                        id: data.data.results[i].id,
                        name: data.data.results[i].auth.username,
                    });
                }
                setListPen(tab);
                result = tab;
            })
            .catch((e) => {
                throw e;
            });
        return result;
    };

    const getTeamMember = async () => {
        if (id === 0) {
            return;
        }
        await axios
            .get(`${config.apiUrl}/team/${id}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then(async (data) => {
                const tab: string[] = [];
                for (let i = 0; i < data.data.members.length; i += 1) {
                    tab.push(data.data.members[i].id);
                }
                setPersonName(tab);
                const pentesterList = await getPentester();

                setManager(data.data.leader.id as string);
                setTitle(data.data.name);
                const arr = [];
                for (let i = 0; i < tab.length; i += 1) {
                    const note = pentesterList.filter(
                        (elem) => elem.id === Number(tab[i])
                    );
                    arr.push(note[0].name);
                }
                setTeam(arr);
            })
            .catch((e) => {
                throw e;
            });
    };

    const close = () => {
        setOpen(false);
    };

    const setMessage = (mess: string, color: string) => {
        setMess({ mess, color });
    };

    const CancelTeam = () => {
        navigate('/team');
    };

    const handleSubmit = async () => {
        setOpen(true);
        if (!personName.length) {
            setMessage('Please select a team member', 'error');
            return;
        }
        await axios
            .patch(
                `${config.apiUrl}/team/${id}`,
                {
                    name: Title,
                    team: personName,
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
                setMessage('Edited !', 'success');
            })
            .catch((e) => {
                setMessage(e.message, 'error');
            });
    };

    useEffect(() => {
        const keyDownHandler = async (event: any) => {
            if (event.key === 'Enter') {
                handleSubmit();
            }
        };

        document.addEventListener('keydown', keyDownHandler);
        return () => {
            document.removeEventListener('keydown', keyDownHandler);
        };
    }, [Title, personName]);

    useEffect(() => {
        setId(location.state.teamId);
    }, []);

    useEffect(() => {
        getTeamMember();
        getManager();
    }, [id]);

    useEffect(() => {
        getPentester();
    }, [Team]);

    return (
        <div className="dashboard">
            <SideBar />
            <div className="dashboard_container">
                <TopBar />
                <div className="page-info">
                    <div>
                        <h2 style={{ fontSize: '28px', fontFamily: 'Arial' }}>
                            Edit Team
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
                        <h3 style={{ margin: '0px' }}>Edit Team</h3>
                        <p style={{ margin: '0px', fontSize: '17px' }}>
                            You can edit your team here
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
                            sx={{
                                marginTop: '15px',
                            }}
                            fullWidth
                        >
                            <InputLabel id="manager-select-label">
                                Manager
                            </InputLabel>
                            <Select
                                labelId="manager-select-label"
                                id="select"
                                value={manager}
                                label="Manager"
                                readOnly
                                onChange={handleChangeMana}
                            >
                                {managerList.map((name) => (
                                    <MenuItem
                                        sx={{
                                            fontFamily: 'Poppins-Regular',
                                            fontSize: '14px',
                                        }}
                                        key={name.id}
                                        value={name.id}
                                    >
                                        {name.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                                Member
                            </InputLabel>
                            <Select
                                labelId="demo-multiple-chip-label"
                                id="demo-multiple-chip"
                                multiple
                                value={personName as unknown as string}
                                onChange={handleChange}
                                input={
                                    <OutlinedInput
                                        id="select-multiple-chip"
                                        label="Chip"
                                    />
                                }
                                renderValue={() => (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 0.5,
                                        }}
                                    >
                                        {Team?.map((value) => (
                                            <Chip
                                                key={value}
                                                variant="outlined"
                                                color="secondary"
                                                label={value}
                                            />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {penList.map((name) => (
                                    <MenuItem
                                        sx={{
                                            fontFamily: 'Poppins-Regular',
                                            fontSize: '14px',
                                        }}
                                        key={name.id}
                                        value={name.id}
                                    >
                                        {name.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
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
                                onClick={CancelTeam}
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
