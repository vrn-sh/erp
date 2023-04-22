import React, { useState, useEffect } from 'react';
import * as IoIcons from 'react-icons/io';
import axios from 'axios';
import '../Dashboard.scss';
import config from '../../../config';
import {
    Alert,
    Snackbar,
    SelectChangeEvent,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    Stack,
    InputBase,
} from '@mui/material';
import { PrimaryButton, SecondaryButton } from '../../../component/Button';
import { IDashboardNotes } from '../DashBoardNote.type';

interface ViewNoteProps {
    note: IDashboardNotes;
    func: React.MouseEventHandler<HTMLAnchorElement>;
}

interface AddNoteProps {
    func: React.MouseEventHandler<HTMLButtonElement>;
}

const name: { id: number; title: string }[] = [];

const getMission = async () => {
    try {
        await axios
            .get(`http://localhost:8080/mission?page=1`)
            .then((data) => {
                for (var i in data.data.results) {
                    var test = {
                        id: i.id,
                        title: i.title,
                    };
                    name.push(test);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    } catch (error) {
        console.log(error);
    }
};

function ViewNote({ note, func }: ViewNoteProps) {
    const [open, setOpen] = useState(false);
    const [isEdit, SetisEdit] = useState(false);
    const [content, setContent] = useState(note.content);
    
    const handleClick = () => {
        setOpen(true);
    };

    const takeContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = async (
        evt: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {

        if (isEdit) {
            SetisEdit(!isEdit);
            return;
        }
        try {
            await axios
                .delete(`http://localhost:8080/note/${note.id}`)
                .then(() => {
                    handleClick();
                    func(evt);
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
                                Note deleted !
                            </Alert>
                        </Snackbar>
                    );
                })
                .catch((e) => {
                    console.log(note.id);
                    handleClick();
                    return (
                        <Snackbar
                            open={open}
                            autoHideDuration={1000}
                            onClose={handleClose}
                        >
                            <Alert
                                onClose={handleClose}
                                severity="error"
                                sx={{ width: '100%' }}
                            >
                                {e.message}
                            </Alert>
                        </Snackbar>
                    );
                });
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = async (
        evt: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {

        if (isEdit !== true) {
            SetisEdit(!isEdit);
            return;
        }

        try {
            await axios
                .put(`http://localhost:8080/note/${note.id}`, {
                    title : note.title,
                    content,
                    mission: note.mission,
                })
                .then(() => {
                    handleClick();
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
                                Successfuly edit!
                            </Alert>
                        </Snackbar>
                    );
                })
                .catch((e) => {
                    console.log(note.id);
                    handleClick();
                    return (
                        <Snackbar
                            open={open}
                            autoHideDuration={1000}
                            onClose={handleClose}
                        >
                            <Alert
                                onClose={handleClose}
                                severity="error"
                                sx={{ width: '100%' }}
                            >
                                {e.message}
                            </Alert>
                        </Snackbar>
                    );
                });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="modal-wrapper">
            <div className="modal-card">
                <div className="modal">
                    <div className="modal-header">
                        <h2 className="heading">Coucou</h2>
                        <a
                            onClick={func}
                            onKeyDown={() => func}
                            role="button"
                            className="close"
                            aria-label="close this modal"
                            tabIndex={0}
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
                            </svg>
                        </a>
                    </div>
                    {isEdit && (
                        <textarea
                        rows={5}
                        required
                        className="popup-textarea modal-body"
                        onChange={takeContent}
                        value={content}
                        />
                    )}
                    {!isEdit && (
                        <p>{note.content}</p>
                    )}
                    <Stack direction="row" justifyContent={"center"} mt={3} spacing={4}>
                        <SecondaryButton variant="outlined" onClick={handleDelete}>{isEdit ? "Cancel" : "Delete"}</SecondaryButton>
                        <PrimaryButton variant="contained" color="primary" onClick={handleEdit}>{isEdit ? "Save" : "Edit"}</PrimaryButton>
                    </Stack>
                </div>
            </div>
        </div>
    );
}

function AddNote({ func }: AddNoteProps) {
    const [mission, setMission] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [open, setOpen] = useState(false);

    const takeTitlee = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const takeContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    };

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleChange = (event: SelectChangeEvent) => {
        setMission(event.target.value);
    };

    const handleSubmit = async (
        evt: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        try {
            await axios
                .post(`http://localhost:8080/note`, {
                    title,
                    content,
                    mission: 1,
                })
                .then(() => {
                    handleClick();
                    func(evt);
                    // handleClick();
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
                    handleClick();
                    return (
                        <Snackbar
                            open={open}
                            autoHideDuration={1000}
                            onClose={handleClose}
                        >
                            <Alert
                                onClose={handleClose}
                                severity="error"
                                sx={{ width: '100%' }}
                            >
                                {e.message}
                            </Alert>
                        </Snackbar>
                    );
                });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="modal-wrapper">
            <div className="modal-card ">
                <div className="modal centered">
                    <h2 className="heading">Add a note</h2>
                    <FormControl sx={{paddingY: 2, width: "80%" }} variant="standard" size="small">
                        <InputLabel id="Mission" sx={{fontFamily: 'Poppins-Regular', fontSize: "14px"}}>
                            Mission
                        </InputLabel>
                        <Select
                            labelId="Mission"
                            id="Mission-select"
                            value={mission}
                            label="Mission"
                            input={<InputBase className='popup-input'/>}
                            onChange={handleChange}
                        >
                            {name.map((miss) => {
                                return (
                                    <MenuItem sx={{fontFamily: 'Poppins-Regular', fontSize: "14px"}} value={miss.id}>
                                        {miss.title}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <input
                        type="text"
                        required
                        placeholder="Enter a title"
                        className="popup-input"
                        onChange={takeTitlee}
                        value={title}
                    />
                    <textarea
                        rows={8}
                        required
                        placeholder="Put your note here"
                        className="popup-textarea"
                        onChange={takeContent}
                        value={content}
                    />
                    <div className="btn-block">
                        <button
                            type="button"
                            className="btn cancel"
                            onClick={func}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn submit"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Notes() {
    const [list, setList] = useState<IDashboardNotes[] | undefined>([]);
    const [modal, setModal] = useState(false);
    const [displayed, setDisplayed] = useState(-1);

    const modalClick = () => {
        setModal(!modal);
    };

    const viewClick = (idx: number) => {
        if (displayed === -1) {
            setDisplayed(idx);
        } else {
            setDisplayed(-1);
        }
    };

    const getNotes = async () => {
        try {
            await axios
                .get('http://localhost:8080/note')
                .then((e) => {
                    setList(e.data.results);
                })
                .catch((e) => {
                    console.log(e.message);
                });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getNotes();
        getMission();
    }, []);

    return (
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
                        <IoIcons.IoIosAdd size="90px" color="rebeccapurple" />
                    </a>
                </footer>
            </div>
            {modal && <AddNote func={modalClick} />}
            {list!.map((notes, index) => {
                return (
                    <div className="card" key={`component-${notes.id}`}>
                        <div>
                            <h2 className="heading">{notes.title}</h2>
                            <p className="card-content">{notes.content}</p>
                        </div>
                        <footer>
                            1
                            {/* {notes.author.toString()} */}
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
                                note={notes}
                                func={() => viewClick(notes.id)}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
