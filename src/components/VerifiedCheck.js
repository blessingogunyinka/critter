import React from "react"
import { blueCheckIconSvgPathData, goldCheckIconSvgPathData, grayCheckIconSvgPathData } from "./Svg.js" ; 
import { withErrorBoundary } from 'react-error-boundary' 

function VerifiedCheck({ hasBlueCheck, verifiedType, isProfileComponent }) {
    
    const className = isProfileComponent ? "profile-verified-check" : "feed-tweet-verified-check" ; 
    const viewBox = isProfileComponent ? "0 0 22 22" : "0 0.5 22 22" ; 

    if (hasBlueCheck) {
        if (verifiedType) {
            if (verifiedType === "Business") {
                return (
                    <svg 
                        className={className}
                        viewBox={viewBox}
                    >
                        <g>
                            <linearGradient gradientUnits="userSpaceOnUse" id="1-a" x1="4.411" x2="18.083" y1="2.495" y2="21.508">
                                <stop offset="0" stopColor="#f4e72a"></stop>
                                <stop offset=".539" stopColor="#cd8105"></stop>
                                <stop offset=".68" stopColor="#cb7b00"></stop>
                                <stop offset="1" stopColor="#f4ec26"></stop>
                                <stop offset="1" stopColor="#f4e72a"></stop>
                            </linearGradient>
                            <linearGradient gradientUnits="userSpaceOnUse" id="1-b" x1="5.355" x2="16.361" y1="3.395" y2="19.133">
                                <stop offset="0" stopColor="#f9e87f"></stop>
                                <stop offset=".406" stopColor="#e2b719"></stop>
                                <stop offset=".989" stopColor="#e2b719"></stop>
                            </linearGradient>
                            <g clipRule="evenodd" fillRule="evenodd">
                                <path d={goldCheckIconSvgPathData.outline} fill="url(#1-a)"></path>
                                <path d={goldCheckIconSvgPathData.finish} fill="url(#1-b)"></path>
                                <path d={goldCheckIconSvgPathData.checkmarkShadow} fill="#d18800"></path>
                            </g>
                        </g>
                    </svg>
                )
            } else if (verifiedType === "Government") {
                return (
                    <svg 
                        className={className}
                        viewBox={viewBox}
                    >
                        <g>
                            <path clipRule="evenodd" d={grayCheckIconSvgPathData} fill="#829aab" fillRule="evenodd" ></path>
                        </g>
                    </svg>
                )
            }
        } else {
            return (
                <svg 
                    className={className}
                    viewBox={viewBox}
                >
                    <path d={blueCheckIconSvgPathData} fill="#1D9BF0"></path>
                </svg>
            )
        }
    } else {
        return null ; 
    } 

}

export default withErrorBoundary(VerifiedCheck, {
    FallbackComponent: () => null,
    onError(error) {
        console.log(error) ; 
    }
}) ; 