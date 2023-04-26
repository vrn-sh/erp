import { Alert, AlertColor, Snackbar } from '@mui/material';

export interface IFeedback {
    mess: string;
    color: string;
    open: boolean;
}

const Feedbacks = (message: IFeedback) => {
    return (
        <Snackbar
            key={message.color}
            open={message.open}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            autoHideDuration={2000}
        >
            <Alert severity={message.color as AlertColor}>{message.mess}</Alert>
        </Snackbar>
    );
};

export default Feedbacks;
