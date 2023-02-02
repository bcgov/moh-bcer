import { useEffect, useState } from "react";
import { useAxiosDelete, useAxiosGet, useAxiosPost } from "./axios";

export type FavouriteProps = {
    id: string,
    title: string,
    searchParams: string
}

export const useFavourite = () => {
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [{ loading: isSubmitting, error: submitError }, saveFavourite] =
                                    useAxiosPost(`/data/favourite`, { manual: true });
    const [{ data: favourites, loading: isFetching, error: fetchError }, getFavourites] =
                                    useAxiosGet(`/data/favourite`, { manual: true });
    const [{ loading: isDeleting, error: deleteError }, deleteFavourite] =
                                    useAxiosDelete(`/data/favourite`, { manual: true });

    const onSubmit = async (data : any) => {
        const res = await saveFavourite({ data });
        if (res.data === "ok") {
            setSubmitSuccess(true);
        }
    }

    const fetchFavourites = async () => {
        await getFavourites();
    }

    const removeFavourite = async (id: string) => {
        await deleteFavourite({ url: `/data/favourite/${id}` });
        fetchFavourites();  
    }
 
    return {
        onSubmit,
        isSubmitting,
        submitError,
        submitSuccess,
        fetchFavourites,
        isFetching,
        favourites,
        fetchError,
        removeFavourite,
        isDeleting,
        deleteError
    }
}