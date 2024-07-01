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
    //TODO
    //STH wrong with the StyledTable!!!!!!!!!!!!!!!!!!!!!!!!
    // <StyledTable
      // options={{
      //   fixedColumns: {
      //     right: 1,
      //   },
      //   maxColumnSort: 1,
      // }}
      // columns={[
      //   {
      //     title: 'Type of Location',
      //     render: LocationUtil.renderLocationType
      //   },
      //   {
      //     title: 'Address/URL',
      //     render: LocationUtil.renderFullAddress,
      //     maxColumnSort: 0
      //   },
      //   {
      //     title: 'Creation Date',
      //     render: LocationUtil.renderCreationDate,
      //     maxColumnSort: 0
      //   },
      //   {
      //     title: 'Doing Business As',
      //     render: LocationUtil.renderDoingBusinessAs,
      //     maxColumnSort: 0
      //   },
      //   {
      //     title: 'Status',
      //     field: 'status',
      //     render: LocationUtil.renderStatus,
      //   },
      //   {
      //     render: LocationUtil.renderActions(handleAction),
      //     maxColumnSort: 0
      //   },
      // ]}
      // data={data}
      // {...props}
    // />
    <></>
  );
}

export default LocationTable;
