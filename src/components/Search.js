import React from 'react' ; 
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import FeedTweet from "./FeedTweet.js"
import GenericErrorFallback from "./GenericErrorFallback"
import Loading from "./Loading" 
import { Stack } from "@mui/material" ;
import { LuSearch } from "react-icons/lu";
import axios from "axios" ;
import { withErrorBoundary } from 'react-error-boundary' ;

function Search() { 

    const [searchQueryInput, setSearchQueryInput] = React.useState("") ; 
    const [searchQuerySubmission, setSearchQuerySubmission] = React.useState(null) ; 

    const [twitterSearchTweets, setTwitterSearchTweets] = React.useState(null) ; 

    const [loadingSearchResults, setLoadingSearchResults] = React.useState(null) ; 

    const [searchParams, setSearchParams] = useSearchParams() ;  
    const location = useLocation() ;


    React.useEffect(() => {   
        async function getTwitterSearchTweets(query) {
            try {
                const tweetsSearchData = await axios.get(`http://localhost:5000/search?q=${query}`) ;

                if (tweetsSearchData?.status !== 200 || !tweetsSearchData?.data) {
                    throw new Error("Request error or Null data")
                }

                console.log("\n data: ", tweetsSearchData) ; 
                setTwitterSearchTweets(tweetsSearchData.data) ;      
            }
            catch (error) {
                console.log(error) ; 
                setLoadingSearchResults( <div style={{ marginLeft: "30%", marginTop: "35%" }}><GenericErrorFallback /></div> )
            }
        } 

        if (location.pathname === "/search" && searchParams.has("q") && searchParams.get("q") !== "") {
            setLoadingSearchResults(<Loading />)
            getTwitterSearchTweets(searchParams.get("q")) ; 
        } 
    }, [location])

       
    function handleChange(event) {

        const key = event.target.value.slice(-1) ; 

        if (/[A-Za-z0-9\s]+/.test(key) || key === "") {
            setSearchQueryInput(event.target.value) ;
        } 

    }


    const navigate = useNavigate() ;

    function handleSearchQuerySubmission() {
        setSearchQuerySubmission(searchQueryInput) ; 
        navigate(`/search?q=${encodeURI(searchQueryInput)}`)
    } 


    function handleKeyDown(event) {
        if (event.key === "Enter") {
            event.preventDefault() ; 
            if (document.activeElement.id === "search-input" && searchQueryInput.length > 0) {
                handleSearchQuerySubmission() ; 
            }
        }

        if (/[A-Za-z0-9\s]+/.test(event.key)) {
            return event.key ; 
        }
    } 


    return (
        <>
        <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            spacing={0}
            className="search-stack-container"
        >            
            <form className="search-form">
                <LuSearch size="23px" className="search-lusearch-icon"/>
                <input 
                    id="search-input" 
                    type="text"
                    placeholder="Search"
                    required
                    minLength="1"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange} 
                    value={searchQueryInput}
                /> 
            </form>
        </Stack>
        { twitterSearchTweets ?
        <React.Suspense fallback={<Loading />}>
            <div className="search-results-border"></div> 
            {twitterSearchTweets?.map((tweetData) => {
                return (
                    <FeedTweet
                        tweetData={tweetData}
                    />
                ) 
            })}
        </React.Suspense>
        : loadingSearchResults }
        </>
    )
}


export default withErrorBoundary(Search, {
    FallbackComponent: () => {
        return (
            <div style={{marginTop: "20%", marginLeft: "50%", color: "red", fontSize: "25px"}}>
                <b>Error</b>
            </div>
        )
    },
    onError(error) {
        console.log(error) ;   
    } 
}) ;