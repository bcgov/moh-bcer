import React, { useState, useContext, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import {
  makeStyles,
  createStyles,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core';

import {
  StyledDialog,
  StyledHeaderMapper,
  mapToObject,
} from 'vaping-regulation-shared-components';

import {
  SalesReportCSVHeaders,
  SalesReportDTOHeaders,
} from '@/constants/localEnums';

import UploadArea from '@/components/form/UploadArea';
import { useAxiosPatch } from '@/hooks/axios';
import { AppGlobalContext } from '@/contexts/AppGlobal';
import { formatError } from '@/utils/formatting';
import withNav from '@/components/Sales/withNav';
import { SalesReportContext } from '@/contexts/SalesReport';
import ReplaceWarning from '@/components/Sales/ReplaceWarning';
import Loader from '@/components/Sales/Loader';

const useStyles = makeStyles(
  (
    theme // TODO: grab any color data from theme once implemented
  ) =>
    createStyles({
      title: {
        color: '#002C71',
        fontSize: '27px',
        fontWeight: 600,
        padding: '30px 0px 20px 0px ',
      },
      description: {
        color: '#0053A4',
        fontSize: '20px',
        fontWeight: 600,
        paddingBottom: '30px',
      },
      box: {
        display: 'flex',
        padding: '20px',
        borderRadius: '10px',
        border: '1px solid #CDCED2',
        backgroundColor: '#fff',
        marginBottom: '20px',
      },
      boxTitle: {
        fontSize: '17px',
        fontWeight: 600,
        lineHeight: '22px',
      },
      boxDescription: {
        fontSize: '16px',
        color: '#3A3A3A',
        lineHeight: '20px',
      },
      radioGroup: {
        width: '50px',
      },
      boxHeader: {
        width: '100%',
        display: 'inline-flex',
        margin: '5px 0px 5px 0px',
      },
      textWrapper: {
        paddingBottom: '20px',
      },
      linkWrapper: {
        textDecorationColor: '#1E5DB1',
      },
      linkText: {
        display: 'inline',
        color: '#1E5DB1',
      },
      boxContent: {
        display: 'block',
        width: '100%',
      },
      dialogTitle: {
        size: '20px',
        color: '#0053A4',
        borderBottom: '1px solid #CCCCCC',
        padding: '0px 0px 16px 0px',
        margin: '16px 24px 0px 24px',
      },
    })
);

function SaleUplad() {
  const classes = useStyles({}); // TODO: add theme from MUI

  const [providedHeaders, setProvidedHeaders] = useState([]);
  const [confirmDialogOpen, setConfirmOpen] = useState<boolean>(false);
  const [mapping, setMapping] = useState<{ [key: string]: string }>();
  const [sale, setSale] = useContext(SalesReportContext);
  const [
    { error: mapError, loading: mappedLoading, data: mappedSubmission },
    patch,
  ] = useAxiosPatch(`/submission/:id/map`, { manual: true });

  const [appGlobal, setAppGlobalContext] = useContext(AppGlobalContext);

  useEffect(() => {
    if (mapping !== undefined) {
      (async () => {
        await patch({
          url: `/submission/${sale.submissionId}/map`,
          data: {
            data: {
              ...sale,
              // saleReports: sale.saleReports,
              mapping,
            },
          },
        });
      })();
    }
  }, [mapping]);

  useEffect(() => {
    if (mappedSubmission && !mapError) {
      setSale({
        ...sale,
        saleReports: mappedSubmission.data.saleReports,
      });
    }
  }, [mappedSubmission]);

  useEffect(() => {
    if (mapError) {
      setAppGlobalContext({
        ...appGlobal,
        networkErrorMessage: formatError(mapError),
      });
    }
  }, [mapError]);

  const handleUpload = (data: any | null) => {
    if (data) {
      const { saleReports, submissionId, headers } = data;
      if (Object.keys(SalesReportCSVHeaders).every( header => headers.includes(header))) {\
        setMapping(SalesReportDTOHeaders)
        setSale({
          ...sale,
          saleReports,
          submissionId,
        });
      } else {
        setSale({
          ...sale,
          saleReports,
          submissionId,
        });
        setProvidedHeaders(headers);
      }
    } else {
      setProvidedHeaders(null);
      setMapping(undefined);
    }
  };

  const confirmResetValues = () => {
    setSale({
      ...sale,
    });
    setProvidedHeaders(null);
    setConfirmOpen(false);
  };

  const handleUpdateHeaders = (values: SalesReportCSVHeaders) => {
    setMapping(mapToObject(SalesReportDTOHeaders, values));
  };

  return (
    <>
      <div>
        <Loader open={mappedLoading} message="File processing. Please wait…" />
        <div className={classes.title}>
          {sale.isSubmitted ? 'Replace' : 'Upload'} Sales Report for location
        </div>
        <div
          className={classes.description}
        >{`${sale?.doingBusinessAs}, ${sale?.address}`}</div>

        <div className={classes.box}>
          <div className={classes.boxContent}>
            <div className={classes.boxHeader}>
              <div className={classes.textWrapper}>
                <div className={classes.boxTitle}>Upload Sales Report </div>
                <div className={classes.boxDescription}>
                  If you already have an existing file, you can upload here and
                  then matching the heading to match the report requirements.
                </div>
                <div>
                  <CSVLink
                    className={classes.linkWrapper}
                    headers={Object.keys(SalesReportCSVHeaders)}
                    data={[]}
                    filename="vaping-reg-sales-report.csv"
                  >
                    <div className={classes.linkText}>
                      (Download Sales Report CSV template)
                    </div>
                  </CSVLink>
                </div>
                {sale.isSubmitted ? (
                  <ReplaceWarning
                    content={
                      <p>
                        You are choosing to update the Sales Report for this
                        location. This will replace all information that was
                        previously submitted for this reporting period. Please
                        ensure that you are uploading all sales for this
                        location.
                      </p>
                    }
                  />
                ) : null}
              </div>
            </div>

            <div>
              <div className={classes.boxTitle}>
                1. Upload file from your device
              </div>
              <UploadArea
                actionText={'Drag your Sales Report here'}
                endpoint={`/upload/sales-report/${sale.submissionId}`}
                handleUpload={handleUpload}
              />

              {providedHeaders?.length && !mapping ? (
                <Dialog
                  open={providedHeaders?.length && !mapping ? true : false}
                >
                  <DialogTitle className={classes.dialogTitle}>
                    Map Your Provided CSV Headers
                  </DialogTitle>
                  <DialogContent>
                    <StyledHeaderMapper
                      requiredHeaders={SalesReportCSVHeaders}
                      providedHeaders={providedHeaders}
                      updateMapCallback={handleUpdateHeaders}
                      cancelHandler={() => handleUpload(null)}
                    />
                  </DialogContent>
                </Dialog>
              ) : null}
            </div>
          </div>
        </div>

        {confirmDialogOpen ? (
          <StyledDialog
            open={confirmDialogOpen}
            title="Information will be lost"
            maxWidth="xs"
            cancelButtonText="Cancel"
            acceptButtonText="Yes"
            cancelHandler={() => setConfirmOpen(false)}
            acceptHandler={() => confirmResetValues()}
          >
            If you change the upload method now, you will lose all newly added
            locations.
          </StyledDialog>
        ) : null}
      </div>
    </>
  );
}

export default withNav({
  cancelRoute: '/sales',
  isAction: (sale: SalesReportContext) =>
    sale?.fileData !== undefined && sale?.saleReports?.length > 0,
  nextRoute: '/sales/review',
})(SaleUplad);
