import { truncateString } from '@/utils';
import { makeStyles, Tooltip } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(() => ({
  tooltip: {
    fontSize: 14,
  },
}));

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
  const classes = useStyles();
  return value?.length > length ? (
    <Tooltip title={value || ''} classes={{ tooltip: classes.tooltip }}>
      <div>{truncateString(value, length)}</div>
    </Tooltip>
  ) : (
    <>{value}</>
  );
}
