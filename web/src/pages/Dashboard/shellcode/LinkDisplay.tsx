import { FormControl, TextField } from '@mui/material';
import React, { useState } from 'react';

export default function LinkDisplay(props: { link: string; close: any }) {
    const { link, close } = props;
    const [copied, setCopied] = useState(false);

    return (
        <div
            style={{
                height: '50%',
            }}
        >
            <div>
                <h2
                    style={{
                        fontFamily: 'Poppins-Regular',
                    }}
                >
                    Your ShellCode is ready!
                </h2>
                <p
                    style={{
                        fontFamily: 'Poppins-Regular',
                    }}
                >
                    Here a link to download your payload.
                </p>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                    }}
                >
                    <div
                        style={{
                            width: '80%',
                            paddingRight: '1%',
                        }}
                    >
                        <FormControl fullWidth>
                            <TextField
                                id="outlined-read-only-input"
                                defaultValue={link}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </FormControl>
                    </div>
                    <div
                        style={{
                            width: '20%',
                            paddingLeft: '1%',
                        }}
                    >
                        <button
                            type="button"
                            id="copy"
                            onClick={() => {
                                navigator.clipboard.writeText(link).then(() => {
                                    setCopied(true);
                                });
                            }}
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        className="cancel-btn"
                        onClick={close}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
