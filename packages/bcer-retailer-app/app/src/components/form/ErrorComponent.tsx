import React, { FunctionComponent, ComponentProps } from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  errorP: {
    color: 'red',
    padding: '4px',
    fontSize: '0.75em',
    maxWidth: '90%',
  }
});

const ErrorComponent: FunctionComponent = (props: ComponentProps<any>) => {
  const classes = useStyles();
  return (
    <p className={classes.errorP}>{props.children}</p>
  );
};

export default ErrorComponent;
