import React, { useState } from 'react';
import * as IoIcons from 'react-icons/io';
import { IDashboardNotes, DashboardNotesList } from '../DashBoardNote.type';
import '../Dashboard.scss';
// import '../../../component/SideBar/SideBar.scss';

function ViewNote(props: {
    note: IDashboardNotes;
    func: React.MouseEventHandler<HTMLAnchorElement>;
}) {
    return (
        <div className="modal-wrapper">
            <div className="modal-card">
            <div className='modal'>
                <div className="modal-header">
                         <h2 className="heading">{props.note.title}</h2>
                         <a
                            onClick={props.func}
                            role="button"
                            className="close"
                            aria-label="close this modal"
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
                            </svg>
                        </a>
                    </div>
                    <p>{props.note.content}</p>
                </div>
                <a className="outside-trigger"></a>
            </div>
        </div>
    );
}

function AddNote(props: { func: React.MouseEventHandler<HTMLButtonElement> }) {
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const takeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const takeTitlee = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value);
    };

    const takeContent = (event: React.ChangeEvent<HTMLInputElement>) => {
        setContent(event.target.value);
    };

    const handleSubmit = () => {
        const note: IDashboardNotes = {
            id: DashboardNotesList.length.toString(),
            title: title,
            content: content,
            author: name,
        };
        console.log(note);
        DashboardNotesList.unshift(note);
        console.log(DashboardNotesList);
        props.func();
    };

    return (
        <div className="modal-wrapper">
            <div className="modal-card ">
                <div className='modal centered'>
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
                    // onChange={takeContent}
                    value={content}
                />
                <div className="btn-block">
                    <button
                        type="button"
                        className="btn cancel"
                        onClick={props.func}
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
    const [isView, setisView] = useState(false);

    const modalClick = () => {
        setModal(!modal);
    };

    const viewClick = () => {
        setisView(!isView);
    };

    return (
        <>
            <div className="container-note cards">
                <div className="card">
                    <div>
                        <h2 className="heading">Add a note</h2>
                    </div>
                    <footer>
                        <a
                            onClick={modalClick}
                            role="button"
                            className="button__link"
                        >
                            <IoIcons.IoIosAdd
                                size={'90px'}
                                color="rebeccapurple"
                            />
                        </a>
                    </footer>
                </div>
                {modal && <AddNote func={modalClick} />}
                {list.map((notes, index) => {
                    return (
                        <div className="card" key={notes.id} id={index.toString()}>
                            <div>
                                <h2 className="heading">{notes.title}</h2>
                                <p className="card-content">{notes.content}</p>
                            </div>
                            <footer>
                                {notes.author}
                                <a
                                    role="button"
                                    className="button__link"
                                    onClick={viewClick}
                                    color='rebeccapurple'
                                >
                                    View more
                                </a>
                            </footer>
                            {isView && (
                                <ViewNote note={notes} func={viewClick} />
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
