import TableWrapper from '@/components/generic/TableWrapper';
import NoiTable from '@/components/Noi/NoiTable';
import { BusinessLocationHeaders } from '@/constants/localEnums';
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
      <NoiTable data={data} />
    </TableWrapper>
  );
}

export function SubmittedNoiTable({
  data,
  fullScreenProp,
  ...prop
}: TableProp) {
  const classes = useStyles();
  const history = useHistory();

  const tableAction = () => (
    <Typography variant="body1" className={classes.actionLink}>
      View
    </Typography>
  );
  return (
    <TableWrapper
      data={data}
      blockHeader={'Submitted Notice of Intent'}
      tableHeader={'Business Locations'}
      tableSubHeader={`You have ${data.length} retail locations`}
      csvProps={NoiUtil.getCsvProp(data, 'business_locations.csv')}
      fullScreenProp={fullScreenProp}
    >
      <NoiTable
        data={data}
        actions={[
          {
            icon: tableAction,
            onClick: (event: any, rowData: any) =>
              history.push(`/view-location/${rowData.id}`),
          },
        ]}
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
        }}
        onSelectionChange={handleSelection}
      />
    </TableWrapper>
  );
};
