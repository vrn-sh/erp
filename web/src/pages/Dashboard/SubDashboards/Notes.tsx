import React, { useState } from 'react';
import * as IoIcons from 'react-icons/io';
import { IDashboardNotes, DashboardNotesList } from '../DashBoardNote.type';
import '../Dashboard.scss';

interface ViewNoteProps {
    note: IDashboardNotes;
    func: React.MouseEventHandler<HTMLAnchorElement>;
}

interface AddNoteProps {
    func: React.MouseEventHandler<HTMLButtonElement>;
}

function ViewNote({ note, func }: ViewNoteProps) {
    return (
        <div className="modal-wrapper">
            <div className="modal-card">
                <div className="modal">
                    <div className="modal-header">
                        <h2 className="heading">{note.title}</h2>
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
                    <p>{note.content}</p>
                </div>
            </div>
        </div>
    );
}

function AddNote({ func }: AddNoteProps) {
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const takeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const takeTitlee = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const takeContent = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    };

    const handleSubmit = (
        evt: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        const note: IDashboardNotes = {
            id: DashboardNotesList.length.toString(),
            title,
            content,
            author: name,
        };
        DashboardNotesList.unshift(note);
        func(evt);
    };

    return (
        <div className="modal-wrapper">
            <div className="modal-card ">
                <div className="modal centered">
                    <h2 className="heading">Add a note</h2>
                    <input
                        type="text"
                        required
                        placeholder="Enter a title"
                        className="popup-input"
                        onChange={takeTitlee}
                        value={title}
                    />
                    <input
                        required
                        type="text"
                        placeholder="Enter your name"
                        className="popup-input"
                        onChange={takeName}
                        value={name}
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
    const [list] = useState(DashboardNotesList as IDashboardNotes[]);
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
            {list.map((notes, index) => {
                return (
                    <div className="card" key={`component-${notes.id}`}>
                        <div>
                            <h2 className="heading">{notes.title}</h2>
                            <p className="card-content">{notes.content}</p>
                        </div>
                        <footer>
                            {notes.author}
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
                                func={() => viewClick(index)}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
