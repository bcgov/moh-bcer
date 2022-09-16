import React from 'react';
import { makeStyles } from '@material-ui/core';

interface IProps {
  isSubmitted: boolean;
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    marginRight: '1rem',
    flexShrink: 0,
    backgroundColor: ({ isSubmitted }: IProps) =>
      isSubmitted ? '#7ED321' : '#D0021B',
  },
});
export default function SalesSubmittedStatus({ isSubmitted }: IProps) {
  const classes = useStyles({ isSubmitted });
  return (
    <div className={classes.root}>
      <div className={classes.dot} />
      <header>{isSubmitted ? 'Submitted' : 'Not Submitted'}</header>
    </div>
  );
}
