import React from 'react';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/material';

import InfoIcon from 'assets/images/info.svg';

const PREFIX = 'ReplaceWarning';

const classes = {
  parent: `${PREFIX}-parent`,
  warningIcon: `${PREFIX}-warningIcon`,
  warningTextContainer: `${PREFIX}-warningTextContainer`
};

const Root = styled('div')({
  [`&.${classes.parent}`]: {
    margin: '1rem 0',
    display: 'flex',
    alignItems: 'center',
    background: '#F8F2E4',
  },
  [`& .${classes.warningIcon}`]: {
    marginLeft: '1.5rem',
  },
  [`& .${classes.warningTextContainer}`]: {
    padding: '.5rem 1rem',
    height: '55px',
    display: 'flex',
    width: '90%',
    borderRadius: '4px',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
});

interface IProps {
  content?: string | React.ReactElement;
}

export default function ReplaceWarning({ content }: IProps) {


  return (
    <Root className={classes.parent}>
      <div className={classes.warningIcon}>
        <img src={InfoIcon} />
      </div>
      <div className={classes.warningTextContainer}>{content}</div>
    </Root>
  );
}

ReplaceWarning.defaultProps = {
  content: `Please know that all the previously submitted records for this location
  and reporting period will be overridden, and only your new submission
  will be kept.`,
};
