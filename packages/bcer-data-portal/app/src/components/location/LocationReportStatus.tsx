import React, { useEffect, useState } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/system';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { LocationReportStatusTable, StyledTable } from 'vaping-regulation-shared-components';
import { ReportStatus } from '@/constants/localEnums';
import { useAxiosGet } from '@/hooks/axios';
import type { LocationReportStatus, LocationRO } from '@/constants/localInterfaces';
const SubTitle = styled(Typography)({
  color: '#333333',
  fontSize: '14px',
});

const Title = styled(Typography)({
  fontWeight: 'bold',
  fontSize: '17px',
});

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

  return (
    <Box>
      <Title>Outstanding Reports</Title>
      <SubTitle>
        This location has {missing} outstanding report
      </SubTitle>
      <Box pt={1} pb={1}>
        <LocationReportStatusTable status={data} loading={loading}/>
      </Box>
    </Box>
  );
}