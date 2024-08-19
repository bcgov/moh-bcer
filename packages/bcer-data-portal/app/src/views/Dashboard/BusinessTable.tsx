import AutoSubmitFormik from '@/components/AutoSubmitFormik';
import { BusinessList, SearchQueryBuilder } from '@/constants/localInterfaces';
import { BusinessFilter } from '@/hooks/useBusiness';
import { Box, CircularProgress, LinearProgress, styled } from '@mui/material';
import { Form, Formik } from 'formik';
import React from 'react';
import { StyledRadioGroup } from 'vaping-regulation-shared-components';
import Table from './Table';

const BusinessFilterForm = styled(Form)(({ theme }) => ({
  [theme.breakpoints.down('xs')]: {
    '& .MuiFormGroup-row': {
      flexDirection: 'column',
    },
    '& label.MuiFormControlLabel-root': {
      '& span.MuiRadio-root': {
        paddingTop: 2,
        paddingBottom: 2,
      },
      '& span.MuiFormControlLabel-label': {
        fontSize: 14,
      },
    },
  },
}));

export interface BusinessTableProps {
  data: BusinessList;
  loading: boolean;
  onChangeSearch: Function;
  totalRowCount: number;
  searchOptions: SearchQueryBuilder;
}

function BusinessTable({
  data,
  loading,
  onChangeSearch,
  totalRowCount,
  searchOptions,
}: BusinessTableProps) {
  const initialValues: { reports: BusinessFilter } = {
    reports: BusinessFilter.All,
  };

  return (
    <Box>
      <Formik
        initialValues={initialValues}
        onSubmit={() =>{}}
      >
        {({ values, setFieldValue }) => (
          <BusinessFilterForm>
            <StyledRadioGroup
              label={``}
              name="reports"
              options={[
                { label: 'All', value: BusinessFilter.All },
                { label: 'With complete reports', value: BusinessFilter.Completed },
                {
                  label: 'With outstanding reports',
                  value: BusinessFilter.Outstanding,
                },
              ]}
              row={true}
              onChange={(event: string) => {
                setFieldValue('reports', event);
                onChangeSearch({ 
                  reports: event,
                  page: 0
                });
              }}
            />
            {loading ? <LinearProgress /> : <Box pt={0.5}/>}
            <Table
              data={data}
              onChangeSearch={onChangeSearch}
              totalRowCount={totalRowCount}
              searchOptions={searchOptions}
            />
          </BusinessFilterForm>
        )}
      </Formik>
    </Box>
  );
}

export default BusinessTable;
