import Modal from 'react-modal';
import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import {
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Alert,
} from '@mui/material';
import BasicShellcode from './BasicShellcode';
import MyPhShellcode from './MyPhShellcode';
import LinkDisplay from './LinkDisplay';
import {
    MyPhDocumentationContent,
    BasicShellcodeDocumentationContent,
} from './Documentation';

export default function PayLoadForm(props: {
    isModalOpen: boolean;
    closeModal: any;
}) {
    const { isModalOpen, closeModal } = props;
    const [payloadType, setPayloadType] = useState('myph');
    const [link, setLink] = useState('');
    const [error, setError] = useState('');
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);

    const openNewModal = () => {
        setIsNewModalOpen(true);
    };

    const closeNewModal = () => {
        setIsNewModalOpen(false);
    };
    const handleChange = (event: SelectChangeEvent) => {
        setError('');
        setPayloadType(event.target.value as string);
    };

    function close() {
        setLink('');
        setError('');
        closeModal();
    }

    return (
        <form
            style={{
                display: isModalOpen ? 'block' : 'none',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => close()}
                contentLabel="General Payload Modal"
                style={{
                    content: {
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        maxWidth: '300em',
                        left: '50%',
                        transform: 'translate(-50%, 0)',
                        overflow: 'hidden',
                        inset: '40px 40px 3rem 50%',
                    },
                }}
            >
                {link !== '' ? (
                    <LinkDisplay link={link} close={() => close()} />
                ) : (
                    <>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <h2>General payload</h2>
                            <button
                                type="button"
                                className="btn"
                                onClick={openNewModal}
                            >
                                Documentation{' '}
                                {payloadType === 'myph'
                                    ? 'MyPH'
                                    : 'Basic Shellcode'}
                            </button>
                            <Modal
                                isOpen={isNewModalOpen}
                                onRequestClose={closeNewModal}
                                contentLabel="Documentation Modal"
                                style={{
                                    content: {
                                        border: '1px solid #ccc',
                                        borderRadius: '10px',
                                        position: 'absolute',
                                        overflow: 'scroll',
                                        fontFamily: 'Poppins-Medium',
                                        maxWidth: '300em',
                                        left: '50%',
                                        transform: 'translate(-50%, 0)',
                                        // overflow: 'hidden',
                                        inset: '10vh 10vh 8rem 50%',
                                    },
                                }}
                            >
                                {payloadType === 'myph' && (
                                    <MyPhDocumentationContent />
                                )}
                                {payloadType === 'basicshellcode' && (
                                    <BasicShellcodeDocumentationContent />
                                )}
                                <button
                                    type="button"
                                    onClick={closeNewModal}
                                    style={{
                                        marginTop: '2rem',
                                        position: 'sticky',
                                        bottom: 10,
                                    }}
                                >
                                    Close
                                </button>
                            </Modal>
                        </div>
                        <InputLabel
                            style={{
                                fontFamily: 'Poppins-Regular',
                                fontWeight: 900,
                            }}
                        >
                            ShellCode Type
                        </InputLabel>
                        <FormControl fullWidth style={{ paddingBottom: '1em' }}>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={payloadType}
                                onChange={(event) => handleChange(event)}
                            >
                                <MenuItem value="myph">MyPH</MenuItem>
                                <MenuItem value="basicshellcode">
                                    Basic Shellcode
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <div style={{ marginBottom: '1em' }}>
                            <h3
                                style={{
                                    fontFamily: 'Poppins-Regular',
                                    fontWeight: 900,
                                }}
                            >
                                Configuration
                            </h3>
                        </div>
                        {error && (
                            <Alert
                                severity="error"
                                style={{
                                    marginBottom: '1%',
                                }}
                            >
                                {error}
                            </Alert>
                        )}
                        {payloadType === 'myph' && (
                            <MyPhShellcode
                                closeModal={() => close()}
                                setLink={setLink}
                                setError={setError}
                            />
                        )}
                        {payloadType === 'basicshellcode' && (
                            <BasicShellcode
                                closeModal={() => close()}
                                setLink={setLink}
                                setError={setError}
                            />
                        )}
                    </>
                )}
            </Modal>
        </form>
    );
}
