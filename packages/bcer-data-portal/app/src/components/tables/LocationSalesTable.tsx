import React, { useEffect, useRef, useState } from 'react';
import { Box, Dialog, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import moment from 'moment';
import { CSVLink } from 'react-csv';
import { StyledButton, StyledTable } from 'vaping-regulation-shared-components';
import { GroupedSalesRO, SalesRO } from '@/constants/localInterfaces';
import { useAxiosGet } from '@/hooks/axios';
import useNetworkErrorMessage from '@/hooks/useNetworkErrorMessage';

const CsvLink = styled(CSVLink)({
  textDecoration: 'none',
});

const BoxTitle = styled(Typography)({
  paddingBottom: '10px',
});

const ActionsWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  paddingBottom: '10px',
});

const TableBox = styled(Paper)({
  border: 'solid 1px #CDCED2',
  borderRadius: '4px',
  padding: '1.4rem',
  boxShadow: 'none',
});

const DialogWrap = styled('div')({
  marginTop: '100px',
  padding: '1rem 1.5rem',
});

function LocationSalesTable({ locationId, viewSales }: { locationId: string; viewSales: boolean }) {
  const [selectedSalesReport, setSelectedSalesReport] = useState<GroupedSalesRO>();
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const csvRef = useRef(null);
  const { showNetworkErrorMessage } = useNetworkErrorMessage();

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
    showNetworkErrorMessage(downloadError);
  }, [downloadError, showNetworkErrorMessage]);

  useEffect(() => {
    showNetworkErrorMessage(error);
  }, [error, showNetworkErrorMessage]);

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
      <Typography variant="body2" sx={{ paddingBottom: '8px' }}>
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
              viewSales ? (
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
              ) : null
            ),
          },
          {
            title: '',
            render: (salesReport: GroupedSalesRO) => (
              viewSales ? (
                <StyledButton
                  variant="table"
                  onClick={() => handleSalesSelect(salesReport)}
                >
                  View
                </StyledButton>
              ) : null
            ),
          },
        ]}
      />
      <CsvLink
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
        target="_blank"
      />
      {selectedSalesReport && (
        <Dialog
          fullScreen
          open={viewOpen}
          onClose={() => {
            setSelectedSalesReport(null);
            setViewOpen(false);
          }}
        >
          <DialogWrap>
            <TableBox variant="outlined">
              <BoxTitle variant="subtitle1">
                Reports
              </BoxTitle>
              <ActionsWrapper>
                <Typography variant="body2" sx={{ paddingBottom: '8px' }}>
                  There are {selectedSalesReport.reports.length} submitted
                  reports
                </Typography>
              </ActionsWrapper>
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
                      title: 'UPC',
                      field: 'productSold.upc',
                    },
                  ]}
                />
              </div>
            </TableBox>
            <Box>
              <StyledButton
                variant="outlined"
                onClick={() => setViewOpen(false)}
                sx={{ margin: '1rem 0' }}
              >
                Close
              </StyledButton>
            </Box>
          </DialogWrap>
        </Dialog>
      )}
    </Box>
  );
}

export default LocationSalesTable;