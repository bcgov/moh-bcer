
import React, { ReactElement, CSSProperties, forwardRef } from 'react';
import { makeStyles, Paper, IconButton } from '@material-ui/core';
import { StyledTableProps } from '@/constants/interfaces/tableInterfaces';
import MaterialTable, { MTableToolbar } from '@material-table/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

import { StyledButton } from '@/index';

const useStyles = makeStyles({
  root: {
    border: '1px solid #CDCED2',
    borderRadius: '5px',
    boxShadow: 'none',
    padding: '0px 1px 0px 1px'
  },
  editButtonWrapper: {
    display: 'flex',
    alignItems: 'center'
  },
  editButton: {
    width: '90px',
    fontSize: '14px',
    minWidth: '90px',
    lineHeight: '18px',
  },
  deleteIcon: {
    color: '#ff534a'
  },
  tableHeader: {
    display: 'contents',
  },
  checkbox: {
    '& .MuiIconButton-colorSecondary':{
      '&:hover': {
        background: 'rgba(0, 83, 164, .03)',
      }
    },
    '& .MuiCheckbox-root': {
      color: 'rgba(0, 0, 0, 0.54)',

    },
    '& .Mui-checked': {
      color: '#0053A4'
    },
  }
})

/**
 * Applies styling to a table's header component
 */
const headerStyle: CSSProperties = {
  color: '#002C71',
  fontSize: '14px',
  fontWeight: 600,
  borderBottom: '2px solid #F5A623',
  whiteSpace: 'nowrap',
}

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
    cssProperty.backgroundColor = '#fff'
  } else {
    cssProperty.backgroundColor = '#fafafa'
  }

  return cssProperty
}

/**
 * Override for MTable Toolbar component
 */
const CustomToolbar = (props: any) => {
  return (
    <MTableToolbar { ...props } />
  );
}

const Empty = () => (
  null
)

const CustomActions = (props: any) => {
  const classes = useStyles()

  return (
    props.action.icon === 'edit'
      ?
      <div className={classes.editButtonWrapper}>
        <StyledButton className={classes.editButton} variant='outlined' onClick={(event) => props.action.onClick(event, props.data)} >
          Edit
        </StyledButton>
      </div>
      :
        <IconButton className={classes.deleteIcon} onClick={(event) => props.action.onClick(event, props.data)} >
          <DeleteOutlinedIcon/>
        </IconButton>
  )   
}

/**
 * Override for MTable Container component
 */
const CustomContainer = (props: any) => {
  const classes = useStyles()
  return <Paper className={`${classes.root} ${classes.checkbox}`} {...props} />
}

/**
 * Styled table reusable component
 * @param isEditable - `Optional boolean | default false` flag for rendering edit and delete actions
 * @param editHandler - `Optional Function | default undefined` handler for the edit action. passes an instance of rowData to the provided Function
 * @param deleteHandler - `Optional Function | default undefined` handler for the delete action. passes an instance of rowData to the provided Function
 * @param {MaterialTableProps} props - MUI defined dialog action props
 * @returns object of type ReactElement
 *
 */
export function StyledTable ({
  isEditable = false,
  editHandler,
  deleteHandler,
  options,
  localization,
  editable,
  ...props
}: StyledTableProps):ReactElement {

  const toolbar = editable?.onBulkUpdate ? CustomToolbar : Empty;

  const customComponents = {
    Toolbar: toolbar,
    Container: CustomContainer,
    // Pagination: CustomPagination,
  }
  const actions = []
  
  if (isEditable)  {
    customComponents['Action'] = CustomActions
    actions.push(
      {
        icon: 'edit',
        onClick: (event: any, rowData: any, ) => editHandler && editHandler(rowData)
      },
      {
        icon: 'delete',
        onClick: (event: any, rowData: any) => deleteHandler && deleteHandler(rowData)
      }
    )
  }
  
  return (
    // @ts-ignore
    <MaterialTable
      components={customComponents}
      options={{
        headerStyle: headerStyle,
        selectionProps: (rowData: any) => ({
          color: 'primary',
        }),
        rowStyle: rowData => rowStyle(rowData),
        sorting: false,
        pageSize: 5,
        paginationType: 'stepped',
        pageSizeOptions: [5, 6, 7, 8, 9, 10, 20],
        actionsColumnIndex: -1,
        showTitle: false,
        search: false,
        ...options,
      }}
      actions={actions}
      editable={editable}
      localization={{
        header: {
          actions: ' '
        },
        body: {
          addTooltip: 'Action',
          ...localization?.body
        },
        ...localization
      }}
      {...props}
    />
  );
}