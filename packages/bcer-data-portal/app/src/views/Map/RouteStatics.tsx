import { BCDirectionData } from '@/constants/localInterfaces';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { AxiosError } from 'axios';
import React from 'react';

const useStyles = makeStyles(() => ({
  result: {
    backgroundColor: '#E0E8F0',
    padding: '5px 15px',
    borderRadius: '4px',
  },
  notFound: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    padding: '5px 15px',
    borderRadius: '4px',
    color: 'red',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  resultText: {
    color: '#0053A4',
    fontSize: '16px',
    fontWeight: 'bold',
  },
}));

interface RouteStaticsProps {
  directionData: BCDirectionData;
  directionError: AxiosError;
}

function RouteStatics({ directionData, directionError }: RouteStaticsProps) {
  const classes = useStyles();
  const { executionTime, timeText, distance, routeFound } = directionData ?? {};
  return (
    <Box>
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
    </Box>
  );
}

export default RouteStatics;
