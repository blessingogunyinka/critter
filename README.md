# Critter
Critter is a twitter front-end that allows you to view twitter search results and user profile tweets without an account. Uses react front-end with express backend. 

Crawl + Twitter = Critter

## How it works

* API call is made by react front end to express backend server

* Server fetches up to 20 search results from Startpage using the **site:** search operator to restrict results to twitter.com for general search or twitter.com/username for tweets from a specific user.

* A guest token is used to fetch the twitter data. Guest tokens expire after 9e6 milliseconds or 2.5 hours, so the server checks if the current token stored in the token.json file has expired and fetches a new one if needed. 

* The twitter tweet data is fetched via the 'TweetResultByRestId' api call using the rest id number in the twitter urls grabbed from the Startpage search results. The twitter user profile data is fetched via the 'UserByScreenName' twitter API call using a username. 

* Twitter data is sent to the react front end and displayed.


## Twitter API

The Twitter API calls used are the same used when one views an individual tweet or a twitter user's profile (as a "guest" without a twitter account) using a web browser. Anyone can copy these requests as Powershell, Fetch, Node.js fetch, cuRL, etc in the Developer Tools of your web browser.

### TweetResultByRestId

<img width="1276" alt="screenshot_individual_tweet_javascript_console_fetch" src="https://github.com/user-attachments/assets/fe1d44ec-3d64-4ca0-9518-b4b8c47acfbe">

### UserByScreenName

<img width="1280" alt="screenshot_user_profile_javascript_console_fetch" src="https://github.com/user-attachments/assets/f1d47f1b-8eba-4d1d-b7e1-110e22542728">

### Guest Token

https://api.twitter.com/1.1/guest/activate.json

See: [StackOverflow](https://stackoverflow.com/questions/61140863/python-downloading-twitter-video-using-python-without-using-twitter-api/69712783#69712783)


## Screenshots

### Home 

<img width="1392" alt="screenshot_home" src="https://github.com/user-attachments/assets/d088f9d1-f68a-4cb5-a236-32eed5a02a7f">

### Profile

<img width="1392" alt="screenshot_profile" src="https://github.com/user-attachments/assets/d9ba20ef-2d61-43ce-ae2d-cfb88dbfd99f">

### Search

<img width="1392" alt="screenshot_search" src="https://github.com/user-attachments/assets/22d4b88f-d069-4f76-9875-8aadaed865a1">

### Search Results

<img width="1392" alt="screenshot_search_results_bukayo_saka" src="https://github.com/user-attachments/assets/44e1ab3c-6932-4073-b258-2a2e7958c4fd">
