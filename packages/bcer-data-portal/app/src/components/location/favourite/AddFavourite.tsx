import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Popover, TextField, Typography, makeStyles } from '@material-ui/core';
import { StyledButton } from 'vaping-regulation-shared-components';

const useStyles = makeStyles(() => ({
    addBookmarkIcon: {
        fontSize: 35, 
        color: '#3F6991',
        cursor: 'pointer',
        '&:hover': {
            background: '#e6eff7'
        },
        '&.highlight': {
            background: '#e6eff7'
        }
    },
    popoverHeader: {
        borderBottom: '1px solid grey', 
        padding: '15px 16px', 
        display: 'flex',
        color: '#517595',
        fontSize: 14,
        alignItems: 'center',
        fontWeight: 600
    },
    smallButton: {
        minWidth: 50,
        padding: '5px 12px'
    }
}))

type AddFavouriteProps = {
    enableAdd: boolean,
    onSave: (name: string) => void,
    isSubmitting: boolean,
    submitSuccess: boolean,
    submitError: any
}

const AddFavourite = ({ enableAdd, onSave, isSubmitting, submitSuccess, submitError }: AddFavouriteProps) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [name, setName] = React.useState("");
    const [helperText, setHelperText] = useState("");

    const handleClick = (event: any) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      resetForm();
      setAnchorEl(null);
    };
  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    useEffect(()=> {
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
            <span 
                onClick={handleClick}
                className={`${classes.addBookmarkIcon} material-symbols-outlined ${open ? 'highlight': ''}`} 
                aria-describedby={id}>bookmark_add</span>:
            <span 
                className={`material-symbols-outlined `} 
                style={{fontSize: 35, color: 'grey'}}>bookmark_add</span>}
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
                    display={"flex"}
                    justifyItems={"center"}
                    flexDirection={"column"}
                >
                    <Typography className={classes.popoverHeader}>
                        <span className="material-symbols-outlined" style={{fontSize: 24, color: '#3F6991'}}>bookmark</span>
                        &nbsp;
                        Add Favourite
                    </Typography>
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
                            onChange={(e)=> setName(e.target.value)}
                        />
                    </Box>

                    <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        padding={2}
                        borderTop={"1px solid grey"}>
                        <StyledButton variant="small-outlined" className={classes.smallButton} onClick={handleClose}>Cancel</StyledButton>
                        <StyledButton variant="small-contained" className={classes.smallButton} disabled={!name} onClick={() => onSave(name)}>
                            {isSubmitting ? <CircularProgress /> : "Submit"}
                        </StyledButton>
                    </Box>
                </Box>
                
            </Popover>
        </>
    )
}

export default AddFavourite 