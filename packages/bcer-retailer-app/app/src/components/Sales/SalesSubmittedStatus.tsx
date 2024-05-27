import React from 'react';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/material';

const PREFIX = 'SalesSubmittedStatus';

const classes = {
  root: `${PREFIX}-root`,
  dot: `${PREFIX}-dot`
};

const Root = styled('div')({
  [`&.${classes.root}`]: {
    display: 'flex',
    alignItems: 'center',
  },
  [`& .${classes.dot}`]: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginRight: '1rem',
    flexShrink: 0,
    backgroundColor: ({ isSubmitted }: IProps) =>
      isSubmitted ? '#7ED321' : '#D0021B',
  },
});

interface IProps {
  isSubmitted: boolean;
}

export default function SalesSubmittedStatus({ isSubmitted }: IProps) {

  return (
    <Root className={classes.root}>
      <div className={classes.dot} />
      <header>{isSubmitted ? 'Submitted' : 'Not Submitted'}</header>
    </Root>
  );
}
