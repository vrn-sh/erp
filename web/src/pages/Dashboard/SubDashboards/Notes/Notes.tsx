import React, { useState, useEffect } from 'react';
import * as IoIcons from 'react-icons/io';
import axios from 'axios';
import '../../Dashboard.scss';
import {
    Stack,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { IDashboardNotes } from '../../DashBoardNote.type';
import AddNote from './AddNote';
import ViewNote from './ViewNote';
import config from '../../../../config';
import Team from '../../../Team/Team';
import { getCookiePart } from '../../../../crypto-utils';

interface NoteGridProps {
    list: {
        id: number;
        notes: any;
    }[];
    count: number;
    displayed: number;
    viewClick: any;
}

function NoteGrid({ list, count, displayed, viewClick }: NoteGridProps) {
    if (list[count].notes)
        return list[count].notes.map((note: IDashboardNotes, index: number) => {
            return (
                <div className="card" key={`component-${note.id}`}>
                    <div>
                        <h2 className="heading">{note.title}</h2>
                        <p className="card-content">{note.content}</p>
                    </div>
                    <footer>
                        {/* {note.author !== null ? note.author.toString() : 1} */}
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
                        <ViewNote note={note} func={() => viewClick(note.id)} />
                    )}
                </div>
            );
        });
}

function Notes() {
    const [list, setList] = useState<
        {
            id: number;
            notes: any;
        }[]
    >([
        {
            id: 0,
            notes: undefined,
        },
    ]);
    const [modal, setModal] = useState(false);
    const [displayed, setDisplayed] = useState(-1);
    const [idMission, setIsMission] = useState<{ id: number; title: string }[]>(
        [{ id: 0, title: '' }]
    );
    const [max, setMax] = useState(0);
    const isPentester = getCookiePart(Cookies.get('Token')!, 'role') === '1';
    const [count, setCount] = useState(0);
    const navigate = useNavigate();
    const [currentMission, setCurrentMission] = useState(1);

    const changeMission = (state: string) => {
        if (state === 'plus') {
            if (count === max - 1) {
                setCount(0);
            } else {
                setCount(count + 1);
            }
        }
        if (state === 'moins') {
            if (count === 0) {
                setCount(max - 1);
            } else {
                setCount(count - 1);
            }
        }
    };

    const handleChange = (event: SelectChangeEvent) => {
        setCurrentMission(Number(event.target.value));
    };

    const getMission = async () => {
        await axios
            .get(`${config.apiUrl}/mission?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(Cookies.get('Token')!, 'token')}`,
                },
            })
            .then((data) => {
                const tab: {
                    id: number;
                    title: string;
                }[] = [];
                for (let i = 0; i < data.data.results.length; i += 1) {
                    const res = data.data.results[i];
                    const test = {
                        id: res.id,
                        title: res.title,
                    };
                    tab.push(test);
                }
                setIsMission(tab);
            })
            .catch((e) => {
                throw new Error(e);
            });
    };

    const getNotes = async () => {
        setMax(idMission.length);
        await axios
            .get(`${config.apiUrl}/note?page=1`, {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Token ${getCookiePart(Cookies.get('Token')!, 'token')}`,
                },
            })
            .then((e) => {
                const tab = [];
                for (let i = 0; i < idMission.length; i += 1) {
                    const note = e.data.results.filter(
                        (elem: IDashboardNotes) =>
                            elem.mission === idMission[i].id
                    );
                    tab.push({ id: idMission[i].id, notes: note });
                }
                tab.reverse();
                setList(tab);
            })
            .catch((e) => {
                throw new Error(e.message);
            });
    };

    const findMission = () => {
        let find: any = null;

        for (let i = 0; i < idMission.length; i += 1) {
            find = idMission.filter((elem: any) => elem.id === currentMission);
        }
        return find[0];
    };

    const findCount = () => {
        let value = 0;

        for (let i = 0; i < list.length; i += 1) {
            if (list[i].id === currentMission) {
                value = i;
            }
        }
        return value;
    };

    useEffect(() => {
        getMission();
    }, []);

    useEffect(() => {
        getNotes();
    }, [idMission]);

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
            {!idMission ? (
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
                    <FormControl
                        sx={{
                            paddingY: 2,
                            width: '100%',
                            marginTop: '10px',
                        }}
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
                            labelId="Mission"
                            id="Mission-select"
                            value={currentMission.toString()}
                            required
                            label="Mission"
                            onChange={handleChange}
                        >
                            {idMission!.map((current) => {
                                return (
                                    <MenuItem
                                        sx={{
                                            fontFamily: 'Poppins-Regular',
                                            fontSize: '14px',
                                        }}
                                        value={current.id}
                                    >
                                        {current.title}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    {/* </FormControl>
                    <Stack
                        direction="row"
                        justifyContent="start"
                        alignItems="center"
                        spacing={4}
                        ml={2}
                        width="50%"
                    >
                        <div>
                            <h2>{idMission[count].title}</h2>
                        </div>
                        <a
                            onClick={() => changeMission('moins')}
                            onKeyDown={() => changeMission('moins')}
                            tabIndex={0}
                            role="button"
                        >
                            <IoIcons.IoIosArrowBack
                                size="25px"
                                color="rebeccapurple"
                            />
                        </a>
                        <a
                            onClick={() => changeMission('plus')}
                            onKeyDown={() => changeMission('plus')}
                            tabIndex={0}
                            role="button"
                        >
                            <IoIcons.IoIosArrowForward
                                size="25px"
                                color="rebeccapurple"
                            />
                        </a>
                    </Stack> */}
                    <Divider variant="middle" />
                    <div className="container-note cards">
                        {isPentester && (
                            <div className="card">
                                <div>
                                    <h2 className="heading">Add a note</h2>
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
                                mission={findMission()}
                            />
                        )}
                        {findCount() !== 0 && (
                            <NoteGrid
                                list={list}
                                count={findCount()}
                                displayed={displayed}
                                viewClick={viewClick}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Notes;
