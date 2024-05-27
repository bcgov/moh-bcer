import { makeStyles, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { CSVLink } from 'react-csv';
import { StyledButton } from 'vaping-regulation-shared-components';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

const PREFIX = 'TableWrapper';

const classes = {
  subtitleWrapper: `${PREFIX}-subtitleWrapper`,
  subtitle: `${PREFIX}-subtitle`,
  boxTitle: `${PREFIX}-boxTitle`,
  tableRowCount: `${PREFIX}-tableRowCount`,
  actionsWrapper: `${PREFIX}-actionsWrapper`,
  headerWrapper: `${PREFIX}-headerWrapper`,
  csvLink: `${PREFIX}-csvLink`,
  buttonIcon: `${PREFIX}-buttonIcon`,
  box: `${PREFIX}-box`,
  buttonWrapper: `${PREFIX}-buttonWrapper`,
  sendIcon: `${PREFIX}-sendIcon`
};

const Root = styled('div')({
  [`& .${classes.subtitleWrapper}`]: {
    display: 'flex',
    alignItems: 'bottom',
    justifyContent: 'space-between',
    padding: '30px 0px 10px 0px',
  },
  [`& .${classes.subtitle}`]: {
    color: '#0053A4',
  },
  [`& .${classes.boxTitle}`]: {
    paddingBottom: '10px',
  },
  [`& .${classes.tableRowCount}`]: {
    paddingBottom: '10px',
  },
  [`& .${classes.actionsWrapper}`]: {
    display: 'flex',
    paddingBottom: '10px',
  },
  [`& .${classes.headerWrapper}`]: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  [`& .${classes.csvLink}`]: {
    textDecoration: 'none',
    marginRight: '10px',
  },
  [`& .${classes.buttonIcon}`]: {
    paddingRight: '5px',
    color: '#285CBC',
    fontSize: '20px',
  },
  [`& .${classes.box}`]: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
  },
  [`& .${classes.buttonWrapper}`]: {
    display: 'flex',
    alignItems: 'center',
  },
  [`& .${classes.sendIcon}`]: {
    height: '24px',
    paddingRight: '4px',
  },
});

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
      return <Paper style={{boxShadow: 'none'}} >{children}</Paper>
    } else {
      return <Paper style={{boxShadow: 'none'}} variant="outlined" className={classes.box}>{children}</Paper>
    }
  }

  return (
    <Root>
      {blockHeader && (
        <div className={classes.subtitleWrapper}>
          <Typography className={classes.subtitle} variant="h6">
            {blockHeader}
          </Typography>
        </div>
      )}
      <TableContainer>
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
      </TableContainer>
    </Root>
  );
}

export default TableWrapper;
