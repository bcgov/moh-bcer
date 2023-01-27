import React from "react"
import AddFavourite from "./AddFavourite"
import Favourites from "./Favourites"
import { Box } from "@material-ui/core"

type FavouriteProps = {
    handleSave: (name: string) => void,
    isSubmitting: boolean,
    submitSuccess: boolean,
    submitError: any
}

const Favourite = ({ handleSave, isSubmitting, submitSuccess, submitError }: FavouriteProps) => {
    return (<Box
                gridGap={10}
                display="flex"
            >
            <AddFavourite onSave={handleSave} isSubmitting={isSubmitting} submitSuccess={submitSuccess} submitError={submitError} />
            <Favourites />
        </Box>
    )
}

export default Favourite