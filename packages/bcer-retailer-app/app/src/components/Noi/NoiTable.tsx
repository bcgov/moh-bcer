import { NoiStatus } from '@/constants/localEnums';
import { BusinessLocation, TableColumn } from '@/constants/localInterfaces';
import { LocationUtil } from '@/utils/location.util';
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
    ...LocationUtil.getTableColumns(['locationType', 'address1', 'postal', 'doingBusinessAs']),
    {
      title: 'Status',
      render: NoiUtil.renderStatus,
    },
  ];
  if (type === NoiStatus.Submitted) {
    columns = [
      ...columns,
      {
        title: 'Submission/Renewal Date',
        render: NoiUtil.renderRenewalOrSubmissionDate,
      },
      {
        render: NoiUtil.renderAction(props?.downloadAction),
      },
    ];
  }
  return <StyledTable columns={columns} data={data} {...props} />;
}

export default NoiTable;
