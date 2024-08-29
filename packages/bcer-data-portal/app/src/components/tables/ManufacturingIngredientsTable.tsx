import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { StyledTable } from 'vaping-regulation-shared-components';
import { IngredientsRO } from '@/constants/localInterfaces';

const TableBox = styled(Paper)({
  border: 'solid 1px #CDCED2',
  borderRadius: '4px',
  padding: '1.4rem',
  boxShadow: 'none',
});

const BoxTitle = styled(Typography)({
  paddingBottom: '10px',
});

const ActionsWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  paddingBottom: '10px',
});

function ManufacturingIngredientsTable({
  ingredients,
}: {
  ingredients: IngredientsRO[];
}) {
  return (
    <Box>
      <TableBox variant="outlined">
        <BoxTitle variant="subtitle1">
          Ingredients
        </BoxTitle>
        <ActionsWrapper>
          <Typography variant="body2" sx={{ paddingBottom: '8px' }}>
            There are {ingredients?.length} submitted ingredients
          </Typography>
        </ActionsWrapper>
        <div>
          <StyledTable
            data={ingredients || []}
            columns={[
              {
                title: 'Name',
                field: 'name',
              },
              {
                title: 'Scientific Name',
                field: 'scientificName',
              },
              {
                title: 'Manufacturer Name',
                field: 'manufacturerName',
              },
              {
                title: 'Manufacturer Name',
                field: 'manufacturerName',
              },
            ]}
          />
        </div>
      </TableBox>
    </Box>
  );
}

export default ManufacturingIngredientsTable;