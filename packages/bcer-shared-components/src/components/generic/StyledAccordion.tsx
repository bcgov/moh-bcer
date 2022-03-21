import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, AccordionProps, Typography } from '@material-ui/core'
import { styled } from '@material-ui/styles';
import { ArrowForwardIosSharp, DeleteOutline, EditSharp, SearchOutlined } from '@material-ui/icons';
import { AccordionGroupProps, StyledAccordionSummaryProps, AccordionSingleProps } from '@/constants/interfaces/genericInterfaces';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { StyledTextField } from '../fields';
import { StyledButton } from '../buttons';

const StyledAccordionBase = styled((props: AccordionProps) => (
  <Accordion elevation={0} {...props} />
))(({ theme }) => ({
  borderRadius: '4px',
  border: `1px solid #E1E1E6`,
  marginBottom: '10px',
  '&:before': {
    display: 'none',
  },
}));

const StyledAccordionSummary = styled((props: StyledAccordionSummaryProps) => (
  <div style={{ display: 'flex'}}>
    <AccordionSummary
      expandIcon={<ArrowForwardIosSharp style={{color: '#0053A4', fontSize: '0.9rem'}}/>}
      {...props}
    >
      {props.children}
    </AccordionSummary>
    <div  style={{ display: 'flex', paddingRight: '10px', backgroundColor: '#FAFAFA', alignItems: 'center' }}>
        {
          props.isEditable 
            &&
          <EditSharp style={{ color: '#0053A4', marginRight: '25px', cursor: 'pointer' }} onClick={() => props.editCallback && props.editCallback(props.id)}/>
        }
        {
          props.isDeletable
            &&
          <DeleteOutline style={{ color: 'red', cursor: 'pointer' }} onClick={() => props.deleteCallback && props.deleteCallback(props.id)}/>
        }
    </div>
  </div>
))(({ theme }) => ({
  backgroundColor: '#FAFAFA',
  flexDirection: 'row-reverse',
  padding: '0px',
  width: '100%',
  '& .MuiAccordionSummary-expandIcon.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    margin: '0px 10px 0px 10px',
    display: 'block'
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: '0px 20px 25px 39px',
  backgroundColor: '#FAFAFA'
}));

/**
 * 
 * @param {Array<Object>} options `Array of Objects` elements which will populate the accordion group
 * @param {string} options.title `string` title of accordion
 * @param {string} options.description `string` content of accordion body
 * @param {string} options.id `string` id of element
 * @param {boolean} isEditable `optional | boolean` flag for enabling editing of an accordion element
 * @param {boolean} isDeletable `optional | boolean` flag for enabling deleting of an accordion element
 * @param {function} editCallback `optional | function` callback function for edit action
 * @param {function} deleteCallback `optional | function` callback function for delete action
 * @returns Reusable React component
 */
export function StyledAccordionGroup ({options, isEditable = false, isDeletable = false, editCallback, deleteCallback }: AccordionGroupProps) {
  const [ expanded, setExpanded ] = useState<number>(-1);
  const [ order, setOrder ] = useState<Array<{id: string, title: string, description: string}> | null>(null);

  const handleExpand = (expandedIndex: number) => (event: any, expanded: boolean) =>{
    setExpanded(expanded ? expandedIndex : -1)
  }

  useEffect(() => {
    setOrder(options)
  }, [])

  return (
    <>
      <Formik
        initialValues={{ searchString: ''}}
        onSubmit={(values) => console.log(values)} 
      >
        <Form style={{ display: 'flex', marginBottom: '20px' }}>
          <StyledTextField label="" name="searchString" variant="outlined" helpText="Search by keyword..." />
          <StyledButton type="submit" variant="contained" style={{ marginLeft: '5px'}} ><SearchOutlined/> Search</StyledButton>
        </Form>
      </Formik>
      {
        order 
          &&
        order.map((element, index) => (
          <StyledAccordionBase expanded={expanded === index} onChange={handleExpand(index)}>
            <StyledAccordionSummary
              isEditable={isEditable}
              isDeletable={isDeletable}
              editCallback={editCallback}
              deleteCallback={deleteCallback}
              aria-controls={`panel${index}d-content`}
              id={`${index}`}
            >
              <Typography style={{ fontSize: '16px', fontWeight: 600, color: '#333333' }} 
              >
                {element.title}
              </Typography>
            </StyledAccordionSummary>
            <StyledAccordionDetails>
              <Typography
              style={{ fontSize: '16px', color: '#333333' }}>
              {element.description}
              </Typography>
            </StyledAccordionDetails>
          </StyledAccordionBase>
        ))
      }
  </>
  )
}

/**
 * 
 * @param {Object} content `Object` object which will populate the accordion group
 * @param {string} content.title `string` title of accordion
 * @param {string} content.description `string` content of accordion body
 * @param {string} content.id `string` id of element
 * @param {boolean} isEditable `optional | boolean` flag for enabling editing of an accordion element
 * @param {boolean} isDeletable `optional | boolean` flag for enabling deleting of an accordion element
 * @param {function} editCallback `optional | function` callback function for edit action
 * @param {function} deleteCallback `optional | function` callback function for delete action
 * @returns Reusable React component
 */
export function StyledAccordion ({content, isEditable = false, isDeletable = false, editCallback, deleteCallback }: AccordionSingleProps) {
  const [ expanded, setExpanded ] = useState<string>('-1');

  const handleExpand = (expandedId: string) => (event: any, expanded: boolean) =>{
    setExpanded(expanded ? expandedId : '-1')
  }

  return (
    <StyledAccordionBase expanded={expanded === content.id} onChange={handleExpand(content.id)}>
      <StyledAccordionSummary
        isEditable={isEditable}
        isDeletable={isDeletable}
        editCallback={editCallback}
        deleteCallback={deleteCallback}
        aria-controls={`panel${content.id}d-content`}
        id={content.id}
      >
        <Typography style={{ fontSize: '16px', fontWeight: 600, color: '#333333' }} 
        >
          {content.title}
        </Typography>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Typography
        style={{ fontSize: '16px', color: '#333333' }}>
        {content.description}
        </Typography>
      </StyledAccordionDetails>
    </StyledAccordionBase>
  )
}