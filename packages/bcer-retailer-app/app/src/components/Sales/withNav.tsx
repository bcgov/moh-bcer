import React, { useContext, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {
  StyledButton,
  StyledConfirmDialog,
} from 'vaping-regulation-shared-components';
import { SalesReportContext } from '@/contexts/SalesReport';
import { ErrorMessageFormat, formatError } from '@/utils/formatting';
import { useAxiosPost } from '@/hooks/axios';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { getSalesReportYear } from '@/utils/time';
import Loader from './Loader';
import { ApiOperation } from '@/constants/localEnums';

const PREFIX = 'withNav';

const classes = {
  buttonIcon: `${PREFIX}-buttonIcon`,
  footer: `${PREFIX}-footer`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')({
  [`& .${classes.buttonIcon}`]: {
    paddingRight: '5px',
    color: '#285CBC',
  },

  [`& .${classes.footer}`]: {
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
});

interface IProps {
  isAction?: boolean | Function;
  cancelRoute?: string;
  nextRoute?: string;
  confirmTitle?: string;
  confirmAction?: Function;
}

export default function withNav<P>({
  cancelRoute = '',
  nextRoute = '',
  isAction = true,
  confirmTitle,
  confirmAction,
}: IProps) {
  return function (WrappedComponent: React.ComponentType<P>) {
    const ComponentWithNav = (props: P) => {

      const navigate = useNavigate();
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
          navigate('/sales/success');
        } catch (err) {
          console.log(err);
        }
      };

      useEffect(() => {
        if (postError) {
          setAppGlobal({
            ...appGlobal,
            networkErrorMessage: ErrorMessageFormat.salesError(postError),
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
                navigate(-1);
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
                navigate(nextRoute);
              }}
            >
              {confirmTitle || 'Next'}
            </StyledButton>
          </footer>
        );
      };

      const periodYear = getSalesReportYear();

      return (
        (<Root>
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
                navigate(cancelRoute);
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
        </Root>)
      );
    };
    return ComponentWithNav;
  };
}
