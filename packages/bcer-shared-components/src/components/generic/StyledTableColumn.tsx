import { truncateString } from '@/utils';
import { Tooltip } from '@mui/material';
import React from 'react';

const classes = {
  tooltip: {
    fontSize: 14,
  }
};

/**
 * 
 * @param {string} value `string` value to be shown in column
 * @param {string} length `number` length(optional) after which value will be truncated
 * @returns Reusable React component
 */
export function StyledTableColumn({
  value,
  length = 12,
}: {
  value: string;
  length?: number;
}) {

  return value?.length > length ? (
    <Tooltip title={value || ''} sx={classes.tooltip}>
      <div>{truncateString(value, length)}</div>
    </Tooltip>
  ) : (
    <>{value}</>
  );
}
