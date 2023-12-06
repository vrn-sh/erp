import React, { useState } from 'react';
import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
} from '@mui/material';
import axios from 'axios';
import LoadingButton from '@mui/lab/LoadingButton';
import formRows from '../../../assets/strings/en/myph.json';

export default function MyPhShellcode(props: {
    closeModal: any;
    setLink: any;
    setError: any;
}) {
    const { setLink, closeModal, setError } = props;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<{
        [key: string]: any;
    }>({
        build_type: 'exe',
        technique: 'ProcessHollowing',
        encryption: 'chacha20',
        shellcode_file: null,
        obfuscation: 'false',
        file_name: 'payload.exe',
        process: 'cmd.exe',
    });

    async function submitPayload() {
        if (loading) return;
        setLoading(true);
        const foo = new FormData();
        foo.append('shellcode_file', formData.shellcode_file, 'file');
        axios
            .post(
                `http://localhost:1337/v2/load_myph` +
                    `?build_type=${formData.build_type}` +
                    `&encryption=${formData.encryption}` +
                    `&obfuscation=${formData.obfuscation}` +
                    `&file_name=${formData.file_name}` +
                    `&process=${formData.process}` +
                    `&technique=${formData.technique}`,
                foo,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Accept: 'application/json',
                        'X-Api-Key': import.meta.env.VITE_REACT_APP_SAAS_KEY,
                    },
                }
            )
            .then((response) => {
                setLink(response.data.url);
                navigator.clipboard.writeText(response.data.url);
            })
            .catch((error) => {
                setError('Unexpected error occurred. Please try again later.');
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, shellcode_file: e.target.files?.[0] });
    };

    return (
        <div
            style={{
                height: '35em',
            }}
        >
            <div
                style={{
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    height: '93%',
                }}
            >
                {formRows.map((row) => (
                    <div className="form-row">
                        <div style={{ minWidth: '200px' }}>
                            <InputLabel
                                style={{
                                    fontFamily: 'Poppins-Regular',
                                    fontWeight: 700,
                                }}
                            >
                                {row.name}
                            </InputLabel>
                        </div>
                        <div style={{ minWidth: '300px' }}>
                            <FormControl fullWidth>
                                {row.type === 'text' && (
                                    <TextField
                                        id={`text-${row.id}`}
                                        variant="outlined"
                                        defaultValue={row.defaultValue}
                                        disabled={loading}
                                        onChange={(event) => {
                                            setFormData({
                                                ...formData,
                                                [row.id]: event.target.value,
                                            });
                                        }}
                                    />
                                )}
                                {row.type === 'boolean' && (
                                    <Switch
                                        id={`switch-${row.id}`}
                                        checked={formData[row.id] === 'true'}
                                        disabled={loading}
                                        onChange={(event) => {
                                            setFormData({
                                                ...formData,
                                                [row.id]: event.target.checked
                                                    ? 'true'
                                                    : 'false',
                                            });
                                        }}
                                        inputProps={{
                                            'aria-label': 'controlled',
                                        }}
                                    />
                                )}
                                {row.type === 'file' && (
                                    <div className="form-group">
                                        <input
                                            type="file"
                                            id={`file-${row.id}`}
                                            disabled={loading}
                                            className="form-control"
                                            title="Upload your shellcode file"
                                            onChange={(e) =>
                                                handleFileUpload(e)
                                            }
                                        />
                                    </div>
                                )}
                                {row.type === 'selection' && (
                                    <Select
                                        labelId={`select-${row.id}`}
                                        id={row.id}
                                        disabled={loading}
                                        value={formData[row.id]}
                                        onChange={(event) => {
                                            setFormData({
                                                ...formData,
                                                [row.id]: event.target.value,
                                            });
                                        }}
                                    >
                                        {row.selection.map((element) => (
                                            <MenuItem value={element}>
                                                {element}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            </FormControl>
                        </div>
                    </div>
                ))}
            </div>
            <div
                style={{
                    marginTop: '1%',
                    display: 'flex',
                    flexDirection: 'row',
                    width: '50%',
                }}
            >
                <LoadingButton
                    loading={loading}
                    onClick={() => submitPayload()}
                    size="medium"
                    style={{
                        backgroundColor: '#7c44f3',
                        color: '#ffffff',
                        minWidth: '100%',
                        marginRight: '1%',
                    }}
                >
                    {!loading && 'Submit'}
                </LoadingButton>
                <Button
                    onClick={() => closeModal()}
                    size="medium"
                    variant="outlined"
                    style={{
                        backgroundColor: 'rgba(255,255,255,0)',
                        color: '#7c44f3',
                        minWidth: '100%',
                        marginLeft: '1%',
                    }}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}
