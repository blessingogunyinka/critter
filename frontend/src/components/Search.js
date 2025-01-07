import React from 'react' ; 
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import FeedTweet from "./FeedTweet.js"
import GenericErrorFallback from "./GenericErrorFallback"
import Loading from "./Loading" 
import { Stack } from "@mui/material" ;
import { LuSearch } from "react-icons/lu";
import axios from "axios" ;
import { withErrorBoundary } from 'react-error-boundary' ;
import { sampleSearchData } from "../sampleData/sampleSearchData.js" ; 

function Search() { 

    const [searchQueryInput, setSearchQueryInput] = React.useState("") ; 
    const [searchQuerySubmission, setSearchQuerySubmission] = React.useState(null) ; 

    const [twitterSearchTweets, setTwitterSearchTweets] = React.useState(null) ; 

    const [loadingSearchResults, setLoadingSearchResults] = React.useState(null) ; 

    const [searchParams, setSearchParams] = useSearchParams() ;  
    const location = useLocation() ;

    const [displaySampleSearch, setDisplaySampleSearch] = React.useState(false) ; 

    const defaultSearchQueryButtons = { random: false, bukayoSaka: false, lenyYoro: false, lamineYamal: false, philFoden: false }

    const [sampleSearchQueryButtons, setSampleSearchQueryButtons] = React.useState(defaultSearchQueryButtons) ; 


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

    function handleClickDisplaySampleSearchResultsButton() {
        if (!displaySampleSearch) {
            setTwitterSearchTweets(sampleSearchData.random) ; 
            setSampleSearchQueryButtons({ ...defaultSearchQueryButtons, random: true }) ; 
            setDisplaySampleSearch(true) ; 
        } else {
            setTwitterSearchTweets(null) ; 
            setDisplaySampleSearch(false) ; 
        }
    }

    function handleClickSampleSearchQueries(event) {
        const buttonName = event.target.id ; 

        if (!sampleSearchQueryButtons[buttonName]) {
            const updatedSearchQueryButtons = { ...defaultSearchQueryButtons } ; 
            updatedSearchQueryButtons[buttonName] =  !sampleSearchQueryButtons[buttonName] ; 
            setSampleSearchQueryButtons(updatedSearchQueryButtons) ; 
            setTwitterSearchTweets(sampleSearchData[buttonName]) ;
        }

    }


    return (
        <>
        <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            spacing={1.5}
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
            <div 
                className="sample-search-data-button"
                onClick={handleClickDisplaySampleSearchResultsButton}
            >
                <p>{!displaySampleSearch ? "Show" : "Hide"} Sample Search Query Results</p>
            </div>
            { displaySampleSearch ?
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                className="sample-search-queries-stack"
                sx={{ flexWrap: 'wrap' }}
            >
                <div 
                    className={`sample-search-query-random-button${sampleSearchQueryButtons.random ? "-clicked" : "" }`}
                    id="random"
                    onClick={handleClickSampleSearchQueries}
                >
                    Random
                </div>
                <div 
                    className={`sample-search-query-bukayo-saka-button${sampleSearchQueryButtons.bukayoSaka ? "-clicked" : "" }`}
                    id="bukayoSaka"
                    onClick={handleClickSampleSearchQueries}
                >
                    Bukayo Saka
                </div>
                <div 
                    className={`sample-search-query-leny-yoro-button${sampleSearchQueryButtons.lenyYoro ? "-clicked" : "" }`}
                    id="lenyYoro"
                    onClick={handleClickSampleSearchQueries}
                >
                    Leny Yoro
                </div>
                <div 
                    className={`sample-search-query-lamine-yamal-button${sampleSearchQueryButtons.lamineYamal ? "-clicked" : "" }`}
                    id="lamineYamal"
                    onClick={handleClickSampleSearchQueries}
                >
                    Lamine Yamal
                </div>
                <div 
                    className={`sample-search-query-phil-foden-button${sampleSearchQueryButtons.philFoden ? "-clicked" : "" }`}
                    id="philFoden"
                    onClick={handleClickSampleSearchQueries}
                >
                    Phil Foden
                </div>
            </Stack> 
            : null }
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