import { Dialog } from '@mui/material';
import { styled } from '@mui/system';
import React from 'react';
import { StyledButton } from 'vaping-regulation-shared-components';

interface FullScreenProp {
  fullScreenProp: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  children: React.ReactNode;
}

const DialogWrap = styled('div')({
  padding: '1rem 1.5rem',
});

const DialogButton = styled('div')({
  marginTop: '30px',
});

function FullScreen({
  children,
  fullScreenProp: [fullscreen, setFullscreen],
}: FullScreenProp) {
  return (
    <React.Fragment>
      {children}
      <Dialog fullScreen open={fullscreen}>
        <DialogWrap>
          {children}
          <DialogButton>
            <StyledButton
              variant="outlined"
              onClick={() => setFullscreen((prev) => !prev)}
            >
              Close
            </StyledButton>
          </DialogButton>
        </DialogWrap>
      </Dialog>
    </React.Fragment>
  );
}

export default FullScreen;