import { BCDirectionData } from '@/constants/localInterfaces';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import React from 'react';

const PREFIX = 'RouteStatics';

const classes = {
  result: `${PREFIX}-result`,
  notFound: `${PREFIX}-notFound`,
  resultText: `${PREFIX}-resultText`
};

const StyledBox = styled(Box)(() => ({
  [`& .${classes.result}`]: {
    backgroundColor: '#E0E8F0',
    padding: '5px 15px',
    borderRadius: '4px',
  },

  [`& .${classes.notFound}`]: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    padding: '5px 15px',
    borderRadius: '4px',
    color: 'red',
    fontSize: '16px',
    fontWeight: 'bold',
  },

  [`& .${classes.resultText}`]: {
    color: '#0053A4',
    fontSize: '16px',
    fontWeight: 'bold',
  }
}));

interface RouteStaticsProps {
  directionData: BCDirectionData;
  directionError: AxiosError;
}

function RouteStatics({ directionData, directionError }: RouteStaticsProps) {

  const { executionTime, timeText, distance, routeFound } = directionData ?? {};
  return (
    <StyledBox>
      {routeFound && (
        <Box className={classes.result}>
          {executionTime && (
            <Typography className={classes.resultText}>
              Route calculated in {executionTime / 1000} seconds
            </Typography>
          )}
          {timeText && distance && (
            <Typography className={classes.resultText}>
              Route travels {distance} km in {timeText}
            </Typography>
          )}
        </Box>
      )}
      {directionData && !routeFound && (
        <Box className={classes.notFound}>
          No Routes found for the given locations
        </Box>
      )}
      {directionError && (
        <Box className={classes.notFound}>
          Failed To Load Direction Data from API
        </Box>
      )}
    </StyledBox>
  );
}

export default RouteStatics;
