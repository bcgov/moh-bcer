import { Dialog } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { StyledButton } from 'vaping-regulation-shared-components';

interface FullScreenProp {
  fullScreenProp: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  children: React.ReactNode;
}

const useStyles = makeStyles({
  dialogWrap: {
    padding: '1rem 1.5rem',
  },
  dialogButton: {
    marginTop: '30px',
  },
});

function FullScreen({
  children,
  fullScreenProp: [fullscreen, setFullscreen],
}: FullScreenProp) {
  const classes = useStyles();
  return (
    <React.Fragment>
      {children}
      <Dialog fullScreen open={fullscreen}>
        <div className={classes.dialogWrap}>
          {children}
          <div className={classes.dialogButton}>
            <StyledButton
              variant="outlined"
              onClick={() => setFullscreen((prev) => !prev)}
            >
              Close
            </StyledButton>
          </div>
        </div>
      </Dialog>
    </React.Fragment>
  );
}

export default FullScreen;
