import { Box } from '@mui/material';
import { Skeleton } from '@mui/material'
import React from 'react';

export interface DetailsSkeletonProp {
  rows: number;
}

function DetailsSkeleton({ rows }: DetailsSkeletonProp) {
  return (
    <>
      <Box>
        <Skeleton height={50} />
        {Array.from(Array(rows)).map((v, i) => (
          <Box display="flex" key={i}>
            <Box flex={0.25}>
              <Skeleton height={50} />
            </Box>
            <Box flex={0.05} />
            <Box flex={0.7}>
              <Skeleton height={50} />
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
}

export default DetailsSkeleton;
