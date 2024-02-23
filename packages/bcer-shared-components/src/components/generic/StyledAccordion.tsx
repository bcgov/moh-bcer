import React, { useEffect, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, AccordionProps, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import { ArrowForwardIosSharp, DeleteOutline, EditSharp, SearchOutlined } from '@mui/icons-material';
import { AccordionGroupProps, StyledAccordionSummaryProps, AccordionSingleProps } from '@/constants/interfaces/genericInterfaces';
import { Form, Formik } from 'formik';
import { StyledTextField } from '../fields';
import { StyledButton } from '../buttons';
import lunr from 'lunr';

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
  const [ expanded, setExpanded ] = useState<string | null>(null);
  const [ order, setOrder ] = useState<Array<{id: string, title: string, description: string}>>();

  const dict = lunr(function() {
    this.ref('id')
    this.field('title')
    this.field('description')
    options.forEach(element => this.add(element),this)
  })

  const handleExpand = (expandedIndex: string) => (event: any, expanded: boolean) =>{
    setExpanded(expanded ? expandedIndex : null)
  }

  useEffect(() => {
    setOrder(options)
  }, [])

  const updateOrder = (values: { searchString: string }) => {
    const res = dict.search(values.searchString)
    //Explicit cast because chaining member functions return '| undefined' by design, otherwise can't setState
    const newOrder = res.map(element => options.find(option => option.id === element.ref)) as Array<{id: string, title: string, description: string}>
    if (newOrder.length > 0) {
      setOrder(newOrder)
    }
    setExpanded
  }

  return (
    <>
      <Formik
        initialValues={{ searchString: ''}}
        onSubmit={(values) => updateOrder(values)} 
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
          <StyledAccordionBase expanded={expanded === element.id} onChange={handleExpand(element.id)}>
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
 * @param {string} expandedId `string` id of currently expanded element
 * @param {function} expandCallback `function` callback function for handling expanding elements
 * @param {boolean} isEditable `optional | boolean` flag for enabling editing of an accordion element
 * @param {boolean} isDeletable `optional | boolean` flag for enabling deleting of an accordion element
 * @param {function} editCallback `optional | function` callback function for edit action
 * @param {function} deleteCallback `optional | function` callback function for delete action
 * @returns Reusable React component
 */
export function StyledAccordion ({content, isEditable = false, isDeletable = false, editCallback, deleteCallback, expandedId, expandCallback }: AccordionSingleProps) {

  return (
    <StyledAccordionBase expanded={expandedId === content.id} onChange={expandCallback(content.id)}>
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