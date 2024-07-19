import React from 'react';
import TableWrapper from '@/components/generic/TableWrapper';
import NoiTable from '@/components/Noi/NoiTable';
import { BusinessLocationHeaders, NoiStatus } from '@/constants/localEnums';
import { BusinessLocation, GenericTableProp } from '@/constants/localInterfaces';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import { NoiUtil } from '@/utils/noi.util';
import { getInitialPagination } from '@/utils/util';
import { StyledButton } from 'vaping-regulation-shared-components';

const StyledSendIcon = styled(SendIcon)({
  height: '24px',
  paddingRight: '4px',
});

interface TableProp extends GenericTableProp {
  data: Array<BusinessLocation & { tableData: { checked: boolean } }>;
}

interface OutstandingNoiTableProp extends TableProp {
  handleActionButton: React.MouseEventHandler<HTMLButtonElement>;
}

interface SubmitNoiTableProp extends TableProp {
  handleSelection: (rows: Array<BusinessLocation & { tableData: { checked: boolean } }>) => void;
}

interface SubmittedNoiTableProp extends TableProp {
  downloadAction: (location: BusinessLocation) => void;
}

export function OutstandingNoiTable({
  data,
  fullScreenProp,
  handleActionButton,
  ...props
}: OutstandingNoiTableProp) {
  return (
    <TableWrapper
      data={data}
      blockHeader="Outstanding Notice of Intent"
      tableHeader="Existing Business Locations"
      tableSubHeader={`You have ${data.length} retail locations that need a Notice of Intent`}
      tableButton={
        <StyledButton variant="contained" onClick={handleActionButton}>
          <StyledSendIcon />
          Submit Outstanding NOI
        </StyledButton>
      }
      csvProps={NoiUtil.getCsvProp(data, 'business_locations.csv')}
      fullScreenProp={fullScreenProp}
    >
      <NoiTable
        options={{
          pageSize: getInitialPagination(data),
          pageSizeOptions: [5, 10, 20, 30, 50],
        }}
        data={data}
      />
    </TableWrapper>
  );
}

export function SubmittedNoiTable({
  data,
  fullScreenProp,
  downloadAction,
  ...props
}: SubmittedNoiTableProp) {
  return (
    <TableWrapper
      data={data}
      blockHeader={'Submitted Notice of Intent'}
      tableHeader={'Business Locations'}
      tableSubHeader={`You have ${data.length} retail locations. You can download/print the Notice of Intent for your Active locations.`}
      csvProps={NoiUtil.getCsvProp(data, 'business_locations.csv')}
      fullScreenProp={fullScreenProp}
    >
      <NoiTable
        data={data}
        type={NoiStatus.Submitted}
        downloadAction={downloadAction}
        options={{
          fixedColumns: {
            right: 1,
          },
          pageSize: getInitialPagination(data),
          pageSizeOptions: [5, 10, 20, 30, 50],
        }}
      />
    </TableWrapper>
  );
}

export function NoiSubmissionTable({
  data,
  handleSelection,
  fullScreenProp,
  ...props
}: SubmitNoiTableProp) {
  return (
    <TableWrapper
      data={data}
      tableHeader={'Business Locations'}
      tableSubHeader={`You have ${data.length} retail locations`}
      fullScreenProp={fullScreenProp}
    >
      <NoiTable
        data={data}
        options={{
          selection: true,
          pageSize: getInitialPagination(data),
          pageSizeOptions: [5, 10, 20, 30, 50],
          selectionProps: (rowData: BusinessLocation & { tableData: { checked: boolean } }) => ({
            checked: rowData.tableData.checked,
          }),
        }}
        onSelectionChange={(rows: Array<BusinessLocation & { tableData: { checked: boolean } }>) => {
          handleSelection(rows);
        }}
      />
    </TableWrapper>
  );
}

export function NoiMissingSalesReportTable({
  data,
  fullScreenProp,
}: GenericTableProp) {
  return (
    <TableWrapper
      blockHeader={'NOI Renewal requiring Sales Report submission'}
      data={data}
      tableHeader={'Business Locations'}
      tableSubHeader={`You have ${data.length} locations that require a Sales Report before their NOI can be renewed.`}
      fullScreenProp={fullScreenProp}
    >
      <NoiTable data={data} />
    </TableWrapper>
  );
}