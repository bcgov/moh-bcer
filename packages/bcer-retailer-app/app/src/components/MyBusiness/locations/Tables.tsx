import React from 'react';
import { makeStyles } from '@material-ui/styles';

import TableWrapper from '@/components/generic/TableWrapper';
import {
  BusinessLocation,
  GenericTableProp,
} from '@/constants/localInterfaces';
import { LocationUtil } from '@/utils/location.util';
import LocationTable from './LocationTable';

const useStyles = makeStyles({
  sendIcon: {
    height: '24px',
    paddingRight: '4px',
  },
  actionLink: {
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
  };
}

export function ExistingTable({
  data,
  fullScreenProp,
  handleAction,
  ...props
}: ExistingTableProp) {
  const classes = useStyles();

  return (
    <TableWrapper
      data={data}
      blockHeader="Existing Business Locations"
      tableHeader="Existing Business Locations"
      tableSubHeader={`You have ${data.length} retail locations`}
      csvProps={LocationUtil.getCsvProp(data, 'business_existing_locations.csv')}
      fullScreenProp={fullScreenProp}
    >
      <LocationTable data={data} handleAction={handleAction} />
    </TableWrapper>
  );
}
