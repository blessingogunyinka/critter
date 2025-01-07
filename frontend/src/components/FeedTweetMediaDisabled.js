import React from "react"
import { Stack } from "@mui/material" 


export default function FeedTweetMediaDisabled() {

    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            className="feed-tweet-media-disabled"
        >
            <div>This media has been disabled in response to a report by the copyright owner.</div>
        </Stack>
    )
}



