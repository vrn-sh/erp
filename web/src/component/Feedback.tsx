import { Alert, AlertColor, Snackbar } from '@mui/material';
import React from 'react';

export interface IFeedback {
    mess: string;
    color: string;
    open: boolean;
    close: any;
}

function Feedbacks({ mess, color, open, close }: IFeedback) {
    const handleClose = () => {
        close();
    };
    return (
        <Snackbar
            key={color}
            open={open}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            onClose={handleClose}
            autoHideDuration={4000}
        >
            <Alert severity={color as AlertColor}>{mess}</Alert>
        </Snackbar>
    );
}

export default Feedbacks;
