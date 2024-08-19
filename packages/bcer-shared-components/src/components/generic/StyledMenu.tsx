import React from 'react';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box, Tooltip } from '@mui/material';
import { StyledButton } from '@/components/buttons';
import { StyledButtonProps } from '@/constants/interfaces/buttonInterfaces';

const classes = {
  paper: {
    border: '1px solid #d3d4d5',
  },
};

export interface StyledMenuProps {
  items: StyledMenuItems[];
  buttonProps?: StyledButtonProps;
  buttonComponent: string | React.ReactNode;
}

export interface StyledMenuItems {
  icon?: React.ReactNode;
  handler: (() => void) | (() => Promise<any>);
  text: string;
  disabled?: boolean;
  tooltip?: string;
}

const StyledMenu = ((props: MenuProps) => (
  <Menu
    elevation={0}
    // getContentAnchorEl={null} | The getContentAnchorEl prop was removed in MUI V5 
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

export function StyledMenus({
  items,
  buttonComponent,
  buttonProps,
}: StyledMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <StyledButton
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="small-outlined"
        {...buttonProps}
        onClick={handleClick}
      >
        {buttonComponent}
      </StyledButton>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx = {classes.paper} 
        >
        {items?.map(({ text, icon, handler, disabled, tooltip }) => (
          <MenuItem onClick={handler} disabled={disabled} key={text}>
            <Tooltip title={tooltip ?? ''}>
              <Box display="flex" justifyContent="center">
                {icon && <Box>{icon}</Box>}
                {icon && <Box mx={1} />}
                <Box>{text} </Box>
              </Box>
            </Tooltip>
          </MenuItem>
        ))}
      </StyledMenu>
    </Box>
  );
}
