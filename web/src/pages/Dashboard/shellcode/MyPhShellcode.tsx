import React, {ReactNode, useState} from "react";
import {Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Switch, TextField} from "@mui/material";
import formRows from "../../../assets/strings/en/myph.json";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {styled} from "@mui/material/styles";
import Input from "../../../component/Input";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function MyPhShellcode(props: {
    closeModal: any
    setLink: any
}) {
    const apiKey = 'c9083d45b7a867f26772f3f0a8c104a2';
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<{
        [key: string]: string;
    }>({
        output_type: 'exe',
        technique: 'ProcessHollowing',
        encryption: 'chacha20',
        shellcode_file: '',
        obfuscation: 'false'
    });

    async function submitPayload() {
        if (loading)
            return;
        setLoading(true);
        axios.post(
            `http://localhost:1337/v2/load_myph`,
            {
                technique: formData.technique,
                encryption: formData.encryption,
                shellcode_file: formData.shellcode_file
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Api-Key': apiKey,
                }
            }
        ).then((response) => {
            props.setLink(response.data.url);
            navigator.clipboard.writeText(response.data.url);
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    const convertImageToBase64 = (file: File) => {
        return new Promise<string | ArrayBuffer | null>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log(file);
        if (file)
            setFormData({...formData, shellcode_file: await convertImageToBase64(file) as string});

        /*const file = e.target.files?.[0];

        if (file) {
            const base64 = await convertImageToBase64(file);
            if (typeof base64 === 'string') {
                setFormData({...formData, shellcode_file: base64});
            } else {
                console.error('La conversion en base64 a échoué.');
            }
        }*/
    };

    return (
        <div style={{
            height: '35em'
        }}>
            <div style={{
                overflowX: 'hidden',
                overflowY: 'auto',
                height: '93%'
            }}>
                {formRows.map((row) => (
                    <div className="form-row">
                        <div style={{minWidth: '200px'}}>
                            <InputLabel
                                style={{
                                    fontFamily: 'Poppins-Regular',
                                    fontWeight: 700
                                }}
                            >{row.name}</InputLabel>
                        </div>
                        <div style={{minWidth: '300px'}}>
                            <FormControl fullWidth>
                                {row.type === "text" &&
                                    <TextField
                                        id={`text-${row.id}`}
                                        variant="outlined"
                                        defaultValue={row.defaultValue}
                                        disabled={loading}
                                        onChange={(event) => {
                                            setFormData({...formData, [row.id]: event.target.value})
                                        }}
                                    />
                                }
                                {row.type === "boolean" &&
                                    <Switch
                                        id={`switch-${row.id}`}
                                        checked={formData[row.id] === "true"}
                                        disabled={loading}
                                        onChange={(event) => {
                                            setFormData({
                                                ...formData,
                                                [row.id]: event.target.checked ? "true" : "false"
                                            })
                                        }}
                                        inputProps={{'aria-label': 'controlled'}}
                                    />
                                }
                                {row.type === "file" &&
                                    <div className="form-group">
                                        <input
                                            type="file"
                                            id={`file-${row.id}`}
                                            disabled={loading}
                                            className="form-control"
                                            title="Upload your shellcode file"
                                            onChange={(e) => handleFileUpload(e)}
                                        />
                                    </div>
                                }
                                {row.type === "selection" &&
                                    <Select
                                        labelId={`select-${row.id}`}
                                        id={row.id}
                                        disabled={loading}
                                        value={formData[row.id]}
                                        onChange={(event) => {
                                            setFormData({...formData, [row.id]: event.target.value})
                                        }}
                                    >
                                        {row.selection.map((element) => (
                                            <MenuItem value={element}>{element}</MenuItem>
                                        ))}
                                    </Select>
                                }
                            </FormControl>
                        </div>
                    </div>
                ))}
            </div>
            <div style={{
                marginTop: '1%',
                display: 'flex',
                flexDirection: 'row',
                width: '50%',
            }}>
                <LoadingButton
                    loading={loading}
                    onClick={submitPayload}
                    size="medium"
                    style={{
                        backgroundColor: '#7c44f3',
                        color: '#ffffff',
                        minWidth: '100%',
                        marginRight: '1%'
                    }}
                >
                    {!loading && "Submit"}
                </LoadingButton>
                <Button
                    onClick={props.closeModal}
                    size="medium"
                    variant="outlined"
                    style={{
                        backgroundColor: 'rgba(255,255,255,0)',
                        color: '#7c44f3',
                        minWidth: '100%',
                        marginLeft: '1%'
                    }}
                >
                    Cancel
                </Button>
            </div>
        </div>
    )
}