import { GroupedSalesRO, SalesRO } from '@/constants/localInterfaces';
import { useAxiosGet } from '@/hooks/axios';
import useNetworkErrorMessage from '@/hooks/useNetworkErrorMessage';
import { Box, Dialog, makeStyles, Paper, Typography } from '@material-ui/core';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { StyledButton, StyledTable } from 'vaping-regulation-shared-components';

const useStyles = makeStyles(() => ({
  csvLink: {
    textDecoration: 'none',
  },
  boxTitle: {
    paddingBottom: '10px',
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px',
  },
  tableBox: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
    boxShadow: 'none',
  },
  dialogWrap: {
    marginTop: '100px',
    padding: '1rem 1.5rem',
  },
}));

function LocationSalesTable({ locationId }: { locationId: string }) {
  const [selectedSalesReport, setSelectedSalesReport] = useState<GroupedSalesRO>();
  const [viewOpen, setViewOpen] = useState<boolean>();
  const csvRef = useRef(null);
  const { showNetworkErrorMessage } = useNetworkErrorMessage();

  const classes = useStyles();

  const [{ data, loading, error }, get] = useAxiosGet(
    `/data/location/get-location/${locationId}?includes=sales,sales.product,sales.productSold`,
    {
      manual: false,
    }
  );

  const [
    { data: download = [], loading: downloadLoading, error: downloadError },
    getDownload,
  ] = useAxiosGet(`/data/location/download/`, { manual: true });

  useEffect(() => {
    showNetworkErrorMessage(downloadError)
  }, [downloadError])

  useEffect(() => {
    showNetworkErrorMessage(error)
  }, [error]);
  

  const handleSalesSelect = (salesReport: GroupedSalesRO) => {
    setSelectedSalesReport(salesReport);
    setViewOpen(true);
  };

  const yeildGroupedSalesArray = (salesReports: Array<any>) => {
    const grouped = salesReports.reduce((group, report) => {
      const { year } = report;
      const groupIndex = group.findIndex(
        (element: any) => element.year === year
      );
      groupIndex === -1
        ? group.push({
            year: report.year,
            submissionDate: moment(report.created_at).format('YYYY-MM-DD'),
            reports: [report],
          })
        : group[groupIndex].reports.push(report);

      return group;
    }, []);
    return grouped;
  };

  return (
    <Box>
      <Typography variant="body2" style={{ paddingBottom: '8px' }}>
        {data?.sales?.length || 0} sales reports submitted
      </Typography>
      <StyledTable
        data={yeildGroupedSalesArray(data?.sales || [])}
        columns={[
          {
            title: 'Reporting Year',
            field: 'year',
          },
          {
            title: 'Submission Date',
            field: 'submissionDate',
          },
          {
            title: '',
            render: (salesReport: SalesRO) => (
              <StyledButton
                variant="small-outlined"
                onClick={async () => {
                  await getDownload({
                    url: `/data/location/download?locationId=${data.id}&year=${salesReport.year}`,
                  });
                  csvRef.current.link.click();
                }}
              >
                Download
              </StyledButton>
            ),
          },
          {
            title: '',
            render: (salesReport: GroupedSalesRO) => (
              <StyledButton
                variant="table"
                onClick={() => handleSalesSelect(salesReport)}
              >
                View
              </StyledButton>
            ),
          },
        ]}
      />
      <CSVLink
        ref={csvRef}
        headers={[
          'Brand Name',
          'Product Name',
          'Concentration (mg/mL) (optional)',
          'Container Capacity',
          'Cartridge Capacity',
          'Flavour',
          'UPC (optional)',
          'Number of Containers Sold',
          'Number of Cartridges Sold',
        ]}
        data={download}
        filename={`sales_report_${data?.doingBusinessAs}.csv`}
        className={classes.csvLink}
        target="_blank"
      />
      {selectedSalesReport && (
        <Dialog
          fullScreen
          open={viewOpen}
          onClose={() => {
            setSelectedSalesReport(null);
            setViewOpen((open) => !open);
          }}
        >
          <div className={classes.dialogWrap}>
            <Paper variant="outlined" className={classes.tableBox}>
              <Typography className={classes.boxTitle} variant="subtitle1">
                Reports
              </Typography>
              <div className={classes.actionsWrapper}>
                <Typography style={{ paddingBottom: '8px' }} variant="body2">
                  There are {selectedSalesReport.reports.length} submitted
                  reports
                </Typography>
              </div>
              <div>
                <StyledTable
                  data={selectedSalesReport.reports}
                  columns={[
                    {
                      title: 'Product Name',
                      field: 'productSold.productName',
                    },
                    {
                      title: 'Cartridges',
                      field: 'cartridges',
                    },
                    {
                      title: 'Containers',
                      field: 'containers',
                    },
                    {
                      title: 'Containers',
                      field: 'containers',
                    },
                    {
                      title: 'UPC',
                      field: 'productSold.upc',
                    },
                  ]}
                />
              </div>
            </Paper>
            <div>
              <StyledButton
                variant="outlined"
                onClick={() => setViewOpen(false)}
                style={{ margin: '1rem 0' }}
              >
                Close
              </StyledButton>
            </div>
          </div>
        </Dialog>
      )}
    </Box>
  );
}

export default LocationSalesTable;
