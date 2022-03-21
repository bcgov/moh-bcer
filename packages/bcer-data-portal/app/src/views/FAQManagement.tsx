import React, { useContext, useEffect, useState } from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';

import { StyledAccordionGroup, StyledAccordion, StyledButton, StyledDialog, StyledTextField, StyledConfirmDialog } from 'vaping-regulation-shared-components';
import { ConfigContext } from '@/contexts/Config';
import { AddCircleOutlined } from '@material-ui/icons';
import { Form, Formik } from 'formik';
import { faqValidationSchema } from '@/constants/validate';
import DragAndDrop from '@/components/dragable';

const useStyles = makeStyles({
  contentWrapper: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
  content: {
    maxWidth: '1440px',
    width: '95%',
    padding: '20px 30px',
  },
  addButton: {
    minWidth: '165px',
    marginBottom: '20px'
  },
  buttonIcon: {
    paddingRight: '5px',
    color: 'white',
    fontSize: '20px',
  },
})

export default function FAQManagement() {
  const classes = useStyles();
  const { config } = useContext(ConfigContext);
  const [ isAddQuestionOpen, setAddQuestionOpen ] = useState<boolean>(false);
  const [ isConfirmDialogOpen, setConfirmDialogOpen ] = useState<boolean>(false);
  const [ elementOrder, setElementOrder ] = useState(null);
  const [ selectedEditElement, setSelectedEditElement ] = useState(null);
  const [ selectedDeleteElement, setSelectedDeleteElement ] = useState(null);

  const toggleAddQuestionForm = (openState: boolean) => {
    setAddQuestionOpen(openState)
    setSelectedEditElement(null)
  }

  const handleEdit = (id: string) => {
    setSelectedEditElement(examples.find(element => element.id === id))
  }
  
  const handleDelete = (id: string) => {
    setSelectedDeleteElement(id)
    setConfirmDialogOpen(true)
  }

  const handleReorder = (items: Array<{id: string, title: string, description: string}>) => {
    setElementOrder(items)

    // POST request to save new order to DB
  }

  useEffect(() => {
    if (examples) {
      setElementOrder(examples)
    }
  }, [])

  const examples = [
    {
      id: '1',
      title: 'What does the do in which where?',
      description: 'How many has ever been as far as decided to do what look more like.'
    },
    {
      id: '2',
      title: 'How many in the place where the thing?',
      description: 'something something no.'
    },
    {
      id: '3',
      title: 'how?',
      description: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH BEES'
    },
    {
      id: '4',
      title: 'short?',
      description: 'very short question description where it stops almost immediately and does not carry on far longer than is necessary for the purposes of seeing what long text looks like in this component and also with no punctuation also bees'
    },
    {
      id: '5',
      title: 'hey i have a question?',
      description: 'Well I have an answer'
    },
  ]
  return (
    <div className={classes.contentWrapper} >
      <div className={classes.content}>
        <Typography variant="h5">FAQ Management</Typography>
        {
          elementOrder
            &&
          (
            // REMOVE ! from check before push
            config.permissions.MANAGE_FAQ
              &&
            <>
              <StyledButton 
                variant="contained"
                className={classes.addButton}
                onClick={() => toggleAddQuestionForm(true)}
              >
                <AddCircleOutlined className={classes.buttonIcon} />
                Add Question
              </StyledButton>
              <DragAndDrop
              state={elementOrder}
              setState={handleReorder}
              Component={StyledAccordion}
              componentProps={{isEditable: true, isDeletable: true, editCallback: handleEdit, deleteCallback: handleDelete}}
              />
            </>
              ||
            <StyledAccordionGroup options={elementOrder} />
          )
        }
      </div>
      <Formik
        initialValues={ selectedEditElement ? selectedEditElement : {title: '', description: ''}}
        validationSchema={faqValidationSchema}
        onSubmit={(values) => {console.log(values) /**PATCH request to submit new array with specific object-by-id updated */}}
        enableReinitialize
      >
        <Form>
          <StyledDialog
            open={isAddQuestionOpen || selectedEditElement}
            title="Add Question"
            scroll="body"
            maxWidth="sm"
            onClose={() => toggleAddQuestionForm(false)}
            cancelButtonText="Cancel"
            acceptButtonText="Submit"
            cancelHandler={() => toggleAddQuestionForm(false)}
            acceptHandler="submit"
          >
            <StyledTextField
              label={
                <div>
                  Question
                  <span style={{color: 'red'}} > *</span>
                </div>
              }
              name="title"
              variant="outlined"
              fullWidth
              rows={5}
              multiline="true"
            />
            <StyledTextField
              label={
                <div>
                  Response
                  <span style={{color: 'red'}} > *</span>
                </div>
              }
              name="description"
              variant="outlined"
              fullWidth
              rows={5}
              multiline="true"
            />
          </StyledDialog>
        </Form>
      </Formik>
      <StyledConfirmDialog
        open={isConfirmDialogOpen}
        maxWidth="xs"
        dialogTitle="Delete Question"
        checkboxLabel="I understand that this question will be permanently removed from the database."
        dialogMessage="You are about to delete the question and it will affect the Retailer's Portal. This action cannot be undone."
        setOpen={() => setConfirmDialogOpen(false)}
        confirmHandler={() => {/** POST request with new array of object minus deleted element */}}
        acceptButtonText="Delete Now"
        />
    </div>
  )
}