import { Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import React from 'react';

function SubscriptionSkeleton() {
  return (
    <>
      <Box flex={0.05}>
        <Skeleton height={50} />
      </Box>
      <Box flex={0.02} />
      <Box flex={0.93}>
        <Skeleton height={50} />
        <Skeleton height={50} />
        <Box display="flex">
          <Box flex={0.25}>
            <Skeleton height={50} />
          </Box>
          <Box flex={0.05} />
          <Box flex={0.25}>
            <Skeleton height={50} />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default SubscriptionSkeleton;
