import { Snackbar, Alert, AlertColor } from '@mui/material';
import { useState } from 'react';

export const Feedback = (text : string, type : AlertColor) => {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity={type}
                sx={{ width: '100%' }}
            >
                {text}
            </Alert>
        </Snackbar>
    );
};
