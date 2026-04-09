import logo from '../../assets/debtflix-logo.svg';
import Box from '@mui/material/Box';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';

const ServerButton: FC = () => {
    return (
        <Box
            component={Link}
            to='/'
            sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                mr: 1
            }}
        >
            <Box
                component='img'
                src={logo}
                alt='Debtflix'
                sx={{
                    height: { xs: '1.4rem', md: '1.6rem' },
                    width: 'auto'
                }}
            />
        </Box>
    );
};

export default ServerButton;
