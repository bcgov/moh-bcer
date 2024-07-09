import React from 'react';
import { BusinessLocation } from '@/constants/localInterfaces';
import { LocationUtil } from '@/utils/location.util';
import { StyledTable } from 'vaping-regulation-shared-components';
import { nanoid } from 'nanoid'; //generating random IDs

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
          render: (rowData: BusinessLocation) => (
            <div key={nanoid()}>{LocationUtil.renderLocationType(rowData)}</div>
          )
        },
        {
          title: 'Address/URL',
          render: (rowData: BusinessLocation) => (
            <div key={nanoid()}>{LocationUtil.renderFullAddress(rowData)}</div>
          ),
          maxColumnSort: 0,
        },
        {
          title: 'Creation Date',
          render: (rowData: BusinessLocation) => (
            <div key={nanoid()}>{LocationUtil.renderCreationDate(rowData)}</div>
          ),
          maxColumnSort: 0,
        },
        {
          title: 'Doing Business As',
          render: (rowData: BusinessLocation) => (
            <div key={nanoid()}>{LocationUtil.renderDoingBusinessAs(rowData)}</div>
          ),
          maxColumnSort: 0,
        },
        {
          title: 'Status',
          field: 'status',
          render: (rowData: BusinessLocation) => (
            <div key={nanoid()}>{LocationUtil.renderStatus(rowData)}</div>
          ),
        },
        {
          render: (rowData: BusinessLocation) => (
            <div key={nanoid()}>{LocationUtil.renderActions(handleAction)(rowData)}</div>
          ),
          maxColumnSort: 0,
        },
      ]}
      data={data}
      {...props}
    />
  );
}

export default LocationTable;