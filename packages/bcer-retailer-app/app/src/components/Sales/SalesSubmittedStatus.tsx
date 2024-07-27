import React from 'react';
import { Box, Typography, styled } from '@mui/material';

interface IProps {
  isSubmitted: boolean;
}

const StatusDot = styled('span')<{ isSubmitted: boolean }>(({ theme, isSubmitted }) => ({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  marginRight: theme.spacing(1),
  flexShrink: 0,
  backgroundColor: isSubmitted ? '#7ED321' : '#D0021B',
}));

export default function SalesSubmittedStatus({ isSubmitted }: IProps) {
  return (
    <Box display="flex" alignItems="center">
      <StatusDot isSubmitted={isSubmitted} />
      <Typography variant="body1">
        {isSubmitted ? 'Submitted' : 'Not Submitted'}
      </Typography>
    </Box>
  );
}