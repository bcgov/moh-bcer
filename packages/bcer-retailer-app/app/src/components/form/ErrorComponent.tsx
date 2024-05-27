import React, { FunctionComponent, ComponentProps } from 'react';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/material';

const PREFIX = 'ErrorComponent';

const classes = {
  errorP: `${PREFIX}-errorP`
};

const Root = styled('p')({
  [`&.${classes.errorP}`]: {
    color: 'red',
    padding: '4px',
    fontSize: '0.75em',
    maxWidth: '90%',
  }
});

const ErrorComponent: FunctionComponent = (props: ComponentProps<any>) => {

  return <Root className={classes.errorP}>{props.children}</Root>;
};

export default ErrorComponent;
