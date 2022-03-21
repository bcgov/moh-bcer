import React, { useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';

import { StyledAccordionGroup } from 'vaping-regulation-shared-components';

const useStyles = makeStyles({
  parent: {
    padding: '1rem 2rem',
    overflowY: 'auto',
  },
})

export default function FAQ() {
  const classes = useStyles();

  const examples = [
    {
      title: 'What does the do in which where?',
      description: 'How many has ever been as far as decided to do what look more like.'
    },
    {
      title: 'How many in the place where the thing?',
      description: 'something something no.'
    },
    {
      title: 'how?',
      description: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH BEES'
    },
    {
      title: 'short?',
      description: 'very short question description where it stops almost immediately and does not carry on far longer than is necessary for the purposes of seeing what long text looks like in this component and also with no punctuation also bees'
    },
    {
      title: 'hey i have a question?',
      description: 'Well I have an answer'
    },
  ]
  return (
    <div className={classes.parent} >
      <Typography variant="h5">Frequently Asked Questions</Typography>

      {
        examples
          &&
        <StyledAccordionGroup options={examples} />
      }
    </div>
  )
}