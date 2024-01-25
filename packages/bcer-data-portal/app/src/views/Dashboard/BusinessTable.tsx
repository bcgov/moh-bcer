import AutoSubmitFormik from '@/components/AutoSubmitFormik';
import { BusinessList, SearchQueryBuilder } from '@/constants/localInterfaces';
import { BusinessFilter } from '@/hooks/useBusiness';
import { Box, CircularProgress, LinearProgress } from '@material-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import { StyledRadioGroup } from 'vaping-regulation-shared-components';
import Table from './Table';
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  businessFilterForm: {
    [theme.breakpoints.down('xs')]: {
      '& .MuiFormGroup-row': {
        flexDirection: 'column',
      },
      '& label.MuiFormControlLabel-root': {
        '& span.MuiRadio-root': {
          paddingTop: 2,
          paddingBottom: 2
        },
        '& span.MuiFormControlLabel-label': {
          fontSize: 14
        }
      }
    }
  }
}))

export interface BusinessTableProps {
  data: BusinessList;
  loading: boolean;
}

function BusinessTable({
  data,
  loading
}: BusinessTableProps) {
  const classes = useStyles();
  const initialValues: { location: BusinessFilter } = {
    location: BusinessFilter.All,
  };
  
  return (
    <Box>
      <Formik
        initialValues={initialValues}
        onSubmit={() =>{}}
      >
        {({ values }) => (
          <Form className= {classes.businessFilterForm}>
            <StyledRadioGroup
              label={``}
              name="location"
              options={[
                { label: 'All', value: BusinessFilter.All },
                { label: 'With complete reports', value: BusinessFilter.Completed },
                {
                  label: 'With outstanding reports',
                  value: BusinessFilter.NotCompleted,
                },
              ]}
              row={true} 
            />
            {loading ? <LinearProgress /> : <Box pt={0.5}/>}
            <Table
              data={data[values.location]}
            />
          </Form>
        )}
      </Formik>
    </Box>
  );
}

export default BusinessTable;
