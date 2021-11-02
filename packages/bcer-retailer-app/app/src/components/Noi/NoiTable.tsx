import { NoiStatus } from '@/constants/localEnums';
import { BusinessLocation } from '@/constants/localInterfaces';
import { NoiUtil } from '@/utils/noi.util';
import React from 'react';
import { StyledTable } from 'vaping-regulation-shared-components';

interface NoiTableProps {
  readonly data: ReadonlyArray<BusinessLocation>;
  type?: string;
  [s: string]: unknown;
}

function NoiTable({ data, type, ...props }: NoiTableProps): JSX.Element {
  let columns=[
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
  ]
  if(type === NoiStatus.Submitted){
    columns =[ ...columns, {
      title: 'Submission/Renewal Date',
      render: NoiUtil.renderRenewalOrSubmissionDate,
    }]
  }
  return (
    <StyledTable
      columns={columns}
      data={data}
      {...props}
    />
  );
}

export default NoiTable;
