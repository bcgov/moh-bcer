import { Box, Typography } from "@material-ui/core";
import React from 'react';

export function formatError (error: any) {
    const data = error?.response?.data;
    return (
      <Box>
        {data ?
          <>
            <Typography variant='body1'>{data?.message ? data.message : ''}</Typography>
            {data?.id && <Typography variant='body2'>Error ID: {data.id}</Typography>}
          </>
          : <><Typography variant='body1'>Unknown Error</Typography></>
        }
      </Box>
    );
  }