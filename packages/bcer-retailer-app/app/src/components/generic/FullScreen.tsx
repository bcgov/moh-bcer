import { Dialog } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { StyledButton } from 'vaping-regulation-shared-components';

const PREFIX = 'FullScreen';

const classes = {
  dialogWrap: `${PREFIX}-dialogWrap`,
  dialogButton: `${PREFIX}-dialogButton`
};

const Root = styled('div')({
  [`& .${classes.dialogWrap}`]: {
    padding: '1rem 1.5rem',
  },
  [`& .${classes.dialogButton}`]: {
    marginTop: '30px',
  },
});

interface FullScreenProp {
  fullScreenProp: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  children: React.ReactNode;
}

function FullScreen({
  children,
  fullScreenProp: [fullscreen, setFullscreen],
}: FullScreenProp) {

  return (
    <Root>
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
    </Root>
  );
}

export default FullScreen;
