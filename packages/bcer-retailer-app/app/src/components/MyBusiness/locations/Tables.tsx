import React from 'react';
import { styled } from '@mui/material/styles';

import TableWrapper from '@/components/generic/TableWrapper';
import {
  BusinessLocation,
  GenericTableProp,
} from '@/constants/localInterfaces';
import { LocationUtil } from '@/utils/location.util';
import LocationTable from './LocationTable';
import { Box, Tooltip } from '@mui/material';
import { StyledButton } from 'vaping-regulation-shared-components';

const PREFIX = 'Tables';

const classes = {
  sendIcon: `${PREFIX}-sendIcon`,
  actionLink: `${PREFIX}-actionLink`
};

const StyledTableWrapper = styled(TableWrapper)({
  [`& .${classes.sendIcon}`]: {
    height: '24px',
    paddingRight: '4px',
  },
  [`& .${classes.actionLink}`]: {
    color: 'blue',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
});

interface TableProp extends GenericTableProp {
  data: Array<BusinessLocation>;
}

interface ExistingTableProp extends TableProp {
  handleAction: {
    handleEdit: Function;
    handleClose: Function;
    handleDelete: Function;
    handleView: Function;
  };
}

export function ExistingTable({
  data,
  fullScreenProp,
  handleAction,
  handleActionButton,
  ...props
}: ExistingTableProp) {


  return (
    <StyledTableWrapper
      data={data}
      blockHeader="Existing Business Locations"
      tableHeader="Existing Business Locations"
      tableSubHeader={`You have ${data.length} retail locations`}
      csvProps={LocationUtil.getCsvProp(data, 'business_existing_locations.csv')}
      fullScreenProp={fullScreenProp}
      tableButton={
        <Tooltip title="Update contact details for multiple locations at once">
          <Box>
            <StyledButton disabled={!data?.length} variant="contained" onClick={handleActionButton}>Multiple Contact Update</StyledButton>
          </Box>
        </Tooltip>
      }
    >
      <LocationTable data={data} handleAction={handleAction} />
    </StyledTableWrapper>
  );
}
