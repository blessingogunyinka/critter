import express from "express"
import cors from "cors" 
import axios from "axios"
import { parse } from "node-html-parser"
import fs from "fs"
import userAgentsArray from "./userAgents.js"


const app = express() ; 
const PORT = process.env.PORT || 5000 ; 
app.use(cors()) ; 


function getRandomUserAgent() {

    const userAgentRandomIndex = Math.trunc(Math.random()*userAgentsArray.length)
    return userAgentsArray[userAgentRandomIndex]
}


async function generateNewGuestToken() {

    const newGuestToken = 
    await fetch("https://api.x.com/1.1/guest/activate.json", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.5",
            "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
            "content-type": "application/x-www-form-urlencoded",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-gpc": "1",
            "x-twitter-active-user": "yes",
            "x-twitter-client-language": "en",
            "Referer": "https://x.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": "",
        "method": "POST",
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error generating new guest token")
        }
        return response.json()
    })
    .then(data => { return data.guest_token })
    .catch(error => { 
        console.log(error) ;
        return null ; 
    })

    return newGuestToken ; 

}

 
function isGuestTokenExpired() {
    try {
        const tokenData = fs.readFileSync("./token.json") ; 
        const tokenDataJson = JSON.parse(tokenData) ; 
        const expiry = tokenDataJson.expireTime ; 
        return Date.now() >= expiry ? true : false ; 
    } catch (error) {
        console.log(error) ; 
    }
}

async function getGuestToken() {
    try {
        if (isGuestTokenExpired()) {
            const expiry = Date.now() + 9e6 ; 
            const newGuestToken = await generateNewGuestToken() ;
            if (!newGuestToken) {
                throw new Error("Error generating new guest token") ; 
            }
            const tokenDataJson = { guestToken: newGuestToken, expireTime: expiry }
            const tokenData = JSON.stringify(tokenDataJson)
            fs.writeFileSync("./token.json", tokenData)
            return newGuestToken ; 
        } else {
            const tokenData = fs.readFileSync("./token.json") ;
            const tokenDataJson = JSON.parse(tokenData) ;
            return tokenDataJson.guestToken
        }
    } catch (error) {
        console.log(error) ; 
        return null ; 
    }
}


async function getUsernameData(username) {

    const guestToken = await getGuestToken() ;

    if (!guestToken) {
        return null ; 
    }

    const usernameDataResponse = await fetch(`https://api.x.com/graphql/QGIw94L0abhuohrr76cSbw/UserByScreenName?variables=%7B%22screen_name%22%3A%22${username}%22%7D&features=%7B%22hidden_profile_subscriptions_enabled%22%3Atrue%2C%22profile_label_improvements_pcf_label_in_post_enabled%22%3Afalse%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22subscriptions_verification_info_is_identity_verified_enabled%22%3Atrue%2C%22subscriptions_verification_info_verified_since_enabled%22%3Atrue%2C%22highlights_tweets_tab_ui_enabled%22%3Atrue%2C%22responsive_web_twitter_article_notes_tab_enabled%22%3Atrue%2C%22subscriptions_feature_can_gift_premium%22%3Atrue%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%7D&fieldToggles=%7B%22withAuxiliaryUserLabels%22%3Afalse%7D`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
            "content-type": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-gpc": "1",
            // Twitter recently, in an attempt to clamp down on web scraping, added a new header to their API request headers called "x-client-transaction-id".
            // There is a fellow named "obfio" on Github that was able to create a generator for this header in Go through some complicated reverse engineering. 
            // The explanation can be found on their blog https://antibot.blog. Plan to revisit this at some point...
            // "x-client-transaction-id": "",
            "x-guest-token": `${guestToken}`,
            "x-twitter-active-user": "yes",
            "x-twitter-client-language": "en"
        },
        "referrer": "https://x.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    })
    .then(response => {
        console.log(response) ; 
        if (response.status !== 200) {
            throw new Error("Network response not okay")
        }
        return response.json() ; 
    })
    .then(data => { return data })
    .catch(error => {
        console.log(error) ; 
        return null ; 
    }) 

    return usernameDataResponse ; 
}


async function fetchTweetResponse(tweetStatusNumber) {

    const guestToken = await getGuestToken() ;

    if (!guestToken) {
        return null ; 
    }

    const tweetResponse = await fetch(`https://api.twitter.com/graphql/OUKdeWm3g4tDbW5hffX_QA/TweetResultByRestId?variables=%7B%22tweetId%22%3A%22${tweetStatusNumber}%22%2C%22withCommunity%22%3Afalse%2C%22includePromotedContent%22%3Afalse%2C%22withVoice%22%3Afalse%7D&features=%7B%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22rweb_video_timestamps_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D&fieldToggles=%7B%22withArticleRichContentState%22%3Atrue%7D`, {
        "headers": { 
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.5",
            "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
            "content-type": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-gpc": "1",
            "x-guest-token": `${guestToken}`,
            "x-twitter-active-user": "yes",
            "x-twitter-client-language": "en",
            "Referer": "https://twitter.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    })
    .then(response => { 
        if (!response.ok) {
            throw new Error("Network response not okay")
        }
        return response.json() ;
    })
    .then(data => { return data })
    .catch(error => {
        console.log(error) ; 
        return null ; 
    })

    return tweetResponse ; 

}


async function getTweetsDataStartpage(searchQuery, username) { 

    const userAgent = getRandomUserAgent() ; 
    
    const searchResults = await axios.get(`https://www.startpage.com/do/search?query=${searchQuery}%20site%3Atwitter.com%2F${username}&t=device&lui=english&cat=web&prfe=311ca09fda2236732deadb6571c730b747a0d511585eeea2979b0f1ce7898ce035b9973e5164c726eb066667bac4546d812c2c12bbaec30ea01c70c9db6c5c10fa289c3b36c8b8a72027f62f`, 
                            { headers: { 'User-Agent': userAgent } })
                            .then(response => { 
                                // if (response.status !== 200) {
                                //     throw new Error("Error getting search results from Startpage")
                                // }
                                return response ;
                            })
                            .catch(error => { 
                                console.log(error) ;  
                                return null ; 
                            })

    if (!searchResults) {
        return null ; 
    }
                            

    const searchResultsHtml = parse(searchResults.data)

    const filteredLinks = [...searchResultsHtml.querySelectorAll('span.link-text')]
                            .map(el => el.innerText)
                            .filter(el => el.startsWith("https://twitter.com") && el.includes("/status/"))


    if (filteredLinks.length === 0) {
        return null ; 
    }

    
    let tweetsData ; 
    try {
        tweetsData = await Promise.all(filteredLinks.map(async (link) => {
            const tweetStatusNumber = link.match(/[^status\/]\d+[^\D]/)[0] ; 
            return await fetchTweetResponse(tweetStatusNumber) ; 
        }))
    } catch (error) {
        console.log("Error getting tweet response data ") ; 
        return null ; 
    }

    tweetsData = tweetsData.filter(el => el)

    return tweetsData ; 
}


app.get("/search", async (req, res) => {

    try {
        const searchQuery = encodeURI(req.query.q) ; 

        const tweetsSearchData = await getTweetsDataStartpage(searchQuery, "") ; 

        if (!tweetsSearchData) {
            res.send(null) ; 
            return ; 
        } else if (tweetsSearchData && Object.keys(tweetsSearchData).length === 0) {
            res.send(null) ; 
            return ; 
        }

        res.send(tweetsSearchData) ; 
        return ; 

    }
    catch (error) {
        console.log(error) ; 
        res.send(null)
        return ; 
    }

})


app.get("/:username", async (req, res) => {

    try {
        const { username } = req.params ; 

        const usernameData = await getUsernameData(username) ; 

        if (usernameData && Object.keys(usernameData.data).length === 0) {
            res.send({usernameData: usernameData, userTweetsData: null}) ; 
            return ; 
        }

        let userTweetsData = await getTweetsDataStartpage("", username) ; 

        if (usernameData && !userTweetsData) {
            res.send({usernameData , userTweetsData: []}) ; 
            return ; 
             
        } else if (!usernameData && !userTweetsData) {
            res.send(null) ; 
            return ; 
        }

        try {
            userTweetsData.sort((a,b) => {
                const dateTimeA = Date.parse(a.data.tweetResult.result.legacy.created_at)
                const dateTimeB = Date.parse(b.data.tweetResult.result.legacy.created_at) 
                return dateTimeB - dateTimeA
            })
        } catch (error) {
            console.log(error) ; 
        }

        res.send({usernameData, userTweetsData}) ; 
        return ;


    } catch (error) {
        console.log(error) ; 
        res.send(null) ; 
        return ; 
    }

})


app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`)
})

