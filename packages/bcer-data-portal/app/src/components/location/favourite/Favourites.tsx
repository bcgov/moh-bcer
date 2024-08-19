import React, { useEffect } from 'react';
import { Box, CircularProgress, List, ListItem, ListItemSecondaryAction, ListItemText, Popover, Typography } from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import { FavouriteProps, useFavourite } from '@/hooks/useFavourite';

const iconSize = 35; 

const ListBookmarkIcon = styled('span')(({ theme }) => ({
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

const PopoverHeader = styled(Typography)({
    borderBottom: '1px solid grey',
    padding: '15px 16px',
    display: 'flex',
    color: '#517595',
    fontSize: 14,
    alignItems: 'center',
    fontWeight: 600
});

const NoResult = styled(Typography)({
    padding: 10
});

const FavouriteItemStyled = styled(ListItem)({
    '& .MuiListItemText-root': {
        cursor: 'pointer',
        '& span': {
            fontWeight: 600
        }
    }
});

type FavouritesProps = {
    handleSetSearchParams: (params: string) => void,
}

const Favourites = ({ handleSetSearchParams }: FavouritesProps) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLSpanElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
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
            <ListBookmarkIcon
                onClick={handleClick}
                className={`material-symbols-outlined ${open ? 'highlight' : ''}`}
            >
                bookmarks
            </ListBookmarkIcon>
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
                    width={250}
                    maxHeight={350}
                    overflow='hidden'
                >
                    <PopoverHeader>
                        <span className="material-symbols-outlined" style={{ fontSize: 24, color: '#3F6991' }}>bookmark</span>
                        &nbsp;
                        Favourites
                    </PopoverHeader>

                    <Box
                        maxHeight={350}
                        sx={{ overflowY: 'scroll', scrollbarWidth: 'none' }}
                    >
                        {(isFetching || isDeleting) ?
                            <Box
                                display='flex'
                                alignItems='center'
                                height={90}
                                justifyContent='center'
                            >
                                <CircularProgress />
                            </Box> :
                            favourites && favourites.length > 0 ?
                                <List>
                                    {favourites.map((fav: FavouriteProps) => {
                                        const favItemPropData = { ...fav, onDelete: removeFavourite }
                                        return <FavouriteItem {...favItemPropData} key={fav.id} setSearchParams={handleSetSearchParams} />
                                    })
                                    }
                                </List> :
                                <NoResult>No favourites saved</NoResult>
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

const FavouriteItem = ({ id, title, searchParams, onDelete, setSearchParams }: FavouriteItemProps) => {
    return (
        <FavouriteItemStyled>
            <ListItemText onClick={() => setSearchParams(searchParams)} primary={title} sx={{ fontWeight: 600, cursor: 'pointer' }} />
            <ListItemSecondaryAction>
                <CloseIcon onClick={() => onDelete(id)} sx={{ fontSize: 14, cursor: 'pointer' }} />
            </ListItemSecondaryAction>
        </FavouriteItemStyled>
    )
}

export default Favourites;