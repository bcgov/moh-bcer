import AutoSubmitFormik from '@/components/AutoSubmitFormik';
import { BusinessList, SearchQueryBuilder } from '@/constants/localInterfaces';
import { BusinessFilter } from '@/hooks/useBusiness';
import { Box, CircularProgress, LinearProgress } from '@material-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import { StyledRadioGroup } from 'vaping-regulation-shared-components';
import Table from './Table';

export interface BusinessTableProps {
  data: BusinessList;
  loading: boolean;
}

function BusinessTable({
  data,
  loading
}: BusinessTableProps) {

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
          <Form>
            <StyledRadioGroup
              label={``}
              name="location"
              options={[
                { label: 'All', value: BusinessFilter.All },
                { label: 'With complete reports', value: BusinessFilter.Completed },
                { label: 'With outstanding reports', value: BusinessFilter.NotCompleted },
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
