import { useToast } from '@/hooks/useToast';
import { Box, Slide, Snackbar } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { StyledToast } from 'vaping-regulation-shared-components';

function Toast() {
  const { state, closeToast } = useToast();
  return (
    <Snackbar
      open={state.isOpen}
      autoHideDuration={10000}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      TransitionComponent={SlideTransition}
      onClose={closeToast}
    >
      <Box>
        <StyledToast
          type={state.type}
          errorMessages={state.errorMessages}
          successMessages={state.successMessages}
          warningMessages={state.warningMessages}
          title={state.title}
          onClose={closeToast}
        />
      </Box>
    </Snackbar>
  );
}

function SlideTransition(props: any) {
  return <Slide {...props} direction="down" />;
}

export default Toast;
