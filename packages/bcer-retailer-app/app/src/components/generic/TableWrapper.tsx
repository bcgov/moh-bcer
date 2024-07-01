import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import React, { Children } from 'react';
import { CSVLink } from 'react-csv';
import { StyledButton } from 'vaping-regulation-shared-components';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

const classes = {
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
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  sendIcon: {
    height: '24px',
    paddingRight: '4px',
  },
};

interface TableWrapperProp {
  data: Array<any>;
  children: React.ReactNode;
  blockHeader?: string | React.ReactNode;
  tableHeader?: string | React.ReactNode;
  tableSubHeader?: string | React.ReactNode;
  tableButton?: React.ReactNode;
  csvProps?: CsvProps;
  fullScreenProp?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  isOutlined?: boolean;
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
  isOutlined = true,
}: TableWrapperProp) {

  function TableContainer ({children}: {children: React.ReactNode}) {
    if (!isOutlined) {
      return <Paper sx={{boxShadow: 'none'}}>{children}</Paper>
    } else {
      return <Paper sx={{boxShadow: 'none', border: 'solid 1px #CDCED2', borderRadius: '4px', padding: '1.4rem'}} variant="outlined" >{children}</Paper>
    }
  }

  return (
    <>
      {blockHeader && (
        <div style={classes.subtitleWrapper}>
          <Typography sx={classes.subtitle} variant="h6">
            {blockHeader}
          </Typography>
        </div>
      )}
      <TableContainer>
        <div style={classes.headerWrapper}>
          <div>
            {tableHeader && (
              <Typography sx={classes.boxTitle} variant="subtitle1">
                {tableHeader}
              </Typography>
            )}
            {tableSubHeader && (
              <Typography sx={classes.tableRowCount} variant="body2">
                {tableSubHeader}
              </Typography>
            )}
          </div>
          {!!data.length && tableButton ? (
            <div style={classes.buttonWrapper}>{tableButton}</div>
          ) : null}
        </div>
        <div style={classes.actionsWrapper}>
          {!!data.length && csvProps ? (
            <CSVLink {...csvProps} style={classes.csvLink} target="_blank">
              <StyledButton variant="table" size="small">
                <SaveAltIcon sx={classes.buttonIcon} />
                Download CSV
              </StyledButton>
            </CSVLink>
          ) : null}
          {!!data.length && fullScreenProp && !fullScreenProp[0] &&(
            <StyledButton variant="table" size="small" onClick={() => fullScreenProp[1](current => !current)}>
              <ZoomOutMapIcon sx={classes.buttonIcon} />
              View Fullscreen
            </StyledButton>
          )}
        </div>
        <div>{children}</div>
      </TableContainer>
    </>
  );
}

export default TableWrapper;
