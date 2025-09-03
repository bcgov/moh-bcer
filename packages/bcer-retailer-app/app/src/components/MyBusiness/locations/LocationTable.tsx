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
        maxColumnSort: 1,
      }}
      columns={[
        {
          title: 'Type of Location',
          field: 'location_type',
          render: LocationUtil.renderLocationType,
          maxColumnSort: 1,
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
          maxColumnSort: 1,
        },
        {
          title: 'Doing Business As',
          field: 'doingBusinessAs',
          render: LocationUtil.renderDoingBusinessAs,
          maxColumnSort: 1,
        },
        {
          title: 'Status',
          field: 'status',
          render: LocationUtil.renderStatus,
          maxColumnSort: 1,
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