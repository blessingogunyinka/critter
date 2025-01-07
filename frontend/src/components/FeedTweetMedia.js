import React from "react"
import { Grid, Stack, ImageList, ImageListItem } from "@mui/material"  
import { withErrorBoundary } from 'react-error-boundary'
import GenericErrorFallback from "./GenericErrorFallback.js"
import FeedTweetMediaDisabled from "./FeedTweetMediaDisabled.js"


function FeedTweetMedia({ media }) {

    if (media[0].ext_media_availability?.reason === "Dmcaed" && media[0].ext_media_availability?.status === "Unavailable") {
        return <FeedTweetMediaDisabled />
    }

    return (
        <Grid 
            className="feed-tweet-media-container-grid-item"
            item
        >
            {   media.length === 1 ?
                    ( media[0].type === "photo" ?
                    <img 
                        src={media[0].media_url_https}
                        className="feed-tweet-single-image-media-item" 
                    />
                    : media[0].type === "animated_gif" ?
                    <video
                        src={media[0].video_info.variants.at(-1).url} 
                        controls
                        loop
                        className="feed-tweet-single-animated-gif-media-item"
                    ></video>
                    : media[0].type === "video" ?
                    <video
                        src={media[0].video_info.variants.at(-1).url}
                        controls
                        className="feed-tweet-single-video-media-item"
                    ></video>
                    : null )
                : media.length === 2 || media.length === 4 ?
                    <ImageList 
                        variant="quilted"
                        className="feed-tweet-image-list-two-or-four-items"
                        rowHeight={ media.length === 4 ? 158.625 : 317.25 } 
                    >
                        {media.map(mediaItem => (
                            <ImageListItem  
                                variant="quilted"
                            >
                                { mediaItem.type === "photo" ?
                                <img 
                                    src={mediaItem.media_url_https}
                                    className="feed-tweet-image-two-or-four-items"
                                />
                                : mediaItem.type === "animated_gif" ?
                                <video
                                    src={mediaItem.video_info.variants.at(-1).url} 
                                    height={ media.length === 4 ? "158.625" : "317.25" }
                                    width="249.475"
                                    controls
                                    loop
                                    className="feed-tweet-animated-gif-two-or-four-items"
                                ></video>
                                : mediaItem.type === "video" ?
                                <video
                                    src={mediaItem.video_info.variants.at(-1).url}
                                    height={ media.length === 4 ? "158.625" : "317.25" }
                                    width="249.475"
                                    controls
                                    className="feed-tweet-video-two-or-four-items"
                                ></video>
                                : null } 
                            </ImageListItem>  
                        ))}
                    </ImageList>
                : media.length === 3 ?
                    <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={0.25}
                        className="feed-tweet-media-list-three-items-stack-container" 
                    >
                        <Stack
                            className="feed-tweet-media-list-three-items-first-item-stack-container"
                        >
                            { 
                                media[0].type === "photo" ?
                                <img 
                                    src={media[0].media_url_https}
                                    className="feed-tweet-image-three-items-first-item"  
                                />
                                : media[0].type === "animated_gif" ?
                                <video
                                    src={media[0].video_info.variants.at(-1).url}
                                    width="249.475"
                                    height="317.25" 
                                    loop
                                    controls
                                    className="feed-tweet-animated-gif-three-items-first-item"
                                >
                                </video>
                                : media[0].type === "video" ?
                                <video 
                                    src={media[0].video_info.variants.at(-1).url}
                                    width="249.475"
                                    height="317.25"
                                    controls
                                    className="feed-tweet-video-three-items-first-item"
                                >
                                </video>
                                : null
                            }   
                        </Stack>

                        <Stack
                            className="feed-tweet-media-list-three-items-second-and-third-item-stack-container"
                            spacing={0.25}
                        >
                            { media.slice(1).map((mediaItem, idx) => (
                                mediaItem.type === "photo" ?
                                <img 
                                    src={mediaItem.media_url_https}
                                    className={`feed-tweet-image-three-items-${idx === 0 ? 'second' : 'third'}-item`}
                                />
                                : mediaItem.type === "animated_gif" ?
                                <video 
                                    src={mediaItem.video_info.variants.at(-1).url}
                                    width="249.475"
                                    height="157.63"
                                    loop 
                                    controls
                                    className={`feed-tweet-animated-gif-three-items-${idx === 0 ? 'second' : 'third'}-item`} 
                                >
                                </video>
                                : mediaItem.type === "video" ?
                                <video 
                                    src={mediaItem.video_info.variants.at(-1).url}
                                    width="249.475"
                                    height="157.63"
                                    controls
                                    className={`feed-tweet-video-three-items-${idx === 0 ? 'second' : 'third'}-item`} 
                                >
                                </video>   
                                : null 
                            ))}
                        </Stack>
                    
                    </Stack>
                : null
            }  
        </Grid>
    )
}

export default withErrorBoundary(FeedTweetMedia, {
    FallbackComponent: () => <GenericErrorFallback />,
    onError(error) {
        console.log(error) ; 
    } 
}) ;