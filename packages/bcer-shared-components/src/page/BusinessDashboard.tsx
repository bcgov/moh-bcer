import { ReportStatus } from '@/constants/enums/genericEnums';
import {
  BusinessReportStatus,
  LocationReportStatus,
  LocationRO,
} from '@/constants/interfaces/genericInterfaces';
import { BusinessDashboardUtil } from '@/util/businessDashboard.util';
import { Box, LinearProgress, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { StyledStatusMessage, StyledTable, StyledTextWithStatusIcon } from '..';

export type BusinessDashboardProps = {
  data: { locations: LocationRO[]; overview: BusinessReportStatus };
  loading?: boolean;
  showOverview?: boolean;
  showStatusMessage?: boolean;
  isRetailerPortal?: boolean;
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
  retailerLegend: {
    display: 'flex',
    border: '1px solid #CDCED2',
    borderRadius: '4px',
    padding: '12px 18px'
  },
  legendTitle: {
    fontWeight: 600
  },
  legendItem: {
    display: 'flex',
    paddingLeft: '30px',
    color: '#333333',
    fontSize: '14px'
  },
  retailerText: {
    fontSize: '16px'
  },
}));

export function BusinessDashboard({
  data,
  loading,
  showOverview = true,
  showStatusMessage = true,
  renderAddress,
  isRetailerPortal = false
}: BusinessDashboardProps) {
  const classes = useStyles();
  let outstanding: LocationRO[] = [];
  let completed: LocationRO[] = [];
  let missingSales = 0;

  data?.locations?.forEach((l) => {
    if (
      l.reportStatus &&
      Object.values(l.reportStatus).includes(ReportStatus.Missing)
    ) {
      outstanding.push(l);
      if(l.reportStatus.salesReport === ReportStatus.Missing){
        missingSales++;
      }
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
            <BusinessOverview data={data.overview} missingSales={missingSales}/>
          )}
          <Box pt={2} pb={1} > 
            <ReportStatusLegend />
          </Box>
          <LocationOutstandingReportTable
            renderAddress={renderAddress}
            data={outstanding}
          />
          {
            isRetailerPortal
              &&
            <Typography className={classes.retailerText} style={{ paddingTop: '10px' }}>
              You can submit outstanding reports for the above locations by navigating through the different respective menus on the left. 
              If you're not planning on renewing your NOI for a location, you should close it on the "My Business" page or the system will 
              do it automatically on October 1st.
            </Typography>
          }
        </Paper>
      )}
      <Box pt={2} />
      {!!completed.length && (data?.overview?.incompleteReports?.length || !isRetailerPortal) && (
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

export function BusinessOverview({ data, missingSales }: { data: BusinessReportStatus, missingSales: number }) {
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
            <b>{missingSales ?? 'N/A'}</b> locations with
            outstanding Sales Report
          </>
        }
        success={!missingSales}
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
  const columns = BusinessDashboardUtil.getColumns(renderAddress);

  const getInitialPagination = () => {
    if (data.length <= 5) {
      return 5
    } else if (data.length <= 10) {
      return 10
    } else return 20
  }

  return (
    <StyledTable 
      options={{ 
        pageSize: getInitialPagination(),
        pageSizeOptions: [5, 10, 20, 30, 50]
      }} 
      columns={columns} 
      data={data} 
    />
  )
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
  
  const getInitialPagination = () => {
    if (data.length <= 5) {
      return 5
    } else if (data.length <= 10) {
      return 10
    } else return 20
  }

  return (
    <StyledTable 
      options={{ 
        pageSize: getInitialPagination(),
        pageSizeOptions: [5, 10, 20, 30, 50]
      }} 
      columns={columns} 
      data={data} 
    />
  )
}

export function ReportStatusLegend() {
  const classes = useStyles();

  return (
    <Box className={classes.retailerLegend}>
      <Typography className={`${classes.legendTitle} ${classes.retailerText}`}>
        Legend:
      </Typography>
      <div className={classes.legendItem}>
        {BusinessDashboardUtil.renderStatus(ReportStatus.Reported)}
        &nbsp; Submitted
      </div>
      <div className={classes.legendItem}>
        {BusinessDashboardUtil.renderStatus(ReportStatus.Missing)}
        &nbsp; Not Submitted
      </div>
      <div className={classes.legendItem}>
        {BusinessDashboardUtil.renderStatus(ReportStatus.NotRequired)}
        &nbsp; Not Required
      </div>
    </Box>
  )
}

export function LocationReportStatusTable({status, loading}: {status: LocationReportStatus, loading?: boolean}){
  return(
    <>
      <Box py={1}>
        <ReportStatusLegend />
      </Box>
      <StyledTable 
        columns={BusinessDashboardUtil.getLocationColumn()}
        data={ status? [status] : []}
        options={{
          paging: false,
          loadingType: 'linear',
        }}
        isLoading={loading}
      />
    </>
  )
}
