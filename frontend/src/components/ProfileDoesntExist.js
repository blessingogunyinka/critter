import React from 'react' ;
import { Box, Avatar, Stack } from "@mui/material" ; 
import { backArrowIconSvgPathData } from "./Svg" ;  
import { withErrorBoundary } from 'react-error-boundary' 
import GenericErrorFallback from "./GenericErrorFallback.js"


function ProfileDoesntExist(props) { 
    
    return (

        <div className="profile-doesnt-exist-container">
            <Box 
                className="profile-doesnt-exist-nav-bar-box-container"
                height={53}
                width={598}
            >
                <div className="profile-doesnt-exist-nav-bar-profile">
                    <svg 
                        className="profile-doesnt-exist-nav-bar-back-button"
                        viewBox="0 0 24 24"
                    >
                        <path d={backArrowIconSvgPathData}></path> 
                    </svg>
                    <p className="profile-doesnt-exist-nav-bar-profile-text">
                        <b>Profile</b>
                    </p>
                    <div className="profile-doesnt-exist-nav-bar-back-button-hover-circle"></div>
                </div> 
            </Box> 
            
            <Box 
                className="profile-doesnt-exist-info-box"
            >
                <div className="profile-doesnt-exist-banner"></div>
                <Avatar 
                    sx={{ width: 133.5, height: 133.5, bgcolor: "rgba(247,249,249,1.00)"}} 
                    className="profile-doesnt-exist-banner-avatar"
                >
                    {" "}
                </Avatar>
                <div className="profile-doesnt-exist-user-title-at-name">
                    <b>@{props.username}</b>
                </div>
                <div className="profile-doesnt-exist-account-doesnt-exist-text">This account doesn't exist</div>
                <div className="profile-doesnt-exist-search-for-another-text">Try searching for another.</div>
            </Box>
        </div>

    )
}


export default withErrorBoundary(ProfileDoesntExist, {
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