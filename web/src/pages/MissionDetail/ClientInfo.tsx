import React, { useState, useEffect } from 'react';
import '../Dashboard/Dashboard.scss';
import './MissionDetail.scss';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Grid, Avatar, Stack, CircularProgress } from '@mui/material';
import { FaRegBuilding } from 'react-icons/fa';
import { GiInjustice } from 'react-icons/gi';
import dayjs, { Dayjs } from 'dayjs';
import CreateClientInfo from './CreateClientInfo';
import EditClientInfo from './EditClientInfo';
import config from '../../config';
import DeleteConfirm from '../../component/DeleteConfirm';
import { getCookiePart } from '../../crypto-utils';

interface ClientInfoDetailProps {
    switchToEdit: () => void;
    clientId: number;
}

function ClientInfoDetail({ switchToEdit, clientId }: ClientInfoDetailProps) {
    const [missionId, setMissionId] = useState(0);
    const isPentester =
        getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '1';
    const [Name, setName] = useState('');
    const [logo, setLogo] = useState('');
    const [occupation, setOccupation] = useState('');
    const [Entity, setEntity] = useState('');
    const [Des, setDes] = useState('');
    const [NbEmployee, setNbEmployee] = useState(0);
    const [start, setStart] = useState<Dayjs>(dayjs());
    const [isLoad, setIsLoad] = useState(false);
    const [item, setItem] = useState<{
        id: number;
        title: string;
        type: string;
    }>();
    const [open, setOpen] = useState(false);

    const location = useLocation();

    function getObjectByMission(list: any[], missionValue: number) {
        return list.find(
            (obj: { mission: number }) => obj.mission === missionValue
        );
    }

    const getClientInfo = async () => {
        setIsLoad(true);

        await axios
            .get(`${config.apiUrl}/client-info/${clientId}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then((data) => {
                const obj = data.data;
                console.log(obj);
                setDes(obj.brief_description);
                setEntity(obj.legal_entity);
                setName(obj.company_name);
                setNbEmployee(obj.nb_employees);
                setOccupation(obj.occupation);
            })
            .catch((e) => {
                throw e;
            })
            .finally(() => {
                setIsLoad(false);
            });
    };

    const getMissionInfo = async () => {
        await axios
            .get(`${config.apiUrl}/mission/${missionId}`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then((data) => {
                console.log('mission');
                console.log(data.data);
                setLogo(data.data.logo);
            })
            .catch((e) => {
                throw e;
            });
    };

    const modalClick = () => {
        if (!open) getClientInfo();
        setOpen(!open);
    };

    useEffect(() => {
        setMissionId(location.state.missionId);
    }, []);

    useEffect(() => {
        getClientInfo();
        getMissionInfo();
    }, [missionId]);

    return (
        <>
            <Grid container spacing={2}>
                <Grid
                    item
                    xs={2}
                    sm={3}
                    md={4}
                    display="flex"
                    justifyContent="center"
                >
                    <Avatar src={logo} sx={{ width: 114, height: 114 }}>
                        <FaRegBuilding style={{ width: 50, height: 50 }} />
                    </Avatar>
                </Grid>
                <Grid item xs={6} sm={6} md={8}>
                    <Stack spacing={2}>
                        <p className="title">{Name}</p>
                        <Stack alignItems="center" direction="row" spacing={2}>
                            <GiInjustice size="22px" color="#7C44F3" />
                            <p className="subtitle">{Entity}</p>
                        </Stack>
                        <Stack alignItems="center" direction="row" spacing={2}>
                            <FaRegBuilding size="20px" color="#7C44F3" />
                            <p className="subtitle">{occupation}</p>
                        </Stack>
                        <p className="simple">{Des}</p>
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing="auto"
                        >
                            <Stack alignItems="center" spacing={1}>
                                <p className="data">2</p>
                                <p className="dtitle">Mission(s)</p>
                            </Stack>
                            <Stack alignItems="center" spacing={1}>
                                <p className="data">{NbEmployee}</p>
                                <p className="dtitle">Employees</p>
                            </Stack>
                            <Stack alignItems="center" spacing={1}>
                                <p className="data">
                                    {start.format('YYYY-MM-DD')}
                                </p>
                                <p className="dtitle">Creation</p>
                            </Stack>
                        </Stack>
                    </Stack>
                </Grid>
                {!isPentester && (
                    <Grid item xs={12}>
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={2}
                            width="150px"
                            justifyContent="flex-start"
                        >
                            <button
                                type="submit"
                                onClick={switchToEdit}
                                className="cancel-btn"
                            >
                                Update
                            </button>
                            <button
                                type="submit"
                                onClick={async () => {
                                    setItem({
                                        id: clientId,
                                        title: Name,
                                        type: 'client-info',
                                    });
                                    setOpen(true);
                                }}
                                className="submit-button"
                            >
                                Delete
                            </button>
                        </Stack>
                    </Grid>
                )}
            </Grid>
            {open && <DeleteConfirm item={item!} func={modalClick} />}
        </>
    );
}

export default function ClientInfo() {
    const [currentComponent, setCurrentComponent] = useState('clientInfo');
    const [isLoad, setIsLoad] = useState(false);
    const [clientId, setCId] = useState(0);
    const [missionId, setMissionId] = useState(0);
    const isPentester =
        getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '1';
    const location = useLocation();
    const [isEmpty, setIsEmpty] = useState(true);

    function getObjectByMission(list: any[], missionValue: number) {
        return list.find(
            (item: { mission: number }) => item.mission === missionValue
        );
    }

    const getClientInfo = async () => {
        setIsLoad(true);

        await axios
            .get(`${config.apiUrl}/client-info`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then((data) => {
                let tab = [];
                tab = data.data.results;
                const obj = getObjectByMission(tab, missionId);
                if (obj) {
                    setCId(obj.id);
                    setIsEmpty(false);
                }
                setIsEmpty(true);
            })
            .catch((e) => {
                throw e;
            })
            .finally(() => {
                setIsLoad(false);
            });
    };
    const switchToClientInfo = () => {
        setCurrentComponent('clientInfo');
    };

    const switchToCreateClientInfo = () => {
        setCurrentComponent('createClientInfo');
    };

    const switchToEditClientInfo = () => {
        setCurrentComponent('editClientInfo');
    };

    useEffect(() => {
        setMissionId(location.state.missionId);
    }, []);

    useEffect(() => {
        getClientInfo();
    }, [missionId, currentComponent]);

    // useEffect(() => {
    //     getClientInfo;
    // }, [isEmpty]);

    return (
        <>
            {isLoad ? (
                <CircularProgress color="secondary" />
            ) : (
                <div style={{ padding: 'inherit', margin: 'auto' }}>
                    {clientId === 0 &&
                    currentComponent !== 'createClientInfo' ? (
                        <>
                            {isPentester ? (
                                <h3 style={{ fontFamily: 'Poppins-Regular' }}>
                                    Nothing to show
                                </h3>
                            ) : (
                                <button
                                    type="button"
                                    style={{
                                        width: 'fit-content',
                                    }}
                                    className="mission_create"
                                    onClick={switchToCreateClientInfo}
                                >
                                    Add company information
                                </button>
                            )}{' '}
                        </>
                    ) : (
                        <>
                            {currentComponent === 'clientInfo' && (
                                <ClientInfoDetail
                                    switchToEdit={switchToEditClientInfo}
                                    clientId={clientId}
                                />
                            )}
                            {currentComponent === 'createClientInfo' && (
                                <CreateClientInfo
                                    switchToMain={switchToClientInfo}
                                    clientId={clientId}
                                />
                            )}
                            {currentComponent === 'editClientInfo' && (
                                <EditClientInfo
                                    switchToMain={switchToClientInfo}
                                    clientId={clientId}
                                />
                            )}
                        </>
                    )}
                </div>
            )}{' '}
            {'   '}
        </>
    );
}
