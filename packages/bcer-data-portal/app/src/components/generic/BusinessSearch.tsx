import { Box, Grid, Link, Typography } from '@material-ui/core';
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
import useBusiness from '@/hooks/useBusiness';
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  searchWrap: {
    [theme.breakpoints.down('xs')]: {
      '& p.MuiTypography-body1': {
        fontSize: 14
      }
    }
  },
  search: {
    
  },
  searchText: {
    [theme.breakpoints.down('xs')]: {
      marginTop: -23
    }
  },
  haFilter: {
    [theme.breakpoints.down('xs')]: {
      paddingTop: '0 !important'
    }
  },
  searchButton: {
    [theme.breakpoints.down('xs')]: {
      paddingTop: '0 !important',
      marginTop: -17,
      textAlign: 'center'
    }
  },
  clearFilterLink: {
    color: 'red',
    textDecoration: 'underline',
    fontWeight: 'bold'
  }
}))

export type BusinessSearchProps = {
  onSubmit: (v: Partial<SearchQueryBuilder>) => void;
  initialCategory?: string;
  categoryOptions?: Array<{
    value: string;
    label: string;
  }>;
  showHealthAuthority?: boolean;
  onReset: () => void
};

function BusinessSearch({
  onSubmit,
  initialCategory,
  categoryOptions,
  showHealthAuthority,
  onReset,
}: BusinessSearchProps) {  
  const classes = useStyles();
  const {
    searchOptions,
  } = useBusiness();  
  
  return (
    <Box my={2}>
      <Formik
        onSubmit={onSubmit}
        initialValues={{
          category: searchOptions.category || initialCategory,
          search: searchOptions.search,
          healthAuthority: showHealthAuthority ? searchOptions.healthAuthority : 'all',
        }}
      >
        <Form>
          <Box
            alignContent="center"
            alignItems="center"
            justifyContent="end"
            display="flex"
            minHeight="100%"
            padding="0 0 12px">            
            <Link
              className={classes.clearFilterLink}
              component="button"
              variant="body2"
              type = "reset"
              onClick={onReset}
              >
              Clear all filters
            </Link>  
          </Box> 
          <Grid container spacing={2} className={classes.searchWrap}>            
            <Grid item container spacing={0} xs={12} lg={8} className={classes.search}>
              <Grid item lg={12}>
                <Typography>Search (Address, Business Name, Legal Name etc.)</Typography>     
              </Grid>
              {categoryOptions &&
              <Grid item lg={3} xs={12}>                  
                <StyledSelectField
                  name="category"
                  variant="outlined"
                  options={categoryOptions}                  
                />
              </Grid>}
              <Grid item lg={9} xs={12} className={classes.searchText}>
                <StyledTextField
                  variant="outlined"
                  name="search"
                  placeholder="Type in keyword.."
                />
              </Grid>              
            </Grid>

            <Grid item xs={12} lg={2} className={classes.haFilter}>   
              {showHealthAuthority && (
                <StyledSelectField
                  name="healthAuthority"
                  options={healthAuthorityOptions}
                  label="Health Authority"
                  variant="outlined"
                />  
              )}
            </Grid>

            <Grid item xs={12} lg={2} className={classes.searchButton}>
              <Grid>&nbsp;</Grid>
              <StyledButton variant="dialog-accept" type="submit">
                <SearchIcon />
                <Box mr={1} />
                Search
              </StyledButton>
            </Grid>
          </Grid>          
        </Form>
      </Formik>
    </Box>
  );
}

export default BusinessSearch;
