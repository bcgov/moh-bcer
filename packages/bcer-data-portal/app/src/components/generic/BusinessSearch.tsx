import React from 'react';
import { Box, Grid, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { Form, Formik } from 'formik';
import {
  StyledButton,
  StyledSelectField,
  StyledTextField,
} from 'vaping-regulation-shared-components';
import SearchIcon from '@mui/icons-material/Search';
import { healthAuthorityOptions } from '@/constants/arrays';
import { SearchQueryBuilder } from '@/constants/localInterfaces';
import useBusiness from '@/hooks/useBusiness';

const SearchWrap = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('xs')]: {
    '& p.MuiTypography-body1': {
      fontSize: 14,
    },
  },
}));

const Search = styled(Grid)({});

const SearchText = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('xs')]: {
    marginTop: -23,
  },
}));

const HaFilter = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('xs')]: {
    paddingTop: '0 !important',
  },
}));

const SearchButton = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('xs')]: {
    paddingTop: '0 !important',
    textAlign: 'center',
  },
}));

const ClearFilterButton = styled(Button)({
  color: 'red',
  textDecoration: 'underline',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: 'transparent',
  },
});

export type BusinessSearchProps = {
  onSubmit: (v: Partial<SearchQueryBuilder>) => void;
  initialCategory?: string;
  categoryOptions?: Array<{
    value: string;
    label: string;
  }>;
  showHealthAuthority?: boolean;
  onReset: () => void;
};

function BusinessSearch({
  onSubmit,
  initialCategory,
  categoryOptions,
  showHealthAuthority,
  onReset,
}: BusinessSearchProps) {
  const { searchOptions } = useBusiness();

  return (
    <Box my={2}>
      <Formik
        onSubmit={(values) => {
          onSubmit({
            ...values,
            page: 0,
          });
        }}
        initialValues={{
          category: searchOptions.category || initialCategory,
          search: searchOptions.search,
          healthAuthority: showHealthAuthority
            ? searchOptions.healthAuthority
            : 'all',
        }}
      >
        <Form>
          <Box
            alignContent="center"
            alignItems="center"
            justifyContent="end"
            display="flex"
            minHeight="100%"
            padding="0 0 12px"
          >
            <ClearFilterButton variant="text" type="reset" onClick={onReset}>
              Clear all filters
            </ClearFilterButton>
          </Box>
          <SearchWrap container spacing={2}>
            <Search item container spacing={0} xs={12} lg={8}>
              <Grid item lg={12}>
                <Typography>Search (Address, Business Name, Legal Name etc.)</Typography>
              </Grid>
              {categoryOptions && (
                <Grid item lg={3} xs={12}>
                  <StyledSelectField
                    name="category"
                    variant="outlined"
                    options={categoryOptions}
                  />
                </Grid>
              )}
              <SearchText item lg={9} xs={12}>
                <StyledTextField
                  variant="outlined"
                  name="search"
                  placeholder="Type in keyword.."
                />
              </SearchText>
            </Search>

            <HaFilter item xs={12} lg={2}>
              {showHealthAuthority && (
                <StyledSelectField
                  name="healthAuthority"
                  options={healthAuthorityOptions}
                  label="Health Authority"
                  variant="outlined"
                />
              )}
            </HaFilter>

            <SearchButton item xs={12} lg={2}>
              <Grid>&nbsp;</Grid>
              <StyledButton variant="dialog-accept" type="submit">
                <SearchIcon />
                <Box mr={1} />
                Search
              </StyledButton>
            </SearchButton>
          </SearchWrap>
        </Form>
      </Formik>
    </Box>
  );
}

export default BusinessSearch;