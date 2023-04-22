import { ButtonProps, Button, styled } from '@mui/material';

var primaryColor = '#7c44f3';

export const PrimaryButton = styled(Button)<ButtonProps>(({ theme }) => ({
    backgroundColor: primaryColor,
    '&:hover': {
        backgroundColor: '#632add',
    },
}));

export const SecondaryButton = styled(Button)<ButtonProps>(({ theme }) => ({
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
