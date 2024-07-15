import React from 'react';
import { BusinessLocation } from '@/constants/localInterfaces';
import { LocationUtil } from '@/utils/location.util';
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
          field: 'location_type',
          render: LocationUtil.renderLocationType,
          sorting: true,
        },
        {
          title: 'Address/URL',
          field: 'addressLine1',
          render: LocationUtil.renderFullAddress,
          sorting: false,
        },
        {
          title: 'Creation Date',
          field: 'createdAt',
          render: LocationUtil.renderCreationDate,
          sorting: true,
        },
        {
          title: 'Doing Business As',
          field: 'doingBusinessAs',
          render: LocationUtil.renderDoingBusinessAs,
          sorting: true,
        },
        {
          title: 'Status',
          field: 'status',
          render: LocationUtil.renderStatus,
          sorting: true,
        },
        {
          title: 'Actions',
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