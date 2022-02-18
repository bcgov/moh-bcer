import { IngredientsRO } from '@/constants/localInterfaces';
import { Box, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { StyledTable } from 'vaping-regulation-shared-components';

const useStyles = makeStyles(() => ({
  tableBox: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
    boxShadow: 'none',
  },
  boxTitle: {
    paddingBottom: '10px',
  },
  actionsWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: '10px',
  },
}));

function ManufacturingIngredientsTable({
  ingredients,
}: {
  ingredients: IngredientsRO[];
}) {
  const classes = useStyles();
  return (
    <Box>
      <Paper variant="outlined" className={classes.tableBox}>
        <Typography className={classes.boxTitle} variant="subtitle1">
          Ingredients
        </Typography>
        <div className={classes.actionsWrapper}>
          <Typography style={{ paddingBottom: '8px' }} variant="body2">
            There are {ingredients?.length} submitted ingredients
          </Typography>
        </div>
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
      </Paper>
    </Box>
  );
}

export default ManufacturingIngredientsTable;
