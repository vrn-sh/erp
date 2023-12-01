import {InputLabel, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import formRows from "../../../assets/strings/en/basicpayload.json";
import React, {ReactNode, useState} from "react";
import FormControl from '@mui/material/FormControl';

export default function BasicShellcode(props: {
    closeModal: any
}) {

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
        entropy: ''
    });

    async function submitPayload() {

        const apiKey = 'c9083d45b7a867f26772f3f0a8c104a2';
        const apiUrl = `http://voron.djnn.sh/saas/load_shellcode?
        lport=${formData.lport}
        &laddr=${formData.laddr}
        &exploit=${encodeURIComponent(formData.exploit)}
        &arch=${formData.arch}
        &os=${formData.os}
        &output_type=${formData.output_type}
        &method=${formData.method}
        &exit_func=${formData.exit_func}
        &encoder=${formData.encoder}
        &exclude_bytes=${formData.exclude_bytes}
        &entropy=${formData.entropy}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Api-Key': apiKey,
            },
            body: JSON.stringify(formData),
        });

        // Check if the response status is in the success range (e.g., 200-299)
        if (response.status >= 200 && response.status < 300) {
            // Read the response body as a blob
            const fileBlob = await response.blob();

            const url = window.URL.createObjectURL(fileBlob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'file.exe';

            a.click();

            window.URL.revokeObjectURL(url);
        } else {
            // Handle error status code (e.g., display an error message)
            console.error(`API Request Error: Status Code ${response.status}`);
        }
    }

    return (
        <div style={{
            height: '93%'
        }}>
            <div style={{
                overflowX: 'hidden',
                overflowY: 'auto',
                height: '70%'
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
                                        onChange={(event) => {
                                            setFormData({...formData, [row.id]: event.target.value})
                                        }}
                                    />
                                }
                                {row.type === "selection" &&
                                    <Select
                                        labelId={`select-${row.id}`}
                                        id={row.id}
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
                display: 'flex',
                flexDirection: 'row',
                width: '50%',
            }}>
                <button type="button" onClick={submitPayload}>
                    Submit
                </button>
                <button
                    type="submit"
                    className="cancel-btn"
                    onClick={props.closeModal}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}