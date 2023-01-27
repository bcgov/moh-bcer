import { useEffect, useState } from "react";
import { useAxiosPost } from "./axios";

export const useFavourite = () => {
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [{ loading: isSubmitting, error: submitError }, saveFavourite] =
                                    useAxiosPost(`/data/favourite`, { manual: true });

    const onSubmit = async (data : any) => {
        const res = await saveFavourite({ data });
        console.log(res)
        console.log(submitError)
        res.data === "ok" ?? setSubmitSuccess(true);
    }
 
    return {
        onSubmit,
        isSubmitting,
        submitError,
        submitSuccess
    }
}