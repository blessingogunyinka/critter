import React from "react-dom" ; 
import { twitterXLogoIconSvgPathData } from "./Svg.js" ; 
import { withErrorBoundary } from 'react-error-boundary' ; 
import { Stack } from "@mui/material"

function GenericErrorFallback() {

    return (
        <div className="generic-error-fallback-component">
            <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                spacing={0}
            >
                <svg
                    className="twitter-x-icon twitter-x-icon-error-fallback-component" 
                    viewBox="0 0 24 24"
                >
                    <path d={twitterXLogoIconSvgPathData}></path> 
                </svg>
                <b>Error displaying content.</b>
            </Stack>
        </div>
    )
}

export default withErrorBoundary(GenericErrorFallback, {
    FallbackComponent: () => {
        return (
            <div className="generic-error-fallback-component">
                <b>Error</b>
            </div>
        )
    },
    onError(error) {
        console.log(error) ; 
    } 
}) ; 


