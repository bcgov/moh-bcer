import React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement, CSSProperties } from 'react';
import { makeStyles, Paper } from '@mui/material';
import MaterialTable, { MTableToolbar } from '@material-table/core';
import { MaterialTableProps } from '@material-table/core';

const PREFIX = 'SalesTable';

const classes = {
  root: `${PREFIX}-root`,
  editButtonWrapper: `${PREFIX}-editButtonWrapper`,
  editButton: `${PREFIX}-editButton`,
  deleteIcon: `${PREFIX}-deleteIcon`,
  tableHeader: `${PREFIX}-tableHeader`,
  checkbox: `${PREFIX}-checkbox`,
  toolbarWrap: `${PREFIX}-toolbarWrap`
};

const Root = styled('div')({
  [`& .${classes.root}`]: {
    border: '1px solid #CDCED2',
    borderRadius: '5px',
    boxShadow: 'none',
    padding: '0px 1px 0px 1px',
  },
  [`& .${classes.editButtonWrapper}`]: {
    display: 'flex',
    alignItems: 'center',
  },
  [`& .${classes.editButton}`]: {
    width: '90px',
    fontSize: '14px',
    minWidth: '90px',
    lineHeight: '18px',
  },
  [`& .${classes.deleteIcon}`]: {
    color: '#ff534a',
  },
  [`& .${classes.tableHeader}`]: {
    display: 'contents',
  },
  [`& .${classes.checkbox}`]: {
    '& .MuiIconButton-colorSecondary': {
      '&:hover': {
        background: 'rgba(0, 83, 164, .03)',
      },
    },
    '& .MuiCheckbox-root': {
      color: 'rgba(0, 0, 0, 0.54)',
    },
    '& .Mui-checked': {
      color: '#0053A4',
    },
  },
  [`& .${classes.toolbarWrap}`]: {
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export interface StyledTableProps extends MaterialTableProps<any> {
  isEditable?: boolean;
  editHandler?: Function;
  deleteHandler?: Function;
  fullscreenButton?: React.ReactElement;
}

/**
 * Applies styling to a table's header component
 */
const headerStyle: CSSProperties = {
  color: '#002C71',
  fontSize: '14px',
  fontWeight: 600,
  borderBottom: '2px solid #F5A623',
  whiteSpace: 'nowrap',
};

/**
 * Applies styling to a table's row component based on row index
 *
 * @param rowData - MTable rowData prop
 * @returns {CSSProperties} Object - CSS property object for a row
 */
const rowStyle = (rowData: any): CSSProperties => {
  let cssProperty: CSSProperties = {
    backgroundColor: '#fff',
    borderBottom: '1px solid #E1E1E6',
    fontSize: '14px',
    color: '#777777',
    whiteSpace: 'nowrap',
  };

  if (rowData.tableData.id % 2 === 0) {
    cssProperty.backgroundColor = '#fff';
  } else {
    cssProperty.backgroundColor = '#fafafa';
  }

  return cssProperty;
};

/**
 * Override for MTable Container component
 */
const CustomContainer = (props: any) => {
  return(
    <Root>
      <Paper className={`${classes.root} ${classes.checkbox}`} {...props} />
    </Root> 
  )
};

/**
 * Styled table reusable component
 * @param isEditable - `Optional boolean | default false` flag for rendering edit and delete actions
 * @param editHandler - `Optional Function | default undefined` handler for the edit action. passes an instance of rowData to the provided Function
 * @param deleteHandler - `Optional Function | default undefined` handler for the delete action. passes an instance of rowData to the provided Function
 * @param {MaterialTableProps} props - MUI defined dialog action props
 * @returns object of type ReactElement
 *
 */
export function SalesTable({
  isEditable = false,
  editHandler,
  deleteHandler,
  options,
  localization,
  editable,
  fullscreenButton,
  ...props
}: StyledTableProps): ReactElement {

  /**
   * Override for MTable Toolbar component
   */
  const CustomToolbar = React.memo((props: any) => {
    return (
      <Root>
        <div className={!!fullscreenButton ? classes.toolbarWrap : ''}>
          {fullscreenButton}
          <MTableToolbar {...props} />
        </div>
      </Root>
    );
  });

  const customComponents = {
    Toolbar: CustomToolbar,
    Container: CustomContainer,
    // Pagination: CustomPagination,
  };

  return (
    // @ts-ignore
    <MaterialTable
      components={customComponents}
      options={{
        headerStyle: headerStyle,
        selectionProps: (rowData: any) => ({
          color: 'primary',
        }),
        rowStyle: (rowData: any) => rowStyle(rowData),
        sorting: false,
        pageSize: 5,
        paginationType: 'stepped',
        pageSizeOptions: [5, 6, 7, 8, 9, 10, 20],
        actionsColumnIndex: -1,
        showTitle: false,
        search: false,
        ...options,
      }}
      localization={{
        header: {
          actions: ' ',
        },
        body: {
          addTooltip: 'Action',
          ...localization?.body,
        },
        ...localization,
      }}
      {...props}
    />
  );
}
