import React, { useState, useEffect } from 'react';
import * as IoIcons from 'react-icons/io';
import axios from 'axios';
import '../../Dashboard.scss';
import { Stack, Box, CircularProgress } from '@mui/material';
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import { IDashboardNotes } from '../../DashBoardNote.type';
import AddNote from './AddNote';
import ViewNote from './ViewNote';
import config from '../../../../config';
import Team from '../../../Team/Team';
import { getCookiePart } from '../../../../crypto-utils';

export default function Notes() {
    const [missionId, setMissionId] = useState(0);
    const [missionName, setMissionName] = useState('');
    const location = useLocation();
    const [list, setList] = useState<
        {
            id: number;
            notes: any;
        }[]
    >([]);
    const [modal, setModal] = useState(false);
    const [displayed, setDisplayed] = useState(-1);
    const [idMission, setIsMission] = useState<{ id: number; title: string }[]>(
        [{ id: 0, title: '' }]
    );
    const [max, setMax] = useState(0);
    const isPentester =
        getCookiePart(Cookies.get('Token')!, 'role')?.toString() === '1';
    const [count, setCount] = useState(0);
    const navigate = useNavigate();
    const [isLoad, setIsLoad] = useState(false);

    const getMissionName = async () => {
        setIsLoad(true);

        await axios
            .get(`${config.apiUrl}/mission?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then((data) => {
                for (let i = 0; i < data.data.results.length; i += 1) {
                    const res = data.data.results[i];
                    if (res.id === missionId) setMissionName(res.title);
                }
            })
            .catch((e) => {
                throw new Error(e);
            })
            .finally(() => {
                setIsLoad(false);
            });
    };

    const getNotes = async () => {
        setIsLoad(true);

        await axios
            .get(`${config.apiUrl}/note?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(
                        Cookies.get('Token')!,
                        'token'
                    )}`,
                },
            })
            .then((e) => {
                const tab = [];
                const note = e.data.results.filter(
                    (elem: IDashboardNotes) => elem.mission === missionId
                );
                for (let i = 0; i < note.length; i += 1)
                    tab.push({ id: missionId, notes: note[i] });
                tab.reverse();
                setList(tab);
                console.log('list', tab);
            })
            .catch((e) => {
                throw new Error(e.message);
            })
            .finally(() => {
                setIsLoad(false);
            });
    };

    useEffect(() => {
        setMissionId(location.state.missionId);
    }, []);

    useEffect(() => {
        getMissionName();
        getNotes();
    }, [missionId]);

    const modalClick = () => {
        if (modal) getNotes();
        setModal(!modal);
        getNotes();
    };

    const addMission = () => {
        navigate('/mission/create');
    };

    const viewClick = (idx: number) => {
        if (displayed === -1) {
            setDisplayed(idx);
            getNotes();
        } else {
            setDisplayed(-1);
            getNotes();
        }
    };

    return (
        <div>
            {isLoad ? (
                <Box sx={{ width: '100%', marginY: '5%' }}>
                    <CircularProgress color="secondary" />
                </Box>
            ) : (
                <>
                    {' '}
                    {!missionId ? (
                        <Stack spacing={4}>
                            <h2>Create a mission to add a note</h2>
                            <button
                                style={{
                                    width: 'fit-content',
                                }}
                                type="button"
                                className="mission_create centered"
                                onClick={addMission}
                            >
                                Create a mission
                            </button>
                        </Stack>
                    ) : (
                        <div>
                            <div className="container-note cards">
                                {isPentester && (
                                    <div className="card">
                                        <div>
                                            <h2 className="heading">
                                                Add a note
                                            </h2>
                                        </div>
                                        <footer>
                                            <a
                                                onClick={modalClick}
                                                onKeyDown={modalClick}
                                                tabIndex={0}
                                                role="button"
                                                className="button__link"
                                            >
                                                <IoIcons.IoIosAdd
                                                    size="90px"
                                                    color="rebeccapurple"
                                                />
                                            </a>
                                        </footer>
                                    </div>
                                )}
                                {modal && (
                                    <AddNote
                                        func={modalClick}
                                        missionId={missionId}
                                        missionTitle={missionName}
                                    />
                                )}

                                {list.length && !isPentester ? (
                                    <p>Nothing to show</p>
                                ) : (
                                    list.map((l, index) => {
                                        return (
                                            <div
                                                className="card"
                                                key={`component-${l.id}`}
                                            >
                                                <div>
                                                    <h2 className="heading">
                                                        {l.notes.title}
                                                    </h2>
                                                    <p className="card-content">
                                                        {l.notes.content}
                                                    </p>
                                                </div>
                                                <footer>
                                                    <a
                                                        role="button"
                                                        className="button__link"
                                                        onKeyDown={() => {
                                                            viewClick(index);
                                                        }}
                                                        tabIndex={0}
                                                        onClick={() => {
                                                            viewClick(index);
                                                        }}
                                                        color="rebeccapurple"
                                                    >
                                                        View more
                                                    </a>
                                                </footer>
                                                {displayed === index && (
                                                    <ViewNote
                                                        note={l.notes}
                                                        func={() =>
                                                            viewClick(l.id)
                                                        }
                                                    />
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
