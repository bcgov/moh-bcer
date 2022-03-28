import { ReportStatus } from '@/constants/localEnums';
import { useAxiosGet } from '@/hooks/axios';
import { Box, makeStyles, Tooltip, Typography } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { LocationReportStatusTable, StyledTable } from 'vaping-regulation-shared-components';
import { LocationReportStatus, LocationRO } from '@/constants/localInterfaces';

const useStyles = makeStyles(() => ({
  subTitle: {
    color: '#333333',
    fontSize: '14px',
  },
  title: {
    fontWeight: 'bold',
    fontSize: '17px',
  },
}));



export function LocationReportStatus({ id }: { id: string }) {
  const [missing, setMissing] = useState(0);
  const [{ data, error, loading }] = useAxiosGet<LocationReportStatus>(
    `/data/location/report-status/${id}`
  );

  function countMissing(r: LocationReportStatus) {
    let missing = 0;
    Object.values(r || {}).forEach(item => {
      if(item === ReportStatus.Missing){
        missing++;
      }
    })
    return missing;
  }

  useEffect(() => {
    setMissing(countMissing(data))
  }, [data])

  const classes = useStyles();
  return (
    <Box>
      <Typography className={classes.title}>Outstanding Reports</Typography>
      <Typography className={classes.subTitle}>
        This location has {missing} outstanding report
      </Typography>
      <Box pt={1} pb={1}>
        <LocationReportStatusTable status={data} loading={loading}/>
      </Box>
    </Box>
  );
}
