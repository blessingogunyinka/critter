import React from 'react';
import { Grid, Stack } from "@mui/material"
import {  Avatar } from '@mui/material'; 
import { Parser } from "html-to-react" ;
import { blueCheckIconSvgPathData, repliesIconSvgPathData, repostsIconSvgPathData, 
        likesIconSvgPathData, viewsIconSvgPathData, bookmarkIconSvgPathData, 
        shareIconSvgPathData } from "./Svg.js"

import FeedTweetCard from "./FeedTweetCard.js"  
import FeedTweetMedia from "./FeedTweetMedia.js"
import FeedQuotedTweet from "./FeedQuotedTweet.js"  
import FeedBroadcastCard from "./FeedBroadcastCard.js"
import FeedSpacesCard from "./FeedSpacesCard.js" 
import { withErrorBoundary } from 'react-error-boundary' 
import GenericErrorFallback from "./GenericErrorFallback.js"
import VerifiedCheck from "./VerifiedCheck.js" 

function FeedTweet({ tweetData }) {

    const tweetResultUserResult = tweetData.data?.tweetResult?.result?.core?.user_results?.result || tweetData.data?.tweetResult?.result?.tweet?.core?.user_results?.result 
    const tweetResultLegacy = tweetData.data?.tweetResult?.result?.legacy || tweetData.data?.tweetResult?.result?.tweet?.legacy

    const bookmarkCount = tweetResultLegacy?.bookmark_count ; 
    const createdAt = tweetResultLegacy?.created_at ;
    const media = tweetResultLegacy?.extended_entities?.media ; 
    const fullText = tweetResultLegacy?.full_text ; 
    const language = tweetResultLegacy?.lang
    const quoteCount = tweetResultLegacy?.quote_count
    const isRetweeted = tweetResultLegacy?.retweeted
    const userTitle = tweetResultUserResult?.legacy?.name
    const hasBlueCheck = tweetResultUserResult?.is_blue_verified
    const verifiedType = tweetResultUserResult?.legacy?.verified_type
    const atName = tweetResultUserResult?.legacy?.screen_name
    const profileImage = tweetResultUserResult?.legacy?.profile_image_url_https
    const profileDescription = tweetResultUserResult?.legacy?.description 
    const hashtags = tweetResultLegacy?.entities?.hashtags ; 
    const symbols = tweetResultLegacy?.entities?.symbols ;
    const urls = tweetResultLegacy?.entities?.urls ;
    const userMentions = tweetResultLegacy?.entities?.user_mentions ;
    
    const noteTweet = tweetData.data?.tweetResult?.result?.note_tweet 
    const noteTweetText = noteTweet?.note_tweet_results?.result?.text ;
    const noteTweetEntitySet = noteTweet?.note_tweet_results?.result?.entity_set ; 
    const noteTweetHashtags = noteTweetEntitySet?.hashtags ; 
    const noteTweetSymbols = noteTweetEntitySet?.symbols ; 
    const noteTweetUrls = noteTweetEntitySet?.urls ; 
    const noteTweetUserMentions = noteTweetEntitySet?.user_mentions ; 
     

    const card = tweetData.data?.tweetResult?.result?.card ; 
    const isQuoteStatus = tweetResultLegacy?.is_quote_status ;  // is the tweet a quote tweet

    const quotedStatusResult = tweetData.data?.tweetResult?.result?.quoted_status_result 
    || tweetData.data?.tweetResult?.result?.tweet?.quoted_status_result ; // data for tweet that is being "quoted"


    
    function cleanTweetText(card, fullText) {
        if (fullText.lastIndexOf("https://t.co/") === -1 || card) {
            return fullText
        } 
        else {
            return fullText.substring(0, fullText.lastIndexOf("https://t.co/"))
        }
    } 


    function getTweetCreationMonthDateYear(createdAt) {
        const creationDate = new Date(createdAt) ;  
        const month = creationDate.toLocaleString("en-US", { month: "short"}) ;
        return month + " " + creationDate.getDate() + ", " + creationDate.getFullYear()
    }

    const creationMonthDateYear = getTweetCreationMonthDateYear(createdAt) ; 


    function formatTweetText(text) {

        let formattedText = text ; 

        function entityFormatter(entity) {
            if (entity.length > 0) {
                entity.map(entityObject => {
                    if (entity === hashtags || entity === symbols || entity === noteTweetHashtags || entity === noteTweetSymbols) {
                        const entityText = (entity === hashtags || entity === noteTweetHashtags ? "#" : "$") + entityObject.text ; 
                        const hashtagOrCashtagHref = "%22%23" + entityObject.text + "%22" ;  
                        formattedText = formattedText.replace(entityText, `<a className="anyHashtagOrCashtag" target="_blank" href="./search?q=${hashtagOrCashtagHref}">${entityText}</a>`) 
                    } else if (entity === urls || entity === noteTweetUrls) {
                        formattedText = formattedText.replace(entityObject.url, `<a className="anyUrl" target="_blank" href="${entityObject.expanded_url}">${entityObject.display_url}</a>`)
                    } else if (entity === userMentions || entity === noteTweetUserMentions) {
                        formattedText = formattedText.replace(`@${entityObject.screen_name}`, `<a className="anyUserAtName" target="_blank" href="./${entityObject.screen_name}">@${entityObject.screen_name}</a>`)
                    } 
                })
            }
        }

        if (noteTweet) { 
            entityFormatter(noteTweetHashtags) ;
            entityFormatter(noteTweetSymbols) ; 
            entityFormatter(noteTweetUrls) ; 
            entityFormatter(noteTweetUserMentions) ;
        } else {
            entityFormatter(hashtags) ;
            entityFormatter(symbols) ; 
            entityFormatter(urls) ; 
            entityFormatter(userMentions) ; 
        }

        const htmlToReactParser = new Parser() ; 

        return ( 
            <div>{htmlToReactParser.parse(formattedText)}</div>
        )
        
    }

    const cleanedFormattedTweetText = fullText ? formatTweetText(cleanTweetText(card, fullText)) : null ; 
    const formattedNoteTweetText = noteTweetText ? formatTweetText(noteTweetText) : null ; 


    // Replies, Reposts, Likes, Views
    function formatFeedTweetStats(count) {
        const digits = count?.toString().length ;  
        if (count >= 1000000) {
            if (count.toString()[digits-6] > 0) {
                return `${(count/1000000).toString().slice(0,digits-4)}M`
            } else {
                return `${(count/1000000).toString().slice(0,digits-6)}M`
            }
        } else if (count >= 1000) {
            if (count.toString()[digits-3] > 0) {
                return `${(count/1000).toString().slice(0,digits-1)}K`
            } else {
                return `${(count/1000).toString().slice(0,digits-3)}K`
            }
        } else if (count === 0) {
            return "" ; 
        } else {
            return count?.toLocaleString() ;  
        }
    }

    const replyCount = formatFeedTweetStats(tweetResultLegacy?.reply_count) ;   
    const retweetCount = formatFeedTweetStats(tweetResultLegacy?.retweet_count) ; 
    const likeCount = formatFeedTweetStats(tweetResultLegacy?.favorite_count) ; 
    const viewsCount = tweetData?.data?.tweetResult?.result?.views?.count ? formatFeedTweetStats(tweetData.data.tweetResult.result.views.count) : "" ;

    const [noteTweetIsExpanded, setNoteTweetIsExpanded] = React.useState(false)
    
    return (
        <>
            <div className="feed-tweet-box-container">
                <header className="feed-tweet-avatar-container">
                    <Avatar 
                        sx={{ width: 40, height: 40 }}
                    >
                        <img
                            className="feed-tweet-avatar" 
                            src={profileImage?.replace("normal", "x96")}
                        />
                    </Avatar>
                </header>

                <Grid
                    className="feed-tweet-info-grid-container"
                    container
                    justifyContent="flex-start" 
                    alignItems="flex-start"
                    zeroMinWidth
                    rowSpacing={0}
                    columnSpacing={0}
                >
                    <Grid item className="feed-tweet-user-title-grid-item">
                        <div className="feed-tweet-user-title">
                            <b>{userTitle}</b>
                        </div> 
                    </Grid>
                    { hasBlueCheck ? 
                    <Grid 
                        item 
                        className="feed-tweet-blue-check-grid-item"
                    >
                        <VerifiedCheck hasBlueCheck={hasBlueCheck} verifiedType={verifiedType} />
                    </Grid> : null }
                    <Grid item className="feed-tweet-at-name-grid-item">
                        <p className="feed-tweet-at-name">@{atName} ·</p>   
                    </Grid>
                    <Grid item className="feed-tweet-date-created-grid-item">
                        <p className="feed-tweet-date-created">{creationMonthDateYear}</p> 
                    </Grid>
                </Grid>                

                <Grid
                    className="feed-tweet-content-grid-container"
                    container
                    justifyContent="flex-start" 
                    alignItems="flex-start"
                    zeroMinWidth
                    rowSpacing={0}
                    columnSpacing={0}
                >
                    
                    { fullText ?
                    <Grid
                        className="feed-tweet-text-container-grid-item"
                        item
                    >
                        <p 
                            className={noteTweetText ? "feed-tweet-text-with-show" : "feed-tweet-text" } 
                        >
                            {!noteTweetIsExpanded ? cleanedFormattedTweetText : formattedNoteTweetText }
                        </p>
                        {   noteTweetText ? 
                            <p 
                                className="feed-tweet-text-show-more"
                                onClick={() => setNoteTweetIsExpanded(prev => !prev)}
                            >
                                {"Show " + (!noteTweetIsExpanded ? "more" : "less")}
                            </p>
                            : null
                        } 
                    </Grid>
                    : null }


                    {   media ?
                        <FeedTweetMedia media={media} />
                        : null
                    }
                    
                    {  card ?
                            card.legacy?.name?.includes("broadcast") ? 
                            <FeedBroadcastCard 
                                card={card} 
                                creationMonthDateYear={creationMonthDateYear}
                                profileImage={profileImage.replace("normal", "x96")}
                            /> 
                            : card.legacy?.name?.includes("audiospace") ? <FeedSpacesCard />
                            : <FeedTweetCard card={card} tweetResultLegacy={tweetResultLegacy}/>
                        : null
                    } 

                    {   isQuoteStatus ? 
                        <FeedQuotedTweet 
                            quotedStatusResult={quotedStatusResult}  
                            getTweetCreationMonthDateYear={getTweetCreationMonthDateYear}
                            cleanTweetText={cleanTweetText}
                        />  
                        : null 
                    }


                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={0}
                        className="feed-tweet-replies-reposts-likes-views-stack-container"
                    > 
                        <Stack
                            direction="row" 
                            className="feed-tweet-replies-stack-container"
                        >
                            <div className="feed-tweet-replies-icon-container">
                                <svg viewBox="0 0 24 24">
                                    <path d={repliesIconSvgPathData}></path>
                                </svg>
                                <div className="feed-tweet-replies-hover-circle"></div>
                            </div>
                            <p>{replyCount}</p> 
                        </Stack>
                        
                        <Stack
                            direction="row" 
                            className="feed-tweet-reposts-stack-container"
                        >
                            <div className="feed-tweet-reposts-icon-container">
                                <svg viewBox="0 0 24 24">
                                    <path d={repostsIconSvgPathData}></path>
                                </svg>
                                <div className="feed-tweet-reposts-hover-circle"></div>
                            </div>
                            <p>{retweetCount}</p> 
                        </Stack>

                        <Stack
                            direction="row" 
                            className="feed-tweet-likes-stack-container"
                        >
                            <div className="feed-tweet-likes-icon-container"> 
                                <svg viewBox="0 0 24 24">
                                    <path d={likesIconSvgPathData}></path>
                                </svg>
                                <div className="feed-tweet-likes-hover-circle"></div>
                            </div>
                            <p>{likeCount}</p>
                        </Stack>

                        <Stack
                            direction="row" 
                            className="feed-tweet-views-stack-container"
                        >
                            <div className="feed-tweet-views-icon-container">
                                <svg viewBox="0 0 24 24">
                                    <path d={viewsIconSvgPathData}></path>
                                </svg>
                                <div className="feed-tweet-views-hover-circle"></div>
                            </div>
                            <p>{viewsCount}</p>  
                        </Stack>

                        <Stack
                            direction="row" 
                            className="feed-tweet-bookmark-and-share-stack-container"
                        >
                            <div className="feed-tweet-bookmark-icon-container">
                                <svg viewBox="0 0 24 24">
                                    <path d={bookmarkIconSvgPathData}></path>
                                </svg>
                                <div className="feed-tweet-bookmark-hover-circle"></div>
                            </div>
                            <div className="feed-tweet-share-icon-container">
                                <svg viewBox="0 0 24 24">
                                    <path d={shareIconSvgPathData}></path>
                                </svg>
                                <div className="feed-tweet-share-hover-circle"></div>
                            </div>
                        </Stack>

                    </Stack>

                </Grid>

            </div>
        </>
    )
}


export default withErrorBoundary(FeedTweet, {
    FallbackComponent: () => <GenericErrorFallback />, 
    onError(error) {
        console.log(error) ; 
    } 
}) ;
