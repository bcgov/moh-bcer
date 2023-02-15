import React from "react"
import AddFavourite from "./AddFavourite"
import Favourites from "./Favourites"
import { Box } from "@material-ui/core"

type FavouriteProps = {
    enableAdd: boolean,
    handleSave: (name: string) => void,
    isSubmitting: boolean,
    submitSuccess: boolean,
    submitError: any,
    handleSetSearchParams: (params: string) => void
}

const Favourite = ({ enableAdd, handleSave, isSubmitting, submitSuccess, submitError, handleSetSearchParams }: FavouriteProps) => {
    return (<Box
                gridGap={10}
                display="flex"
            >
            <AddFavourite enableAdd ={enableAdd} onSave={handleSave} isSubmitting={isSubmitting} submitSuccess={submitSuccess} submitError={submitError} />
            <Favourites handleSetSearchParams={handleSetSearchParams} />
        </Box>
    )
}

export default Favourite