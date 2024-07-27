import React from "react"
import { Stack, ImageList, ImageListItem } from "@mui/material"  
import { withErrorBoundary } from 'react-error-boundary'


function FeedQuotedTweetMedia({ media }) {    

    return (
        <>
            {   media.length === 1 ?
                    ( media[0].type === "photo" ?
                    <img 
                        src={media[0].media_url_https}  
                        className="feed-quoted-tweet-single-image-media-item"  
                    /> 
                    : media[0].type === "animated_gif" ?
                    <video
                        src={media[0].video_info.variants.at(-1).url}
                        controls
                        loop
                        className="feed-quoted-tweet-single-animated-gif-media-item"
                    ></video>
                    : media[0].type === "video" ?
                    <video
                        src={media[0].video_info.variants.at(-1).url}
                        controls
                        className="feed-quoted-tweet-single-video-media-item"
                    ></video>
                    : null )
                : media.length === 2 || media.length === 4 ?
                    <ImageList 
                        variant="quilted"
                        className="feed-quoted-tweet-image-list-two-or-four-items"
                        rowHeight={ media.length === 4 ? 158.625 : 317.25 } 
                    >
                        {media.map((mediaItem, idx) => (
                            <ImageListItem  
                                variant="quilted"
                            >
                                { mediaItem.type === "photo" ?
                                <img 
                                    src={mediaItem.media_url_https}
                                    className="feed-quoted-tweet-image-two-or-four-items"
                                />
                                : mediaItem.type === "animated_gif" ?
                                <video
                                    src={mediaItem.video_info.variants.at(-1).url}
                                    height={ media.length === 4 ? "158.625" : "317.25" }
                                    width="249.475"
                                    controls
                                    loop
                                    className="feed-quoted-tweet-animated-gif-two-or-four-items"
                                ></video>
                                : mediaItem.type === "video" ?
                                <video
                                    src={mediaItem.video_info.variants.at(-1).url}
                                    height={ media.length === 4 ? "158.625" : "317.25" }
                                    width="249.475"
                                    controls
                                    className="feed-quote-tweet-video-two-or-four-items"
                                ></video>
                                : null
                                } 
                            </ImageListItem>  
                        ))}
                    </ImageList>
                : media.length === 3 ?
                    <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={0.25}
                        className="feed-quoted-tweet-media-list-three-items-stack-container" 
                    >
                        <Stack
                            className="feed-quoted-tweet-media-list-three-items-first-item-stack-container"
                        >
                            { 
                                media[0].type === "photo" ?
                                <img 
                                    src={media[0].media_url_https}
                                    className="feed-quoted-tweet-image-three-items-first-item"  
                                />
                                : media[0].type === "animated_gif" ?
                                <video
                                    src={media[0].video_info.variants.at(-1).url} 
                                    width="248.475"
                                    height="317.25" 
                                    loop
                                    controls
                                    className="feed-quoted-tweet-animated-gif-three-items-first-item"
                                >
                                </video>
                                : media[0].type === "video" ?
                                <video
                                    src={media[0].video_info.variants.at(-1).url} 
                                    width="248.475"
                                    height="317.25"
                                    controls
                                    className="feed-quoted-tweet-video-three-items-first-item"
                                >
                                </video>
                                : null
                            }   
                        </Stack>

                        <Stack
                            className="feed-quoted-tweet-media-list-three-items-second-and-third-item-stack-container"
                            spacing={0.25}
                        >
                            { media.slice(1).map((mediaItem, idx) => (
                                mediaItem.type === "photo" ?
                                <img 
                                    src={mediaItem.media_url_https}
                                    className={`feed-quoted-tweet-image-three-items-${idx === 0 ? 'second' : 'third'}-item`}
                                />
                                : mediaItem.type === "animated_gif" ?
                                <video
                                    src={mediaItem.video_info.variants.at(-1).url} 
                                    width="246.475"
                                    height="157.63"
                                    loop 
                                    controls
                                    className={`feed-quoted-tweet-animated-gif-three-items-${idx === 0 ? 'second' : 'third'}-item`} 
                                >
                                </video>
                                : mediaItem.type === "video" ?
                                <video
                                    src={mediaItem.video_info.variants.at(-1).url} 
                                    width="246.475"
                                    height="157.63"
                                    controls
                                    className={`feed-quote-tweet-video-three-items-${idx === 0 ? 'second' : 'third'}-item`} 
                                >
                                </video>   
                                : null 
                            ))}
                        </Stack>
                    
                    </Stack>
                : null
            }  
        </>
    )
}


export default withErrorBoundary(FeedQuotedTweetMedia, {
    FallbackComponent: () => 
    <img
        src={require("../images/error-displaying-conent.png")} 
        className="feed-quoted-tweet-media-item-error-fallback" 
    />,
    onError(error) {
        console.log(error) ; 
    }
}) ;
