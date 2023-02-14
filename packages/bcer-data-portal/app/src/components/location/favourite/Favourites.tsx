import { FavouriteProps, useFavourite } from '@/hooks/useFavourite';
import { Box, CircularProgress, List, ListItem, ListItemSecondaryAction, ListItemText, Popover, Typography, makeStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(() => ({
    listBookmarkIcon: {
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
    noResult: {
        padding: 10
    },
    favouriteItem: {
        '& .MuiListItemText-root': {
            cursor: 'pointer',
            '& span': {
                fontWeight: 600
            }
        }
    }
}));

type FavouritesProps = {
    handleSetSearchParams: (params: string) => void,
}

const Favourites = ({ handleSetSearchParams }: FavouritesProps) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'list-favourite-popover' : undefined;

    const {
        fetchFavourites,
        isFetching,
        favourites,
        removeFavourite,
        isDeleting
    } = useFavourite();

    useEffect(() => {
        if (open)
            fetchFavourites()
    }, [open])

    return (
        <>  
            <span
                onClick={handleClick}
                className={`${classes.listBookmarkIcon} material-symbols-outlined ${open ? 'highlight': ''}`}
                >bookmarks</span>
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
                    justifyItems = {"center"}
                    flexDirection = {"column"}
                    width = {250}
                    maxHeight = {350}
                    overflow={'hidden'}
                >
                    <Typography className={classes.popoverHeader}>
                        <span className="material-symbols-outlined" style={{fontSize: 24, color: '#3F6991'}}>bookmark</span>
                        &nbsp;
                        Favourites
                    </Typography>
                                        
                    <Box 
                        maxHeight={350}
                        style={{overflowY: 'scroll', scrollbarWidth: 'none'}}>
                        {(isFetching || isDeleting)  ? 
                            <Box 
                                display='flex'
                                alignItems={'center'}
                                height={90}
                                justifyContent={'center'}
                            >
                                <CircularProgress />
                            </Box>:
                            favourites && favourites.length > 0 ?
                            <List>
                                {favourites.map((fav: FavouriteProps) => {
                                    const favItemPropData = {...fav, onDelete: removeFavourite}
                                    return <FavouriteItem {...favItemPropData} key={fav.id} setSearchParams={handleSetSearchParams} />
                                })
                                }
                            </List>:
                            <Typography className={classes.noResult}>No favourites saved</Typography>
                        }
                    </Box>
                </Box>
            </Popover>
        </>
    )
}

interface FavouriteItemProps extends FavouriteProps {
    onDelete: (id: string) => void,
    setSearchParams: (params: string) => void
}

const FavouriteItem = ({ id, title, searchParams, onDelete, setSearchParams}: FavouriteItemProps) => {
    const classes = useStyles();
    return (<ListItem className={classes.favouriteItem}>
                <ListItemText onClick={() => setSearchParams(searchParams)}  primary={title} style={{fontWeight: 600, cursor: 'pointer'}} />
                <ListItemSecondaryAction>
                    <CloseIcon onClick={() => onDelete(id)} style={{fontSize: 14, cursor: 'pointer'}} /> 
                </ListItemSecondaryAction>
            </ListItem>)
}

export default Favourites