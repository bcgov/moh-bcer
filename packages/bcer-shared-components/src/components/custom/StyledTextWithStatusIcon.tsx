import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const StyledBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const StyledText = styled(Box)(() => ({
  color: '#333333',
  fontSize: '14px',
}));

export type TextWithStatusIconProps = {
  text: React.ReactNode;
  success: boolean;
  textProps?: BoxProps;
  iconProps?: Object;
};

export function StyledTextWithStatusIcon({
  text,
  success,
  textProps = {},
  iconProps = {},
}: TextWithStatusIconProps) {

  return (
    <StyledBox>
      {success ? (
        <CheckCircleIcon style={{ color: '#52C41A' }} {...iconProps}/>
      ) : (
        <ErrorIcon style={{ color: '#FAAD14' }} {...iconProps}/>
      )}
      <Box ml={1} />
      <StyledText {...textProps}>{text}</StyledText>
    </StyledBox>
  );
}
