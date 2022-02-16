import { ReportStatus } from '@/constants/enums/genericEnums';
import {
  BusinessReportStatus,
  LocationRO,
} from '@/constants/interfaces/genericInterfaces';
import { BusinessDashBoardUtil } from '@/util/businessDashboard.util';
import { Box, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { StyledStatusMessage, StyledTable, StyledTextWithStatusIcon } from '..';

export type BusinessDashboardProps = {
  data: { locations: LocationRO[]; overview: BusinessReportStatus };
  loading?: boolean;
  showOverview?: boolean;
  showStatusMessage?: boolean;
  renderAddress: (l: Partial<LocationRO>) => React.ReactNode;
};

const useStyles = makeStyles(() => ({
  box: {
    border: 'solid 1px #CDCED2',
    borderRadius: '4px',
    padding: '1.4rem',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '17px',
  },
}));

export function BusinessDashboard({
  data,
  loading,
  showOverview = true,
  showStatusMessage = true,
  renderAddress,
}: BusinessDashboardProps) {
  const classes = useStyles();
  let outstanding: LocationRO[] = [];
  let completed: LocationRO[] = [];

  data?.locations?.forEach((l) => {
    if (
      l.reportStatus &&
      Object.values(l.reportStatus).includes(ReportStatus.Missing)
    ) {
      outstanding.push(l);
    } else {
      completed.push(l);
    }
  });
  return (
    <Box>
      {data && (
        <Box>
          {data?.overview?.incompleteReports?.length ? (
            <StyledStatusMessage status="error" message="Outstanding Reports" />
          ) : (
            <StyledStatusMessage
              status="success"
              message="No Outstanding Reports"
            />
          )}
        </Box>
      )}
      <Box pt={2} />
      {!!outstanding.length && (
        <Paper variant="outlined" className={classes.box}>
          <Box my={1}>
            <Typography className={classes.title}>
              Locations with outstanding reports
            </Typography>
          </Box>
          {data?.overview && showOverview && (
            <BusinessOverview data={data.overview} />
          )}
          <Box pt={2} />
          <LocationOutstandingReportTable
            renderAddress={renderAddress}
            data={outstanding}
          />
        </Paper>
      )}
      <Box pt={2} />
      {!!completed.length && (
        <Paper className={classes.box}>
          <Box my={1}>
            <Typography className={classes.title}>
              Locations with complete reports
            </Typography>
          </Box>
          <LocationCompletedReportTable
            renderAddress={renderAddress}
            data={completed}
          />
        </Paper>
      )}
    </Box>
  );
}

export function BusinessOverview({ data }: { data: BusinessReportStatus }) {
  return (
    <Box>
      <StyledTextWithStatusIcon
        text={
          <>
            <b>{data.missingNoi?.length ?? 'N/A'}</b> locations with outstanding
            Notice of Intent
          </>
        }
        success={!data.missingNoi?.length}
      />
      <StyledTextWithStatusIcon
        text={
          <>
            <b>{data.missingProductReport?.length ?? 'N/A'}</b> locations with
            outstanding Product Reports
          </>
        }
        success={!data.missingProductReport?.length}
      />
      <StyledTextWithStatusIcon
        text={
          <>
            <b>{data.missingManufacturingReport?.length ?? 'N/A'}</b> locations
            with outstanding Manufacturing Reports
          </>
        }
        success={!data.missingManufacturingReport?.length}
      />
      <StyledTextWithStatusIcon
        text={
          <>
            <b>{data.missingSalesReport?.length ?? 'N/A'}</b> locations with
            outstanding Sales Report
          </>
        }
        success={!data.missingSalesReport?.length}
      />
    </Box>
  );
}

export interface LocationReportTableProps {
  data: LocationRO[];
  renderAddress: (l: Partial<LocationRO>) => React.ReactNode;
}

export function LocationOutstandingReportTable({
  renderAddress,
  data,
}: LocationReportTableProps) {
  const columns = BusinessDashBoardUtil.getColumns(renderAddress);
  return <StyledTable columns={columns} data={data} />;
}

export function LocationCompletedReportTable({
  renderAddress,
  data,
}: LocationReportTableProps) {
  const columns = [
    {
      title: 'Location',
      render: renderAddress,
    },
  ];
  return <StyledTable columns={columns} data={data} />;
}
