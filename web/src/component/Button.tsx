import { ButtonProps, Button, styled } from '@mui/material';

const primaryColor = '#7c44f3';

export const PrimaryButton = styled(Button)<ButtonProps>(() => ({
    backgroundColor: primaryColor,
    '&:hover': {
        backgroundColor: '#632add',
    },
}));

export const SecondaryButton = styled(Button)<ButtonProps>(() => ({
    color: primaryColor,
    border: '1px solid',
    borderColor: primaryColor,
    backgroundColor: 'none',
    '&:hover': {
        backgroundColor: '#edecee',
        color: primaryColor,
        borderColor: primaryColor,
    },
}));
