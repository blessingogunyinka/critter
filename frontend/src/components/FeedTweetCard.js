import React from "react"
import { Stack } from "@mui/material"
import { tweetCardIconSvgPathData } from "./Svg.js"
import { withErrorBoundary } from 'react-error-boundary'
import GenericErrorFallback from "./GenericErrorFallback.js"
import useValidateImageUrl from "../util/useValidateImageUrl.js"


function FeedTweetCard({ card, tweetResultLegacy }) { 

    const cardLegacyBindingValues = card.legacy?.binding_values ; 

    const unifiedCardFunction = () => {
        try {
            return JSON.parse(card.legacy?.binding_values?.find(item => item.key === "unified_card")?.value?.string_value)
        } catch {
            return null ; 
        }
    }

    const unifiedCard = unifiedCardFunction() ; 

    const cardImageOriginalSize = card.legacy?.binding_values?.find(item => item.key === "thumbnail_image_original")?.value?.image_value?.url ;

    const cardSummaryImageOriginalSize =  card.legacy?.binding_values?.find(item => item.key === "summary_photo_image_original")?.value?.image_value?.url ; 

    const unifiedCardImage = unifiedCard?.media_entities[unifiedCard?.component_objects?.media_1?.data?.id]?.media_url_https ; 

    const cardImageFullSize = card.legacy?.binding_values?.find(item => item.key === "photo_image_full_size_large")?.value?.image_value?.url 

    const cardTitle = card.legacy?.binding_values?.find(item => item.key === "title")?.value?.string_value 
    || unifiedCard?.component_objects?.details_1?.data?.title?.content

    const vanityUrl = card.legacy?.binding_values?.find(item => item.key === "vanity_url")?.value?.string_value 
    || unifiedCard?.destination_objects?.browser_1?.data?.url_data?.vanity

    const cardDescription = card.legacy?.binding_values?.find(item => item.key === "description")?.value?.string_value ; 

    const cardExpandedUrl = tweetResultLegacy?.entities?.urls?.find(item => item.url === card.rest_id)?.expanded_url 
    || unifiedCard?.destination_objects?.browser_1?.data?.url_data?.url

    const cardThumbnailImageLeftPortion = card.legacy?.binding_values?.find(item => item.key === "thumbnail_image_original")?.value?.url ;  

    const cardSpaces = card.legacy?.binding_values?.find(item => item.key === "narrow_cast_space_type") ;  

    const cardSummaryImageOriginalSizeValidation = useValidateImageUrl(cardSummaryImageOriginalSize) ; 

    const cardImageFullSizeValidation = useValidateImageUrl(cardImageFullSize) ; 
    const unifiedCardValidation = useValidateImageUrl(unifiedCard) ;


    return (
        <>
            { cardImageFullSizeValidation || unifiedCardValidation ?
            // cardLargeThumbnailImageValidation ?
            // cardImageFullSize || unifiedCard ?
            <Stack 
                direction="column" 
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={0}
                className="feed-tweet-card-large-thumbnail-stack-container"
            > 
                <a
                    className="feed-tweet-card-large-thumbnail-image-anchor"
                    href={cardExpandedUrl} 
                >
                    <img 
                        src={cardImageFullSize || unifiedCardImage}   
                        className="feed-tweet-card-large-thumbnail-image"
                    />
                    <div className="feed-tweet-card-large-thumbnail-title">{cardTitle}</div>
                </a>
                <p className="feed-tweet-card-large-thumbnail-domain">
                    <a
                        className="feed-tweet-card-large-thumbnail-domain-anchor"
                        href={cardExpandedUrl} 
                    >
                        {"From " + vanityUrl}
                    </a>
                </p>
            </Stack>
            : 
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={0}
                className="feed-tweet-card-stack-container"
            >
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={0} 
                    className="feed-tweet-card-left-portion-stack-container"
                >
                    { !cardLegacyBindingValues.find(item => item.key.includes("thumbnail")) || !cardSummaryImageOriginalSizeValidation ? 
                    <svg 
                        className="feed-tweet-card-left-portion-icon"
                        viewBox="0 0 24 24"
                    >
                        <path d={tweetCardIconSvgPathData}></path> 
                    </svg>
                    : 
                    <img
                        className="feed-tweet-card-left-portion-image"
                        src={cardImageOriginalSize || cardSummaryImageOriginalSize} 
                    /> 
                    }
                </Stack>
                <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={0}
                    className="feed-tweet-card-right-portion-stack-container"
                >
                    <p className="feed-tweet-card-right-portion-domain">{vanityUrl}</p>
                    <p className="feed-tweet-card-right-portion-title">{cardTitle}</p>
                    <p className="feed-tweet-card-right-portion-description">{cardDescription}</p>
                </Stack>                
            </Stack> 
            }
        </>
    )
}

export default withErrorBoundary(FeedTweetCard, {
    FallbackComponent: () => <GenericErrorFallback />,
    onError(error) {
        console.log(error) ; 
    }
}) ;  
