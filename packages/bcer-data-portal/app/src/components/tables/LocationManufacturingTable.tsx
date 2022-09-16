import { ManufacturesRO } from '@/constants/localInterfaces';
import { useAxiosGet } from '@/hooks/axios';
import useNetworkErrorMessage from '@/hooks/useNetworkErrorMessage';
import { Box, Dialog, LinearProgress, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect, useState } from 'react';
import { StyledButton, StyledTable } from 'vaping-regulation-shared-components';
import ManufacturingIngredientsTable from './ManufacturingIngredientsTable';

const useStyles = makeStyles(() => ({
  dialogWrap: {
    marginTop: '100px',
    padding: '1rem 1.5rem',
  },
}));

function LocationManufacturingTable({ locationId }: { locationId: string }) {
  const { showNetworkErrorMessage } = useNetworkErrorMessage();
  const classes = useStyles();
  const [selectedManufactureReport, setSelectedManufactureReport] = useState<ManufacturesRO>();
  const [viewOpen, setViewOpen] = useState<boolean>();

  const handleManufactureSelect = (manufactureReport: ManufacturesRO) => {
    setSelectedManufactureReport(manufactureReport);
    setViewOpen(true);
  };

  const [{ data, loading, error }, get] = useAxiosGet(
    `/data/location/get-location/${locationId}?includes=manufactures,manufactures.ingredients`,
    {
      manual: false,
    }
  );

  useEffect(() => {
    showNetworkErrorMessage(error)
  }, [])

  return (
    <Box>
      <Typography variant="body2" style={{ paddingBottom: '8px' }}>
        {data?.manufactures?.length} manufacturing reports submitted
      </Typography>
      {loading ? <LinearProgress /> : <Box pb={0.5} />}
      <StyledTable
        data={data?.manufactures || []}
        columns={[
          {
            title: 'Product',
            field: 'productName',
          },
          {
            title: '',
            render: (manufactureReport: ManufacturesRO) => (
              <StyledButton
                variant="table"
                onClick={() => handleManufactureSelect(manufactureReport)}
              >
                View
              </StyledButton>
            ),
          },
        ]}
      />

      {selectedManufactureReport && (
        <Dialog
          fullScreen
          open={viewOpen}
          onClose={() => {
            setSelectedManufactureReport(null);
            setViewOpen((open) => !open);
          }}
        >
          <div className={classes.dialogWrap}>
            <ManufacturingIngredientsTable
              ingredients={selectedManufactureReport.ingredients}
            />
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

export default LocationManufacturingTable;
