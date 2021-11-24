import { NoiStatus } from '@/constants/localEnums';
import { BusinessLocation, TableColumn } from '@/constants/localInterfaces';
import { NoiUtil } from '@/utils/noi.util';
import React from 'react';
import { StyledTable } from 'vaping-regulation-shared-components';

interface NoiTableProps {
  readonly data: ReadonlyArray<BusinessLocation>;
  type?: string;
  downloadAction?: Function;
  [s: string]: unknown;
}


function NoiTable({ data, type, ...props }: NoiTableProps): JSX.Element {
  let columns: Array<TableColumn> = [
    {
      title: 'Address Line 1',
      render: NoiUtil.renderAddressLine1,
      width: 200,
    },
    {
      title: 'City',
      render: NoiUtil.renderCity,
      width: 150,
    },
    {
      title: 'Postal Code',
      render: NoiUtil.renderPostalCode,
      width: 120,
    },
    {
      title: 'Doing Business As',
      render: NoiUtil.renderDoingBusinessAs,
      width: 200,
    },
    {
      title: 'Status',
      render: NoiUtil.renderStatus,
      width: 150,
    },
  ];
  if (type === NoiStatus.Submitted) {
    columns = [
      ...columns,
      {
        title: 'Submission/Renewal Date',
        render: NoiUtil.renderRenewalOrSubmissionDate,
        width: 200,
      },
      {
        title: 'Download/Print NOI',
        render: NoiUtil.renderAction(props?.downloadAction),
        width: 200,
      },
    ];
  }
  return <StyledTable columns={columns} data={data} {...props} />;
}

export default NoiTable;
