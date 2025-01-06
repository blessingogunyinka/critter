import React from "react"
import { Stack } from "@mui/material" 


export default function FeedSpacesCard() {

    return (
        <Stack
            direction="column"
            spacing={2}
            className="feed-spaces-card-details-not-available"
        >
            <div>Spaces</div>
            <div><b>Details not available</b></div>
        </Stack>
    )
}



