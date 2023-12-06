import React, {useState} from "react";
import {Button, FormControl, InputLabel, MenuItem, Select, Switch, TextField} from "@mui/material";
import formRows from "../../../assets/strings/en/myph.json";
import {styled} from "@mui/material/styles";
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
        [key: string]: any;
    }>({
        output_type: 'exe',
        technique: 'ProcessHollowing',
        encryption: 'chacha20',
        shellcode_file: null,
        obfuscation: 'false',
    });

    async function submitPayload() {
        if (loading)
            return;
        setLoading(true);
    let foo = new FormData();
    foo.append('shellcode_file', formData.shellcode_file, "file");
        axios.post(
            `http://localhost:1337/v2/load_myph?technique=${formData.technique}&encryption=${formData.encryption}`,
            foo,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, shellcode_file: e.target.files?.[0]});
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