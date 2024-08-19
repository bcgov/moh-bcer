import React from "react"
import AddFavourite from "./AddFavourite"
import Favourites from "./Favourites"
import { Box } from "@mui/material"

type FavouriteProps = {
    enableAdd: boolean,
    handleSave: (name: string) => void,
    isSubmitting: boolean,
    submitSuccess: boolean,
    submitError: any,
    handleSetSearchParams: (params: string) => void
}

const Favourite = ({ enableAdd, handleSave, isSubmitting, submitSuccess, submitError, handleSetSearchParams }: FavouriteProps) => {
    return (
        <Box
            sx={{
                display: "flex",
                gap: 1.25
            }}
        >
            <AddFavourite enableAdd={enableAdd} onSave={handleSave} isSubmitting={isSubmitting} submitSuccess={submitSuccess} submitError={submitError} />
            <Favourites handleSetSearchParams={handleSetSearchParams} />
        </Box>
    )
}

export default Favourite