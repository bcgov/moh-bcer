import { BusinessLocationHeaders } from '@/constants/localEnums';
import { BusinessLocation } from '@/constants/localInterfaces';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { CSVLink } from 'react-csv';
import { StyledButton } from 'vaping-regulation-shared-components';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import NoiTable from '@/components/Noi/NoiTable';
import SendIcon from '@material-ui/icons/Send';
import { useHistory } from 'react-router';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';

const useStyles = makeStyles({
  subtitleWrapper: {
    display: 'flex',
    alignItems: 'bottom',
    justifyContent: 'space-between',
    padding: '30px 0px 10px 0px',
  },
  subtitle: {
    color: '#0053A4',
  },
  boxTitle: {
    paddingBottom: '10px',
  },
  tableRowCount: {
    paddingBottom: '10px',
  },
  actionsWrapper: {
    display: 'flex',
    paddingBottom: '10px',
  },
  headerWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  csvLink: {
    textDecoration: 'none',
    marginRight: '10px',
  },
  buttonIcon: {
    paddingRight: '5px',
    color: '#285CBC',
    fontSize: '20px',
  },
  box: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  sendIcon: {
    height: '24px',
    paddingRight: '4px',
  },
});

interface TableWrapperProp {
  data: Array<any>;
  children: React.ReactNode;
  blockHeader?: string;
  tableHeader?: string;
  tableSubHeader?: string;
  tableButton?: React.ReactNode;
  csvProps?: CsvProps;
  fullScreenProp?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

interface CsvProps {
  data: Array<any>;
  headers: Array<string>;
  filename: string;
}

function TableWrapper({
  data,
  children,
  blockHeader,
  tableHeader,
  tableSubHeader,
  tableButton,
  csvProps,
  fullScreenProp,
}: TableWrapperProp) {
  const classes = useStyles();
  const history = useHistory();
  return (
    <div>
      {blockHeader && (
        <div className={classes.subtitleWrapper}>
          <Typography className={classes.subtitle} variant="h6">
            {blockHeader}
          </Typography>
        </div>
      )}
      <Paper variant="outlined" className={classes.box}>
        <div className={classes.headerWrapper}>
          <div>
            {tableHeader && (
              <Typography className={classes.boxTitle} variant="subtitle1">
                {tableHeader}
              </Typography>
            )}
            {tableSubHeader && (
              <Typography className={classes.tableRowCount} variant="body2">
                {tableSubHeader}
              </Typography>
            )}
          </div>
          {!!data.length && tableButton ? (
            <div className={classes.buttonWrapper}>{tableButton}</div>
          ) : null}
        </div>
        <div className={classes.actionsWrapper}>
          {!!data.length && csvProps ? (
            <CSVLink {...csvProps} className={classes.csvLink} target="_blank">
              <StyledButton variant="table" size="small">
                <SaveAltIcon className={classes.buttonIcon} />
                Download CSV
              </StyledButton>
            </CSVLink>
          ) : null}
          {!!data.length && fullScreenProp && !fullScreenProp[0] &&(
            <StyledButton variant="table" size="small" onClick={() => fullScreenProp[1](current => !current)}>
              <ZoomOutMapIcon className={classes.buttonIcon} />
              View Fullscreen
            </StyledButton>
          )}
        </div>
        <div>{children}</div>
      </Paper>
    </div>
  );
}

export default TableWrapper;
