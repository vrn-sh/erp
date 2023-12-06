import { InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';
import Button from '@mui/material/Button';
import formRows from '../../../assets/strings/en/basicpayload.json';

export default function BasicShellcode(props: {
    closeModal: any;
    setLink: any;
    setError: any;
}) {
    const { setLink, closeModal, setError } = props;
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<{
        [key: string]: string;
    }>({
        lport: '4444',
        laddr: '10.0.2.2',
        exploit: 'x64/shell_reverse_tcp',
        arch: 'x64',
        os: 'windows',
        output_type: 'exe',
        method: 'CreateRemoteThread',
        exit_func: '',
        encoder: '',
        exclude_bytes: '',
        entropy: '',
    });

    function submitPayload() {
        if (loading) return;
        setLoading(true);
        const apiKey = 'c9083d45b7a867f26772f3f0a8c104a2';

        axios
            .post(
                `https://voron.djnn.sh/saas/load_shellcode`,
                {
                    lport: formData.lport,
                    laddr: formData.laddr,
                    exploit: encodeURIComponent(formData.exploit),
                    arch: formData.arch,
                    os: formData.os,
                    output_type: formData.output_type,
                    method: formData.method,
                    exit_func: formData.exit_func,
                    encoder: formData.encoder,
                    exclude_bytes: formData.exclude_bytes,
                    enntropy: formData.entropy,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-Api-Key': apiKey,
                    },
                }
            )
            .then((response) => {
                setLink(response.data.url);
            })
            .catch((error) => {
                setError('Unexpected error occurred. Please try again later.');
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

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
                                        disabled={loading}
                                        id={`text-${row.id}`}
                                        variant="outlined"
                                        defaultValue={row.defaultValue}
                                        onChange={(event) => {
                                            setFormData({
                                                ...formData,
                                                [row.id]: event.target.value,
                                            });
                                        }}
                                    />
                                )}
                                {row.type === 'selection' && (
                                    <Select
                                        disabled={loading}
                                        labelId={`select-${row.id}`}
                                        id={row.id}
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
                    onClick={closeModal}
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
