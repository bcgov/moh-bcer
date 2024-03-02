import { Box, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CancelIcon from '@mui/icons-material/Cancel';

const PREFIX = 'StyledToast';

const classes = {
  container: `${PREFIX}-container`,
  successTitle: `${PREFIX}-successTitle`,
  warningTitle: `${PREFIX}-warningTitle`,
  errorTitle: `${PREFIX}-errorTitle`,
  success: `${PREFIX}-success`,
  successMessage: `${PREFIX}-successMessage`,
  warning: `${PREFIX}-warning`,
  error: `${PREFIX}-error`,
  successBottomBorder: `${PREFIX}-successBottomBorder`,
  errorBottmBorder: `${PREFIX}-errorBottmBorder`,
  warningBottomBorder: `${PREFIX}-warningBottomBorder`
};

const StyledBox = styled(Box)((
  {
    theme
  }
) => ({
  [`& .${classes.container}`]: {
    backgroundColor: '#F8F4F4',
    padding: '20px',
    width: '600px',
    marginTop: '20px',
    boxShadow: '2px 2px 20px 5px rgba(0,0,0,0.15)',
  },

  [`& .${classes.successTitle}`]: { 
    fontSize: '18px', 
    fontWeight: 600, 
    color: '#3E3C3B' 
  },

  [`& .${classes.warningTitle}`]: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'orange',
  },

  [`& .${classes.errorTitle}`]: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#ff0033',
  },

  [`& .${classes.success}`]: {
    color: '#43A047',
    fontSize: '14px',
  },

  [`& .${classes.successMessage}`]: { 
    fontSize: '14px', 
    color: '#3E3C3B' 
  },

  [`& .${classes.warning}`]: {
    color: 'orange',
    fontSize: '14px',
  },

  [`& .${classes.error}`]: {
    color: '#ff0033',
    fontSize: '14px',
  },

  [`& .${classes.successBottomBorder}`]: {
    backgroundColor: '#43A047',
    height: '5px',
  },

  [`& .${classes.errorBottmBorder}`]: {
    backgroundColor: '#ff0033',
    height: '5px',
  },

  [`& .${classes.warningBottomBorder}`]: {
    backgroundColor: 'orange',
    height: '5px',
  }
}));

export interface StyledToastProps {
  onClose?: ()=>void,
  successMessages?: Array<string>,
  errorMessages?: Array<string>,
  warningMessages?: Array<string>,
  title?: string,
  type: 'success' | 'error' | 'warning',
}

export function StyledToast({
    onClose,
    successMessages,
    errorMessages,
    warningMessages,
    title,
    type,
  }: StyledToastProps) {

    if (!title) {
      switch (type) {
        case 'error':
          title = 'Error!';
          break;
        case 'warning':
          title = 'Warning!';
          break;
        case 'success':
          title = 'Success!';
          break;
      }
    }
  
    return (
      <StyledBox>
        <Box position="relative" className={classes.container}>
          {onClose && (
            <Box position="absolute" top={5} right={5}>
              <IconButton onClick={onClose} size="large">
                <CloseIcon style={{ color: 'grey' }} />
              </IconButton>
            </Box>
          )}
          <Box display="flex">
            <Box flex={0.06} style={{ marginTop: '3px' }}>
              {type === 'success' && (
                <CheckCircleIcon style={{ color: '#43A047' }} />
              )}
              {type === 'warning' && (
                <ErrorOutlineIcon style={{ color: 'orange' }} />
              )}
              {type === 'error' && <CancelIcon style={{ color: '#ff0033' }} />}
            </Box>
            <Box flex={0.94}>
              {type === 'success' && (
                <Typography
                  className={classes.successTitle}
                >
                  {title}
                </Typography>
              )}
              {type === 'warning' && (
                <Typography
                  className={classes.warningTitle}
                >
                  {title}
                </Typography>
              )}
              {type === 'error' && (
                <Typography
                  className={classes.errorTitle}
                >
                  {title}
                </Typography>
              )}
              {successMessages &&
                successMessages.map((message) => {
                  return (
                    <Box display="flex" key={message}>
                      <Box mr={2}>
                        <CheckCircleIcon
                          className={classes.success}
                        />
                      </Box>
                      <Typography className={classes.successMessage}>
                        {message}
                      </Typography>
                    </Box>
                  );
                })}
              {warningMessages &&
                warningMessages.map((message) => {
                  return (
                    <Box display="flex" key={message}>
                      <Box mr={2}>
                        <ErrorOutlineIcon
                          className={classes.warning}
                        />
                      </Box>
                      <Typography className={classes.warning}>
                        {message}
                      </Typography>
                    </Box>
                  );
                })}
              {errorMessages &&
                errorMessages.map((message) => {
                  return (
                    <Box display="flex" key={message}>
                      <Box mr={2}>
                        <CancelIcon
                          className={classes.error}
                        />
                      </Box>
                      <Typography className={classes.error}>
                        {message}
                      </Typography>
                    </Box>
                  );
                })}
            </Box>
          </Box>
        </Box>
        {type === 'success' && <Box className={classes.successBottomBorder} />}
        {type === 'warning' && <Box className={classes.warningBottomBorder} />}
        {type === 'error' && <Box className={classes.errorBottmBorder} />}
      </StyledBox>
    );
  }