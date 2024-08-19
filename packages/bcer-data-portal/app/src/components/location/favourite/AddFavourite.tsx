import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Popover, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { StyledButton } from 'vaping-regulation-shared-components';

const iconSize = 35;

const AddBookmarkIcon = styled('span')(({ theme }) => ({
    fontSize: `${iconSize}px !important`,
    color: '#3F6991',
    cursor: 'pointer',
    '&:hover': {
        background: '#e6eff7'
    },
    '&.highlight': {
        background: '#e6eff7'
    }
}));

const DisabledBookmarkIcon = styled('span')(({ theme }) => ({
    fontSize: `${iconSize}px !important`,
    color: 'grey',
}));

const PopoverHeader = styled(Typography)({
    borderBottom: '1px solid grey',
    padding: '15px 16px',
    display: 'flex',
    color: '#517595',
    fontSize: 14,
    alignItems: 'center',
    fontWeight: 600
});

const SmallButton = styled(StyledButton)({
    minWidth: 50,
    padding: '5px 12px'
});

type AddFavouriteProps = {
    enableAdd: boolean,
    onSave: (name: string) => void,
    isSubmitting: boolean,
    submitSuccess: boolean,
    submitError: any
}

const AddFavourite = ({ enableAdd, onSave, isSubmitting, submitSuccess, submitError }: AddFavouriteProps) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLSpanElement | null>(null);
    const [name, setName] = React.useState("");
    const [helperText, setHelperText] = useState("");

    const handleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        resetForm();
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    useEffect(() => {
        if (submitSuccess) {
            setHelperText("Added Successfully!");
            setTimeout(() => {
                resetForm()
            }, 3000)
        }
        if (submitError) {
            setHelperText("Error saving favourite!");
            console.log(submitError)
        }
    }, [submitSuccess, submitError])

    const resetForm = () => {
        setHelperText("");
        setName("");
    }

    return (
        <>
            {enableAdd ?
                <AddBookmarkIcon
                    onClick={handleClick}
                    className={`material-symbols-outlined ${open ? 'highlight' : ''}`}
                    aria-describedby={id}>bookmark_add</AddBookmarkIcon> :
                <DisabledBookmarkIcon className="material-symbols-outlined">bookmark_add</DisabledBookmarkIcon>}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Box
                    display="flex"
                    justifyItems="center"
                    flexDirection="column"
                >
                    <PopoverHeader>
                        <span className="material-symbols-outlined" style={{ fontSize: 35, color: '#3F6991' }}>bookmark</span>
                        &nbsp;
                        Add Favourite
                    </PopoverHeader>
                    <Box padding={2}>
                        <TextField
                            id="outlined-full-width"
                            label="Name"
                            placeholder="Name of favourite"
                            helperText={helperText}
                            size="small"
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="outlined"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Box>

                    <Box
                        display="flex"
                        justifyContent="space-between"
                        padding={2}
                        borderTop="1px solid grey">
                        <SmallButton variant="small-outlined" onClick={handleClose}>Cancel</SmallButton>
                        <SmallButton variant="small-contained" disabled={!name} onClick={() => onSave(name)}>
                            {isSubmitting ? <CircularProgress size={24} /> : "Submit"}
                        </SmallButton>
                    </Box>
                </Box>
            </Popover>
        </>
    )
}

export default AddFavourite;