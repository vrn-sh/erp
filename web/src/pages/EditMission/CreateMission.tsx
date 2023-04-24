import React, { useEffect, useState } from 'react';
import './Mission.scss';
import '../Settings/Settings.scss';
import SideBar from '../../component/SideBar/SideBar';
import TopBar from '../../component/SideBar/TopBar';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Snackbar,
    Alert,
} from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';

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

const CreateM = () => {
    // appel de l'API pour supprimer le groupe
};
const CancelMission = () => {
    // appel de l'API pour supprimer le groupe
};

export default function CreateMission() {
    const [Title, setTitle] = useState('');
    const [Team, setTeam] = useState('');
    const [start, setStart] = React.useState<Dayjs | null>(dayjs());
    const [end, setEnd] = React.useState<Dayjs | null>(dayjs());
    const [open, setOpen] = useState(false);
    let teamList: number[] = [0, 1, 2, 3];

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

    const handleChange = (event: SelectChangeEvent) => {
        setTeam(event.target.value);
    };

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async () => {
        try {
            await axios
                .post(`http://localhost:8080/mission`, {
                    Title,
                    start,
                    end,
                    Team
                })
                .then(() => {
                    handleClick
                    return (
                        <Snackbar
                            open={open}
                            autoHideDuration={1000}
                            onClose={handleClose}
                        >
                            <Alert
                                onClose={handleClose}
                                severity="success"
                                sx={{ width: '100%' }}
                            >
                                Successfuly add!
                            </Alert>
                        </Snackbar>
                    );
                })
                .catch((e) => {
                    console.log(e.message);
                });
        } catch (error) {
            console.log(error);
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
                                value={Team}
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
                        <LocalizationProvider spacing={4} dateAdapter={AdapterDayjs}>
                            <DateField
                                label="Start date"
                                value={start}
                                required
                                onChange={(newValue: any) => setStart(newValue)}
                            />
                            <DateField
                                label="End date"
                                value={end}
                                required
                                onChange={(newValue: any) => setEnd(newValue)}
                            />
                        </LocalizationProvider>
                        <br />
                        <div style={{ display: 'flex', width: '150px' }}>
                            <button
                                type="submit"
                                className="submit-button"
                                onClick={() => CreateM()}
                            >
                                Save
                            </button>
                            <button
                                type="submit"
                                className="cancel-btn"
                                onClick={() => handleSubmit()}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
