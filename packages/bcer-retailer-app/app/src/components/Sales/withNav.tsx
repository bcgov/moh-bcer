import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import {
  StyledButton,
  StyledConfirmDialog,
} from 'vaping-regulation-shared-components';
import { SalesReportContext } from '@/contexts/SalesReport';
import { formatError } from '@/utils/formatting';
import { useAxiosPost } from '@/hooks/axios';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { getSalesReportYear } from '@/utils/time';
import Loader from './Loader';

interface IProps {
  isAction?: boolean | Function;
  cancelRoute?: string;
  nextRoute?: string;
  confirmTitle?: string;
  confirmAction?: Function;
}

const useStyles = makeStyles({
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
  },

  footer: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
});

export default function withNav<P>({
  cancelRoute = '',
  nextRoute = '',
  isAction = true,
  confirmTitle,
  confirmAction,
}: IProps) {
  return function (WrappedComponent: React.ComponentType<P>) {
    const ComponentWithNav = (props: P) => {
      const classes = useStyles();
      const history = useHistory();
      const [sale, setSale] = useContext(SalesReportContext);

      const [{ response, loading: postLoading, error: postError }, post] =
        useAxiosPost(`/sales/${sale.submissionId}`, { manual: true });
      const [appGlobal, setAppGlobal] = useContext(AppGlobalContext);

      const confirmSubmit = async () => {
        try {
          await post();
          setSale({
            ...sale,
            fileData: undefined,
            saleReports: [],
            isConfirmOpen: false,
          });
          history.push('/sales/success');
        } catch (err) {
          console.log(err);
        }
      };

      useEffect(() => {
        if (postError) {
          setAppGlobal({
            ...appGlobal,
            networkErrorMessage: formatError(postError),
          });
        }
      }, [postError]);

      const Footer = () => {
        if (typeof isAction === 'function') {
          if (!isAction(sale, setSale)) {
            return null;
          }
        } else if (isAction === false) {
          return null;
        }

        return (
          <footer className={classes.footer}>
            <StyledButton
              variant="outlined"
              onClick={() => {
                history.goBack();
              }}
            >
              Back
            </StyledButton>
            <StyledButton
              variant="contained"
              onClick={() => {
                if (confirmAction) {
                  confirmAction(setSale);
                  return;
                }
                history.push(nextRoute);
              }}
            >
              {confirmTitle || 'Next'}
            </StyledButton>
          </footer>
        );
      };

      const periodYear = getSalesReportYear();

      return (
        <>
          <Loader
            open={postLoading}
            message="Submitting sales report. Please wait…"
          />
          <header>
            <StyledButton
              onClick={() => {
                setSale({
                  ...sale,
                  fileData: undefined,
                  saleReports: [],
                  isConfirmOpen: false,
                });
                history.push(cancelRoute);
              }}
            >
              <ArrowBackIcon className={classes.buttonIcon} />
              Cancel
            </StyledButton>
          </header>
          <main>
            <WrappedComponent {...props} />
          </main>
          <Footer />
          <StyledConfirmDialog
            open={sale?.isConfirmOpen}
            maxWidth="sm"
            dialogTitle="Confirm Your Submission and Acknowledge"
            checkboxLabel={`I confirm that I am submitting my sales report for all vapour products sold from this location for the
            reporting period of October 1, ${
              periodYear - 1
            } to September 30, ${periodYear}. I understand that if I submit a new Sales
            Report for this location, that all previously submitted Sales Reports for this location will be replaced.`}
            dialogMessage={`You are about to 
            ${sale.isSubmitted ? 'replace a previously submitted' : 'submit'}
            your sales report`}
            setOpen={() => setSale({ ...sale, isConfirmOpen: false })}
            confirmHandler={confirmSubmit}
            acceptDisabled={postLoading}
            cancelDisabled={postLoading}
          />
        </>
      );
    };
    return ComponentWithNav;
  };
}
