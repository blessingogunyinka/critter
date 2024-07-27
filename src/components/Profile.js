import React from 'react';
import { Box } from "@mui/material"
import FeedTweet from "./FeedTweet.js"
import ProfileDoesntExist from "./ProfileDoesntExist.js" ; 
import Loading from "./Loading"
import { calendarIconSvgPathData, locationIconSvgPathData, urlIconSvgPathData, 
    birthdayBalloonIconSvgPathData, professionSvgPathData, blueCheckIconSvgPathData } from "./Svg.js" ; 

import { Avatar, Stack } from '@mui/material' ; 
import { useParams } from "react-router-dom" ;
import { Parser } from "html-to-react";  
import { withErrorBoundary } from 'react-error-boundary' 
import GenericErrorFallback from "./GenericErrorFallback.js"
import axios from "axios" ;
import VerifiedCheck from "./VerifiedCheck.js"

function Profile() {

    const params = useParams() ;
    const [twitterProfileData, setTwitterProfileData] = React.useState(null) ;  
    const [displayFallback, setDisplayFallback] = React.useState(<Loading />) ; 

    React.useEffect(() => {
        async function getTwitterProfileData(username) {
            try {
                const userData = await axios.get(`http://localhost:5000/${username}`) ;
                
                if (!userData.data) {
                    setDisplayFallback(<div style={{ marginLeft: "30%", marginTop: "35%" }}><GenericErrorFallback /></div>) ;  
                }
                else if (userData.data.usernameData && Object.keys(userData.data.usernameData.data).length === 0) {
                    setDisplayFallback(<ProfileDoesntExist username={username} />) ; 
                } else {
                    console.log("\n userData: ", userData) ;   
                    setTwitterProfileData(userData.data)
                }
            }
            catch (error) {
                console.log(error) ; 
                setDisplayFallback(<div style={{ marginLeft: "30%", marginTop: "35%" }}><GenericErrorFallback /></div>) ; 
            }
        }
        if (params.username !== null) {
            getTwitterProfileData(params.username) ;  
        }
    }, []) ; 


    const userLegacy = twitterProfileData?.usernameData?.data?.user?.result?.legacy 
    || twitterProfileData?.userTweetsData[0]?.data?.tweetResult?.result?.core?.user_results?.result?.legacy ; 

    const userResult = twitterProfileData?.usernameData?.data?.user?.result 
    || twitterProfileData?.userTweetsData[0]?.data?.tweetResult?.result?.core?.user_results?.result ; 

    const userTitle = userLegacy?.name // 
    const postsCount = userLegacy?.statuses_count
    const atName = userLegacy?.screen_name
    const followingCount = userLegacy?.friends_count
    const followersCount = userLegacy?.followers_count                    
    const subscriptionsCount = userResult?.creator_subscriptions_count ; 
    const profileDescription = userLegacy?.description
    const location = userLegacy?.location
    const displayUrl = userLegacy?.entities?.url?.urls[0]?.display_url
    const expandedUrl = userLegacy?.entities?.url?.urls[0]?.expanded_url
    const birthdate = userResult?.legacy_extended_profile?.birthdate ; 
    const professional = userResult?.professional ; 
    const profileBannerUrl = userLegacy?.profile_banner_url ;  
    const profileImageUrl = userLegacy?.profile_image_url_https ; 
    const hasBlueCheck = userResult?.is_blue_verified ;  
    const verifiedType = userLegacy?.verified_type ;

    const profileDescriptionUrls = userLegacy?.entities?.description?.urls ; 
    
    function getProfessionSvgPathData() {
        return professionSvgPathData[professional.category[0].icon_name]
    }
    
    function getMonthAndYearJoined() {
        const joinedTwitter = new Date(userLegacy.created_at) ;  
        const tempDate = new Date() ;  
        tempDate.setMonth(joinedTwitter.getMonth()) ; 
        const month = tempDate.toLocaleString("en-US", { month: "short"}) ; 
        const monthAndYear = month + " " + joinedTwitter.getFullYear() ;
        return monthAndYear ; 
    }

    function getBirthdayMonth() {
        const tempDate = new Date() ; 
        tempDate.setMonth(birthdate.month - 1) ; 
        const month = tempDate.toLocaleString("en-US", { month: "long" }) ; 
        return month ; 
    }

    // Following, Followers, Subscriptions
    function formatCountNumber(count) {
        const digits = count.toString().length ;  
        if (count >= 1000000) {
            if (count.toString()[digits-6] > 0) {
                return `${(count/1000000).toString().slice(0,digits-4)}M`
            } else {
                return `${(count/1000000).toString().slice(0,digits-6)}M`
            }
        } else if (count >= 10000) {
            if (count.toString()[digits-3] > 0) {
                return `${(count/1000).toString().slice(0,digits-1)}K`
            } else {
                return `${(count/1000).toString().slice(0,digits-3)}K`
            }
        } else {
            return count.toLocaleString() ;  
        }
    }


    function formatProfileDescription(text) {

        const atNamePattern =  /@[A-Za-z0-9\_]+/g ;
        const hashtagPattern = /#[A-Za-z_]+/g ;
        const cashtagPattern = /\$[A-Za-z]+/g ;
        const combinedPatternRegExp = /@[A-Za-z0-9\_]+|#[A-Za-z_]+|\$[A-Za-z]+/g ;

        let formattedText = text ; 
        
        if (formattedText.match(combinedPatternRegExp)) {
            formattedText = formattedText.replace(combinedPatternRegExp, (substr) => {
                if (substr.match(atNamePattern)) {
                    return `<a className="anyUserAtName" target="_blank" href="./${substr.slice(1)}">${substr}</a>`
                } else if (substr.match(hashtagPattern) || substr.match(cashtagPattern)) {
                    return `<a className="anyHashtagOrCashtag" target="_blank" href="./search?q=${substr}">${substr}</a>`
                } 
            })
        }

        if (profileDescriptionUrls.length > 0) {
            profileDescription.urls.map(urlObject =>
                formattedText = formattedText.replace(urlObject.url, `<a className="anyUrl" target="_blank" href="${urlObject.expanded_url}">${urlObject.display_url}</a>`)
            )
        }

        const htmlToReactParser = new Parser() ; 

        return ( 
            <div>{htmlToReactParser.parse(formattedText)}</div>
        )

    }
    

    return (
        <>
        { twitterProfileData ?

        <div className="profile-box-container">
            
            <Box 
                className="profile-nav-bar"
                height={53}
                width={598}
            >
                <div className="profile-nav-bar-user-title">
                    <b>{userTitle}</b>
                    <VerifiedCheck hasBlueCheck={hasBlueCheck} verifiedType={verifiedType} isProfileVerifiedCheck={true} /> 
                </div> 
                <p className="profile-nav-bar-posts-count">{formatCountNumber(postsCount)} posts</p> 
            </Box> 
            
            <Box 
                className="profile-info-box"
            >
                <img
                    className="profile-banner" 
                    src={profileBannerUrl}
                />
                <Avatar 
                    sx={{ width: 133.5, height: 133.5 }}
                    className="profile-banner-avatar"
                >
                    <img
                        className="profile-banner-avatar-image"
                        src={profileImageUrl.replace("normal", "400x400")}  
                    />
                </Avatar>
                <div className="profile-info-user-title">
                    <b>{userTitle}</b>
                    <VerifiedCheck hasBlueCheck={hasBlueCheck} verifiedType={verifiedType} isProfileComponent={true} />
                </div>
                <div className="profile-info-at-name">@{atName}</div>
                <Stack
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="flex-start"
                    spacing={1.15}
                    className="profile-info-stack-container"
                > 
                    <div className="profile-info-user-description">{formatProfileDescription(profileDescription)}</div> 
                    <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        flexWrap="wrap"
                        spacing={0}
                        className="profile-info-personal-info-stack-container"
                    >
                        { professional ? 
                        <Stack
                            direction="row" 
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            spacing={0.5}
                            className="profile-info-occupation-stack-container"
                        >
                            <svg className="profile-info-occupation-icon" viewBox="0 0 24 24">
                                <path d={professionSvgPathData[professional.category[0].icon_name]}></path>
                            </svg>
                            <div className="profile-info-occupation">
                                <p>{professional.category[0].name}</p>
                            </div>
                        </Stack> : null } 

                        { location ? 
                        <Stack
                            direction="row" 
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            spacing={0.5}
                            className="profile-info-location-stack-container"
                        >
                            <svg className="profile-info-location-icon" viewBox="0 0 24 24">
                                <path d={locationIconSvgPathData}></path>
                            </svg>
                            <div className="profile-info-location-city-state">
                                <p>{location}</p>
                            </div>
                        </Stack> : null } 

                        
                        { displayUrl ? 
                        <Stack
                            direction="row" 
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            spacing={0.5}
                            className="profile-info-user-url-stack-container"
                        >
                            <svg className="profile-info-url-icon" viewBox="0 0 24 24">
                                <path d={urlIconSvgPathData}></path>
                            </svg>
                            <div className="profile-info-user-url">
                                <a href={expandedUrl}><p>{displayUrl}</p></a> 
                            </div>
                        </Stack> : null }


                        { birthdate ? 
                        <Stack
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            spacing={0.5}
                            className="profile-info-birthday-stack-container"
                        >
                            <svg className="profile-info-birthday-balloon-icon" viewBox="0 0 24 24">
                                <path d={birthdayBalloonIconSvgPathData}></path>
                            </svg>
                            <div className="profile-info-birthdate">
                                <p>Born {getBirthdayMonth() + " " + birthdate.day}</p>  
                            </div>

                        </Stack> : null }

                        <Stack
                            direction="row" 
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            spacing={0.5}
                            className="profile-info-user-joined-stack-container"
                        >
                            <svg className="profile-info-calendar-icon" viewBox="0 0 24 24">
                                <path d={calendarIconSvgPathData}></path>
                            </svg>
                            <div className="profile-info-month-year-joined">
                                <p>Joined {getMonthAndYearJoined()}</p>
                            </div>
                        </Stack>       
                    </Stack>

                    <Stack
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                        spacing={0} 
                        className="profile-info-following-followers-subscriptions-stack-container"
                    >
                        <p className="profile-info-following"><b>{formatCountNumber(followingCount) + " "}</b>Following</p>
                        <p className="profile-info-followers"><b>{formatCountNumber(followersCount) + " "}</b>Followers</p>
                        { subscriptionsCount ? 
                        <p className="profile-info-subscriptions"><b>{formatCountNumber(subscriptionsCount) + " "}</b>Subscriptions</p> 
                        : null }
                    </Stack>

                </Stack>

                <div className="profile-info-posts-tab">
                    <p><b>Posts</b></p>
                    <div className="profile-info-posts-tab-blue-underline"></div>
                </div>
            </Box>

            {twitterProfileData?.userTweetsData.map((tweetData) => {
                
                return (
                    <FeedTweet
                        tweetData={tweetData}
                    />
                )
                
            })}  
           
        </div>   
        : displayFallback }
        </>
    )
}


export default withErrorBoundary(Profile, {
    FallbackComponent: () =>
    <Stack
        justifyContent="center"
        alignItems="center"
        className="profile-generic-error-fallback"
    >
        <GenericErrorFallback />
    </Stack>,
    onError(error) {
        console.log(error) ; 
    }
}) ;  