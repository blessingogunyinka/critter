import React from "react"
import { Stack, Avatar } from "@mui/material" 
import { blueCheckIconSvgPathData } from "./Svg.js"
import { withErrorBoundary } from 'react-error-boundary' 
import GenericErrorFallback from "./GenericErrorFallback.js"


function FeedBroadcastCard({ card, creationMonthDateYear, profileImage }) {

    function getBindingValueStringValue(matchingKey) {
        return card.legacy.binding_values.find(item => item.key === matchingKey)?.value?.string_value
    }

    // getBindingValue
    const broadcasterUsername = getBindingValueStringValue("broadcaster_username") ; 
    const broadcasterDisplayName = getBindingValueStringValue("broadcaster_display_name") ;
    const broadcastTitle = getBindingValueStringValue("broadcast_title") ;
    const broadcastThumbnailOriginal = card.legacy.binding_values.find(item => item.key === "broadcast_thumbnail_original")?.value?.image_value?.url  
    
    const hasBlueCheck = card.legacy.user_refs_results[0]?.result?.is_blue_verified ; 

    return (
        <>
        <Stack 
            spacing={0}
            className="feed-broadcast-card-stack-container"
        >
            <Stack
                className="feed-broadcast-card-top-portion-stream-stack-container"
            >
                <div className="feed-broadcast-card-not-supported">Broadcasts not supported</div> 
                <video
                    controls 
                    className="feed-broadcast-card-thumbnail" 
                    poster={broadcastThumbnailOriginal}
                />
            </Stack>
            <Stack
                className="feed-broadcast-card-bottom-portion-stack-container"  
            >
                <Stack 
                    direction="row" 
                    spacing={0}
                    className="feed-broadcast-card-info-stack-container"
                >
                    <Avatar 
                        sx={{ width: 24, height: 24 }}
                        className="feed-broadcast-card-avatar-container"
                    > 
                        <img
                            className="feed-broadcast-card-avatar"
                            src={profileImage}
                        />
                    </Avatar>   
                    <p className="feed-broadcast-card-user-title"><b>{broadcasterDisplayName}</b></p>
                    { hasBlueCheck ?
                    <svg
                        className="feed-broadcast-card-blue-check" 
                        viewBox="0 0 22 22"
                    >
                        <path d={blueCheckIconSvgPathData}></path>
                    </svg> : null}  
                    <p className="feed-broadcast-card-at-name">{`@${broadcasterUsername} ·`}</p>
                    <p className="feed-broadcast-card-date-created">{creationMonthDateYear}</p>
                </Stack> 
                
                <Stack 
                    direction="column" 
                    spacing={0}
                    className="feed-broadcast-card-title-stack-container"
                > 
                    <p className="feed-broadcast-card-title">{broadcastTitle}</p>
                </Stack> 
            </Stack>
        </Stack>
        </>
    )
}


export default withErrorBoundary(FeedBroadcastCard, {
    FallbackComponent: () => <GenericErrorFallback />,
    onError(error) {
        console.log(error) ; 
    }
}) ;  
 


