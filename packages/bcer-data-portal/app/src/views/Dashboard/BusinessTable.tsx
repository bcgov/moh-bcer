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
  onChangeSearch: (data: Partial<SearchQueryBuilder>) => void;
  searchOptions: SearchQueryBuilder;
  loading: boolean;
}

function BusinessTable({
  data,
  onChangeSearch,
  searchOptions,
  loading
}: BusinessTableProps) {

  const paginatedTableProps = {
    onChangePage: (page: number) => onChangeSearch({ page }),
    onChangeRowsPerPage: (rowsPerPage: number) => onChangeSearch({ pageSize: rowsPerPage }),
    totalCount: data.total,
    page: searchOptions.page,
  };

  const initialValues: { location: BusinessFilter } = {
    location: BusinessFilter.All,
  };
  
  return (
    <Box>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) =>
          onChangeSearch({ additionalFilter: values.location })
        }
      >
        {({ values, ...helpers }) => (
          <Form>
            <StyledRadioGroup
              label={``}
              name="location"
              options={[
                { label: 'All', value: BusinessFilter.All },
                { label: 'Complete Reports', value: BusinessFilter.Completed },
                {
                  label: 'Missing Reports',
                  value: BusinessFilter.NotCompleted,
                },
              ]}
              row={true}
            />
            {loading ? <LinearProgress /> : <Box pt={0.5}/>}
            <Table
              data={data[values.location]}
              {...(values.location === BusinessFilter.All
                ? paginatedTableProps
                : {})}
            />
            <AutoSubmitFormik values={values} submitForm={helpers.submitForm} />
          </Form>
        )}
      </Formik>
    </Box>
  );
}

export default BusinessTable;
