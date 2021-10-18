import { BusinessLocation } from '@/constants/localInterfaces';
import { NoiUtil } from '@/utils/noi.util';
import React from 'react';
import { StyledTable } from 'vaping-regulation-shared-components';

interface NoiTableProps {
  readonly data: ReadonlyArray<BusinessLocation>;
  [s: string]: unknown
}

function NoiTable({ data, ...props }: NoiTableProps): JSX.Element {
  return (
    <StyledTable
      columns={[
        {
          title: 'Address Line 1',
          render: NoiUtil.renderAddressLine1,
        },
        {
          title: 'City',
          render: NoiUtil.renderCity,
        },
        {
          title: 'Postal Code',
          render: NoiUtil.renderPostalCode,
        },
        {
          title: 'Doing Business As',
          render: NoiUtil.renderDoingBusinessAs,
        },
        {
          title: 'Status',
          render: NoiUtil.renderStatus,
        },
      ]}
      data={data}
      {...props}
    />
  );
}

export default NoiTable;
