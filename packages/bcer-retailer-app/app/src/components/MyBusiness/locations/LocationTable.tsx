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
          title: 'Type of Location',
          render: LocationUtil.renderLocationType
        },
        {
          title: 'Address/URL',
          render: LocationUtil.renderFullAddress,
          sorting: false
        },
        {
          title: 'Creation Date',
          render: LocationUtil.renderCreationDate,
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
