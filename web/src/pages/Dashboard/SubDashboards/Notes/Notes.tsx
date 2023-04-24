import React, { useState, useEffect } from 'react';
import * as IoIcons from 'react-icons/io';
import axios from 'axios';
import '../../Dashboard.scss';
import { Stack, Divider } from '@mui/material';
import Cookies from 'js-cookie';
import { IDashboardNotes } from '../../DashBoardNote.type';
import AddNote from './AddNote';
import ViewNote from './ViewNote';

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
    return list[count].notes.map((note: IDashboardNotes, index: number) => {
        return (
            <div className="card" key={`component-${note.id}`}>
                <div>
                    <h2 className="heading">{note.title}</h2>
                    <p className="card-content">{note.content}</p>
                </div>
                <footer>
                    {note.author !== null ? note.author.toString() : 1}
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
        [
            {
                id: 0,
                title: '',
            },
        ]
    );
    const [max, setMax] = useState(0);
    const [count, setCount] = useState(0);

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

    const getMission = async () => {
        await axios
            .get(`http://localhost:8080/mission?page=1`, {
                headers: {
                    Authorization: `Token ${Cookies.get('Token')}`,
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
            .get('http://localhost:8080/note?page=1', {
                headers: {
                    Authorization: `Token ${Cookies.get('Token')}`,
                },
            })
            .then((e) => {
                const tab = [];
                for (let i = 0; i < idMission.length; i += 1) {
                    const note = e.data.results.filter(
                        (elem) => elem.mission === idMission[i].id
                    );
                    tab.push({ id: idMission[i].id, notes: note });
                }
                setList(tab);
            })
            .catch((e) => {
                throw new Error(e.message);
            });
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
    };

    const viewClick = (idx: number) => {
        if (displayed === -1) {
            setDisplayed(idx);
        } else {
            setDisplayed(-1);
            getNotes();
        }
    };

    return (
        <>
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
                    <IoIcons.IoIosArrowBack size="25px" color="rebeccapurple" />
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
            </Stack>
            <Divider variant="middle" />
            <div className="container-note cards">
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
                {modal && (
                    <AddNote
                        func={modalClick}
                        count={count}
                        idMission={idMission}
                    />
                )}
                {list[count].notes !== undefined && (
                    <NoteGrid
                        list={list}
                        count={count}
                        displayed={displayed}
                        viewClick={viewClick}
                    />
                )}
            </div>
        </>
    );
}

export default Notes;
