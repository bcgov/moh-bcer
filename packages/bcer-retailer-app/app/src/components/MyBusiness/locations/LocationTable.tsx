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
  };
  [s: string]: unknown;
}

function LocationTable({
  data,
  handleAction,
  ...props
}: LocationTableProps): JSX.Element {
  return (
    <StyledTable
      options={{
        fixedColumns: {
          right: 1,
        },
      }}
      columns={[
        {
          title: 'Address Line 1',
          render: LocationUtil.renderAddressLine1,
        },
        {
          title: 'City',
          render: LocationUtil.renderCity,
        },
        {
          title: 'Postal Code',
          render: LocationUtil.renderPostalCode,
        },
        {
          title: 'Doing Business As',
          render: LocationUtil.renderDoingBusinessAs,
        },
        {
          title: 'Status',
          render: LocationUtil.renderStatus,
        },
        {
          render: LocationUtil.renderActions(handleAction),
        },
      ]}
      data={data}
      {...props}
    />
  );
}

export default LocationTable;
