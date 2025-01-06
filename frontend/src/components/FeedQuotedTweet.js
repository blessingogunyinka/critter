import React from "react"
import { Stack, Avatar } from "@mui/material" 
import { blueCheckIconSvgPathData } from "./Svg.js" 
import FeedQuotedTweetMedia from "./FeedQuotedTweetMedia.js"
import { withErrorBoundary } from 'react-error-boundary' 
import GenericErrorFallback from "./GenericErrorFallback.js"  


function FeedQuotedTweet({ quotedStatusResult, getTweetCreationMonthDateYear, cleanTweetText }) {

    const media = quotedStatusResult.result?.legacy?.extended_entities?.media ; 
    const createdAt = quotedStatusResult.result?.legacy?.created_at ; 
    const quoteTweetText = quotedStatusResult.result?.legacy?.full_text ; 
    const noteTweet = quotedStatusResult.result?.note_tweet ; 

    const userResultsLegacy = quotedStatusResult.result?.core?.user_results?.result?.legacy ; 
    const profileImage = userResultsLegacy?.profile_image_url_https?.replace("normal", "x96") ; 
    const userTitle = userResultsLegacy?.name ; 
    const atName = userResultsLegacy?.screen_name ; 

    const quoteTweetCard = quotedStatusResult.result?.card ; 

    const creationMonthDateYear = getTweetCreationMonthDateYear(createdAt) ;

    const cleanedQuoteTweetText = cleanTweetText(quoteTweetCard, quoteTweetText)

    return (
        <>
        <Stack 
            spacing={0}
            className="feed-quoted-tweet-stack-container"
        >
            <Stack 
                className={ media ? "feed-quoted-tweet-with-media-top-portion-stack-container" : "feed-quoted-tweet-without-media-stack-container"}
            >
                <Stack 
                    direction="row" 
                    spacing={0}
                    className="feed-quoted-tweet-info-stack-container"
                >
                    <Avatar 
                        sx={{ width: 24, height: 24 }}
                        className="feed-quoted-tweet-avatar-container"
                    > 
                        <img
                            className="feed-quoted-tweet-avatar" 
                            src={profileImage} 
                        />
                    </Avatar>   
                    <p className="feed-quoted-tweet-user-title"><b>{userTitle}</b></p>
                    <svg 
                        className="feed-quoted-tweet-blue-check"
                        viewBox="0 0 22 22"
                    >
                        <path d={blueCheckIconSvgPathData}></path>
                    </svg>
                    <p className="feed-quoted-tweet-at-name">@{atName + " ·"}</p>
                    <p className="feed-quoted-tweet-date-created">{creationMonthDateYear}</p> 
                </Stack> 
                
                <Stack 
                    direction="column" 
                    spacing={0}
                    className="feed-quoted-tweet-text-stack-container"
                > 
                    <p className="feed-quoted-tweet-text">{cleanedQuoteTweetText}</p>
                    {   noteTweet ?
                        <p className="feed-quoted-tweet-note-tweet-show-more">
                            <a>Show more</a>
                        </p>
                        : null 
                    }
                </Stack> 
            </Stack>
            { media ? 
            <Stack 
                className="feed-quote-tweet-with-media-bottom-portion-media-stack-container"
            >
                <FeedQuotedTweetMedia media={media}/> 
            </Stack>
            : null }
        </Stack>
        </>
    )
}

export default withErrorBoundary(FeedQuotedTweet, {
    FallbackComponent: () => <GenericErrorFallback />,
    onError(error, info) {
        console.log(error) ; 
    }
}) ;