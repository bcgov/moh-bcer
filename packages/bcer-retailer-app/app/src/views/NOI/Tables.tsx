import TableWrapper from '@/components/generic/TableWrapper';
import NoiTable from '@/components/Noi/NoiTable';
import { BusinessLocationHeaders, NoiStatus } from '@/constants/localEnums';
import {
  BusinessLocation,
  GenericTableProp,
} from '@/constants/localInterfaces';
import React from 'react';
import { useHistory } from 'react-router';
import { StyledButton } from 'vaping-regulation-shared-components';
import SendIcon from '@material-ui/icons/Send';
import { makeStyles } from '@material-ui/styles';
import { NoiUtil } from '@/utils/noi.util';
import { Typography } from '@material-ui/core';
import { getInitialPagination } from '@/utils/util';

const useStyles = makeStyles({
  sendIcon: {
    height: '24px',
    paddingRight: '4px',
  },
  actionLink: {
    color: 'blue',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
});

interface TableProp extends GenericTableProp {
  data: Array<BusinessLocation>;
}

interface OutstandingNoiTableProp extends TableProp {
    handleActionButton: Function;
}

interface SubmitNoiTableProp extends TableProp {
    handleSelection: Function; 
}

interface SubmittedNoiTableProp extends TableProp {
    downloadAction: Function;
}

export function OutstandingNoiTable({
  data,
  fullScreenProp,
  handleActionButton,
  ...props
}: OutstandingNoiTableProp) {
  const classes = useStyles();
  
  return (
    <TableWrapper
      data={data}
      blockHeader="Outstanding Notice of Intent"
      tableHeader="Existing Business Locations"
      tableSubHeader={`You have ${data.length} retail locations that need a Notice of Intent`}
      tableButton={
        <StyledButton variant="contained" onClick={handleActionButton}>
          <SendIcon className={classes.sendIcon} />
          Submit Outstanding NOI
        </StyledButton>
      }
      csvProps={NoiUtil.getCsvProp(data, 'business_locations.csv')}
      fullScreenProp={fullScreenProp}
    >
      <NoiTable 
        options={{
          pageSize: getInitialPagination(data),
          pageSizeOptions: [5, 10, 20, 30, 50]
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
  ...prop
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
          pageSizeOptions: [5, 10, 20, 30, 50]
        }}
      />
    </TableWrapper>
  );
};

export function NoiSubmissionTable({
  data,
  handleSelection,
  fullScreenProp,
  ...props
}: SubmitNoiTableProp){

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
          pageSizeOptions: [5, 10, 20, 30, 50]
        }}
        onSelectionChange={handleSelection}
      />
    </TableWrapper>
  );
};

export function NoiMissingSalesReportTable({
  data,
  fullScreenProp,
}: GenericTableProp){
  return (
    <TableWrapper
      blockHeader={'NOI Renewal requiring Sales Report submission'}
      data={data}
      tableHeader={'Business Locations'}
      tableSubHeader={`You have ${data.length} locations that require a Sales Report before their NOI can be renewed.`}
      fullScreenProp={fullScreenProp}
    >
      <NoiTable 
        data={data}
      />
    </TableWrapper>
  )
}
