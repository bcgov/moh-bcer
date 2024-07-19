import React, { ReactElement, CSSProperties } from 'react';
import { styled } from '@mui/material/styles';
import { Paper, IconButton } from '@mui/material';
import MaterialTable, { Components } from '@material-table/core';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { StyledTableProps } from '@/constants/interfaces/tableInterfaces';
import { StyledButton } from '@/index';

const StyledPaper = styled(Paper)(({ theme }) => ({
  border: '1px solid #CDCED2',
  borderRadius: '5px',
  boxShadow: 'none',
  padding: '0px 1px 0px 1px',
  '& .MuiIconButton-colorSecondary:hover': {
    background: 'rgba(0, 83, 164, .03)',
  },
  '& .MuiCheckbox-root': {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  '& .Mui-checked': {
    color: '#0053A4'
  },
}));

const EditButtonWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const StyledDeleteIcon = styled(IconButton)({
  color: '#ff534a',
});

const headerStyle: CSSProperties = {
  color: '#002C71',
  fontSize: '14px',
  fontWeight: 600,
  borderBottom: '2px solid #F5A623',
  whiteSpace: 'nowrap',
};

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

  if (rowData.error === true) {
    cssProperty.backgroundColor = 'rgba(255, 0, 0, 0.2)';
  }

  return cssProperty;
};

const CustomToolbar = (props: any) => {
  return <div {...props} />;
};

const Empty = () => null;

const CustomActions = (props: any) => {
  return props.action.icon === 'edit' ? (
    <EditButtonWrapper>
      <StyledButton
        sx={{
          width: '90px',
          fontSize: '14px',
          minWidth: '90px',
          lineHeight: '18px',
        }}
        variant="outlined"
        onClick={(event) => props.action.onClick(event, props.data)}
      >
        Edit
      </StyledButton>
    </EditButtonWrapper>
  ) : (
    <StyledDeleteIcon onClick={(event) => props.action.onClick(event, props.data)}>
      <DeleteOutlinedIcon />
    </StyledDeleteIcon>
  );
};

const CustomContainer = (props: any) => {
  return <StyledPaper {...props} />;
};

interface CustomComponents extends Components {
  Action?: React.ComponentType<any>;
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
export function StyledTable({
  isEditable = false,
  editHandler,
  deleteHandler,
  options,
  localization,
  editable,
  ...props
}: StyledTableProps): ReactElement {
  const toolbar = editable?.onBulkUpdate ? CustomToolbar : Empty;

  const customComponents: CustomComponents = {
    Toolbar: toolbar,
    Container: CustomContainer,
  };

  const actions = [];

  if (isEditable) {
    customComponents.Action = CustomActions;
    actions.push(
      {
        icon: 'edit',
        onClick: (event: any, rowData: any) => editHandler && editHandler(rowData),
      },
      {
        icon: 'delete',
        onClick: (event: any, rowData: any) => deleteHandler && deleteHandler(rowData),
      }
    );
  }

  return (
    <MaterialTable
      components={customComponents}
      options={{
        headerStyle: headerStyle,
        selectionProps: (rowData: any) => ({
          color: 'primary',
          checked: rowData.tableData.checked,
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