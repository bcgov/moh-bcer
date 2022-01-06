import { BusinessLocation } from '@/constants/localInterfaces';
import { LocationUtil } from '@/utils/location.util';
import React from 'react';
import { StyledTable } from 'vaping-regulation-shared-components';

interface LocationTableProps {
  readonly data: ReadonlyArray<BusinessLocation>;
  handleAction: {
    handleEdit: Function;
    handleClose: Function;
    handleDelete: Function;
    handleView: Function;
  };
  [s: string]: unknown;
}

function LocationTable({
  data,
  handleAction,
  handleView,
  ...props
}: LocationTableProps): JSX.Element {
  return (
    <StyledTable
      options={{
        fixedColumns: {
          right: 1,
        },
        sorting: true,
      }}
      columns={[
        {
          title: 'Address Line 1',
          render: LocationUtil.renderAddressLine1,
          sorting: false
        },
        {
          title: 'City',
          field: 'city',
          defaultSort: 'DESC'
        },
        {
          title: 'Postal Code',
          render: LocationUtil.renderPostalCode,
          sorting: false,
        },
        {
          title: 'Doing Business As',
          render: LocationUtil.renderDoingBusinessAs,
          sorting: false,
        },
        {
          title: 'Status',
          field: 'status',
          render: LocationUtil.renderStatus,
        },
        {
          render: LocationUtil.renderActions(handleAction),
          sorting: false,
        },
      ]}
      data={data}
      {...props}
    />
  );
}

export default LocationTable;
