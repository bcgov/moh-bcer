import React, { useEffect, useState } from 'react';
import { Box, Dialog, LinearProgress, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { StyledButton, StyledTable } from 'vaping-regulation-shared-components';
import { ManufacturesRO } from '@/constants/localInterfaces';
import { useAxiosGet } from '@/hooks/axios';
import useNetworkErrorMessage from '@/hooks/useNetworkErrorMessage';
import ManufacturingIngredientsTable from './ManufacturingIngredientsTable';

const DialogWrap = styled('div')({
  marginTop: '100px',
  padding: '1rem 1.5rem',
});

function LocationManufacturingTable({ locationId }: { locationId: string }) {
  const { showNetworkErrorMessage } = useNetworkErrorMessage();
  const [selectedManufactureReport, setSelectedManufactureReport] = useState<ManufacturesRO>();
  const [viewOpen, setViewOpen] = useState<boolean>(false);

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
  }, [error, showNetworkErrorMessage])

  return (
    <Box>
      <Typography variant="body2" sx={{ paddingBottom: '8px' }}>
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
            setViewOpen(false);
          }}
        >
          <DialogWrap>
            <ManufacturingIngredientsTable
              ingredients={selectedManufactureReport.ingredients}
            />
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

export default LocationManufacturingTable;