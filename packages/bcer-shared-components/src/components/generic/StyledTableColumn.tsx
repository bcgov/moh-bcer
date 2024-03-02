import { truncateString } from '@/utils';
import { styled } from '@mui/material/styles';
import { Tooltip } from '@mui/material';
import React from 'react';

const PREFIX = 'StyledTableColumn';

const classes = {
  tooltip: `${PREFIX}-tooltip`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(() => ({
  [`& .${classes.tooltip}`]: {
    fontSize: 14,
  }
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

  return value?.length > length ? (
    <Tooltip title={value || ''} classes={{ tooltip: classes.tooltip }}>
      <div>{truncateString(value, length)}</div>
    </Tooltip>
  ) : (
    (<Root>{value}</Root>)
  );
}
