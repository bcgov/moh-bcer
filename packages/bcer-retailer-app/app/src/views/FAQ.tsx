import React from 'react';
import { makeStyles, Typography, CircularProgress } from '@material-ui/core';

import { StyledAccordionGroup } from 'vaping-regulation-shared-components';
import { useAxiosGet } from '@/hooks/axios';

const useStyles = makeStyles({
  parent: {
    padding: '1rem 2rem',
    overflowY: 'auto',
  },
})

export default function FAQ() {
  const classes = useStyles();
  const [{data, loading, error}, get] = useAxiosGet('/faq')

  return (
    <>
    {
      loading 
        ? 
      <CircularProgress /> 
        :
      <div className={classes.parent} >
        <Typography variant="h5">Frequently Asked Questions</Typography>
        {
          data
            &&
          <StyledAccordionGroup options={JSON.parse(data.content)} />
        }
      </div>
    }
    </>
  )
}