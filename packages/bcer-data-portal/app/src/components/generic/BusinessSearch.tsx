import { Box, Typography } from '@material-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import {
  StyledButton,
  StyledSelectField,
  StyledTextField,
} from 'vaping-regulation-shared-components';
import SearchIcon from '@material-ui/icons/Search';
import { healthAuthorityOptions } from '@/constants/arrays';
import { SearchQueryBuilder } from '@/constants/localInterfaces';

export type BusinessSearchProps = {
  onSubmit: (v: Partial<SearchQueryBuilder>) => void;
  initialCategory?: string;
  categoryOptions?: Array<{
    value: string;
    label: string;
  }>;
  showHealthAuthority?: boolean;
};

function BusinessSearch({
  onSubmit,
  initialCategory,
  categoryOptions,
  showHealthAuthority,
}: BusinessSearchProps) {
  let inputFlexAmount = 0.86;

  if (showHealthAuthority) {
    inputFlexAmount -= 0.2;
  }
  return (
    <Box my={2}>
      <Formik
        onSubmit={onSubmit}
        initialValues={{
          category: initialCategory || '',
          search: '',
          healthAuthority: showHealthAuthority ? 'all' : '',
        }}
      >
        <Form>
          <Box display="flex" alignItems="flex-end">
            <Box flex={inputFlexAmount}>
              <Typography>Search (Address, Business Name, Legal Name etc.)</Typography>
              <Box display="flex">
                {categoryOptions && (
                  <Box flex={0.2}>
                    <StyledSelectField
                      name="category"
                      variant="outlined"
                      options={categoryOptions}
                    />
                  </Box>
                )}
                <Box flex={categoryOptions ? 0.8 : 1}>
                  <StyledTextField
                    variant="outlined"
                    name="search"
                    placeholder="Type in keyword.."
                  />
                </Box>
              </Box>
            </Box>
            <Box flex={0.01} />
            {showHealthAuthority && (
              <Box flex={0.19}>
                <StyledSelectField
                  name="healthAuthority"
                  options={healthAuthorityOptions}
                  label="Health Authority"
                  variant="outlined"
                />
              </Box>
            )}
            {showHealthAuthority && <Box flex={0.01} />}

            <Box flex={0.13}>
              <StyledButton variant="dialog-accept" type="submit">
                <SearchIcon />
                <Box mr={1} />
                Search
              </StyledButton>
              <Box pb={3}/>
            </Box>
          </Box>
        </Form>
      </Formik>
    </Box>
  );
}

export default BusinessSearch;
