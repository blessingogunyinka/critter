import React from "react" 


export default function Loading() {

    return (
        <svg 
            className="loading-animation" 
            viewBox="0 0 32 32" 
        >
            <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4" style={{ stroke: "rgb(29, 155, 240)", opacity: "0.2"}}></circle>
            <circle cx="16" cy="16" fill="none" r="14" strokeWidth="4" style={{ stroke: "rgb(29, 155, 240)", strokeDasharray: "80", strokeDashoffset: "60" }}></circle>
        </svg>
    )
}