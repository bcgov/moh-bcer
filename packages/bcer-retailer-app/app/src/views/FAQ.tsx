import React from 'react';
import { styled } from '@mui/material/styles';
import { Typography, CircularProgress } from '@mui/material';
import { StyledAccordionGroup } from 'vaping-regulation-shared-components';
import { useAxiosGet } from '@/hooks/axios';

const PREFIX = 'FAQ';

const classes = {
  parent: `${PREFIX}-parent`
};

const Root = styled('div')({
  [`& .${classes.parent}`]: {
    padding: '1rem 2rem',
    overflowY: 'auto',
  },
});

export default function FAQ() {

  const [{data, loading, error}, get] = useAxiosGet('/faq')

  return (
    <Root>
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
    </Root>
  );
}