import React, { useContext, useEffect, useState } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { useAxiosGet, useAxiosPost } from '@/hooks/axios';
import { makeStyles, Typography, Paper, Checkbox, FormControlLabel } from '@material-ui/core';
import { CSVLink } from 'react-csv';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import SaveAltIcon from '@material-ui/icons/SaveAlt'

import { StyledTable, StyledButton, StyledDialog, StyledConfirmDialog } from 'vaping-regulation-shared-components';
import { BusinessLocation } from '@/constants/localInterfaces';
import { BusinessLocationHeaders } from '@/constants/localEnums';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { IBusinessLocationValues } from '@/components/form/validations/vBusinessLocation';

const useStyles = makeStyles({
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
  },
  title: {
    padding: '20px 0px',
    color: '#002C71'
  },
  helpTextWrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#E0E8F0',
    marginBottom: '30px',
    borderRadius: '5px',
  },
  helperIcon: {
    fontSize: '45px',
    color: '#0053A4',
    paddingRight: '25px',
  },
  box: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
  },
  boxTitle: {
    paddingBottom: '10px'
  },
  tableRowCount: {
    paddingBottom: '10px'
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px'
  },
  csvLink: {
    textDecoration: 'none',
  },
  submitWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '30px'
  },
  checkboxLabel: {
    marginTop: '20px',
    '& .MuiIconButton-colorSecondary':{
      '&:hover': {
        background: 'rgba(0, 83, 164, .03)',
      }
    },
    '& .MuiCheckbox-root': {
      color: 'rgba(0, 0, 0, 0.54)',

    },
    '& .Mui-checked': {
      color: '#0053A4'
    },
  },
});

export default function NoiSubmit() {
  const classes = useStyles();
  const history = useHistory();

  const [outstanding, setOutstanding] = useState([]);

  const [isConfirmOpen, setOpenConfirm] = useState<boolean>(false);
  const [isConfirmChecked, setConfirmChecked] = useState<boolean>();
  const [{ data: locations = [], loading, error }] = useAxiosGet(`/location?includes=noi`);
  const [{ response, loading: postLoading, error: postError }, post] = useAxiosPost(`/noi`, { manual: true });
  const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

  const confirmSubmit = async () => {
    await post({
      data: locations.map((l: BusinessLocation) => l.id)
    });
  }

  const submit = () => {
    setOpenConfirm(true);
  }

  useEffect(() => {
    if (postError) {
      setAppGlobal({...appGlobal, networkErrorMessage: postError?.response?.data?.message})
    }
  }, [postError])

  useEffect(() => {
    if (locations.length && !error) {
      const outstanding = locations.filter((l: BusinessLocation) => !l.noi);
      setOutstanding(outstanding);
    } else {
      if (error) {
        setAppGlobal({...appGlobal, networkErrorMessage: error?.response?.data?.message})
      }
    }
  }, [locations, error]);

  return loading ? <CircularProgress /> : response?.status === 201 ? <Redirect to='/noi/success' /> : (
    <>
      <div>
        <StyledButton onClick={() => history.push('/noi')}>
          <ArrowBackIcon className={classes.buttonIcon} />
          Back
        </StyledButton>
        <Typography variant='h5'  className={classes.title}>
          Confirm and Submit Notice of Intent
        </Typography>
        <div className={classes.helpTextWrapper}>
          <ChatBubbleOutlineIcon className={classes.helperIcon} />
          <Typography variant='body1'>
          Ensure that all of your locations are here and correct. You may also download a CSV version of your location list for your review. When you have confirmed that all of your locations are correct, please press the submit button.
          </Typography>
        </div>
        <Paper className={classes.box} variant='outlined'>
          <Typography className={classes.boxTitle} variant='subtitle1'>Business Locations</Typography>
          <div className={classes.actionsWrapper}>
            <Typography className={classes.tableRowCount} variant='body2'>You have {locations.filter((l: BusinessLocation) => !l.noi).length} retail locations</Typography>
            {
              outstanding.length
              ?
                <CSVLink
                  headers={Object.keys(BusinessLocationHeaders)}
                  data={outstanding?.map((l: BusinessLocation) => {
                      return [l.addressLine1, l.addressLine2, l.postal, l.city, l.email, l.phone, l.underage, l.health_authority, l.doingBusinessAs, l.manufacturing];
                    })
                  }
                  filename={'business_locations.csv'} className={classes.csvLink} target='_blank'>
                  <StyledButton variant='outlined'>
                    <SaveAltIcon className={classes.buttonIcon} />
                    Download CSV
                  </StyledButton>
                </CSVLink>
              : null
            }
          </div>
          <div style={{ overflowX: 'auto' }}>
            <StyledTable
              columns={[
                {title: 'Address 1', field: 'addressLine1'},
                {title: 'Address 2', field: 'addressLine2'},
                {title: 'Postal Code', field: 'postal'},
                {title: 'City', field: 'city'},
                {title: 'Business Phone', field: 'phone'},
                {title: 'Business email', field: 'email'},
                {title: 'Health Authority', field: 'health_authority'},
                {title: 'Doing Business As', field: 'doingBusinessAs'},
                {title: 'Minors Allowed', render: (rowData: IBusinessLocationValues) => rowData.underage === 'other' && rowData.underage_other ? `${rowData.underage_other}` : `${rowData.underage}`},
                {title: 'Manufacturing  Premises', field: 'manufacturing'}
              ]}
              data={outstanding}
            />
          </div>
        </Paper>
        <div className={classes.submitWrapper}>
          <StyledButton
            variant='contained'
            onClick={submit}
            disabled={!outstanding.length}
          >
            Submit
          </StyledButton>
        </div>
      </div>
      <StyledConfirmDialog
        open={isConfirmOpen}
        maxWidth='sm'
        dialogTitle="Confirm Your Submission and Acknowledge"
        checkboxLabel='I agree that the location information entered above is correct and wish to submit my Notice of Intent.'
        dialogMessage="You are about to submit notice of intent for all of your businesses' retail locations."
        setOpen={() => setOpenConfirm(false)}
        confirmHandler={confirmSubmit}
      />
    </>
  );
}
