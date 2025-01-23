import React from 'react' ;
import { Stack } from "@mui/material" ; 
import { LuSearch } from "react-icons/lu";
import { useNavigate } from "react-router-dom" 
import { withErrorBoundary } from 'react-error-boundary' ;
import Profile from './Profile' ; 
import { sampleProfileData } from "../sampleData/sampleProfileData.js" ; 
import Loading from './Loading' ;


function Home() { 

    const [usernameSubmission, setUsernameSubmission] = React.useState(null) ;   
    const [usernameInput, setUsernameInput] = React.useState(null) ;  

    const [displaySampleProfile, setDisplaySampleProfile] = React.useState(false) ; 

    const [sampleProfile, setSampleProfile] = React.useState(null) ; 

    const defaultProfileButtons = { onefootball: false, realmadrid: false }

    const [sampleProfileButtons, setSampleProfileButtons] = React.useState(defaultProfileButtons) ; 

    const navigate = useNavigate() ;  

    function handleChange(event) {
        const key = event.target.value.slice(-1) ; 

        if (/[A-Za-z0-9\_]+/.test(key) || key === "") {
            setUsernameInput(event.target.value) ;
        } 
    } 

    function handleUsernameSubmission() {  
        setUsernameSubmission(usernameInput) ; 
        navigate(`/${usernameInput}`) ;
    }

    function handleKeyDown(event) {

        if (event.key === "Enter") {

            event.preventDefault() ; 

            if (document.activeElement.id === "home-enter-username-input" && usernameInput.length > 0) {
                handleUsernameSubmission() ; 
            }
        }
        
        if (/[A-Za-z0-9\_]+/.test(event.key)) {
            return event.key ;  
        }
    } 

    function handleClickDisplaySampleProfileButton() {
        if (!displaySampleProfile) {
            setSampleProfile(<Profile sampleProfileData={sampleProfileData.onefootball} />)
            setSampleProfileButtons({ ...defaultProfileButtons, onefootball: true }) ; 
            setDisplaySampleProfile(true) ; 
        } else {
            setSampleProfile(null) ; 
            setDisplaySampleProfile(false) ; 
        }
    }

    function handleClickSampleProfile(event) {
        const buttonName = event.target.id ; 

        if (!sampleProfileButtons[buttonName]) {
            const updatedProfileButtons = { ...defaultProfileButtons } ; 
            updatedProfileButtons[buttonName] =  !sampleProfileButtons[buttonName] ; 
            setSampleProfileButtons(updatedProfileButtons) ; 
            setSampleProfile(<Profile sampleProfileData={sampleProfileData[buttonName]} />)
        }

    }

    return (
        <>
        <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
            className="home-enter-username-stack-container"
        >
            <form className="home-enter-username-form">
                <LuSearch size="23px" className="home-enter-username-lusearch-icon"/> 
                <p className="home-enter-username-static-placeholder">@</p> 
                <input 
                    id="home-enter-username-input" 
                    type="text"
                    placeholder="Enter Twitter Username"
                    required
                    minLength="1"
                    maxLength="15"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange} 
                    value={usernameInput}
                /> 
            </form>
            <div 
                className="sample-profile-button"
                onClick={handleClickDisplaySampleProfileButton}
            >
                <p>{!displaySampleProfile ? "Show" : "Hide"} Sample Profile</p>
            </div>

            { displaySampleProfile ?
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                className="sample-profile-stack"
                sx={{ flexWrap: 'wrap' }}
            >
                <div 
                    className={`sample-profile-onefootball-button${sampleProfileButtons.onefootball ? "-clicked" : "" }`}
                    id="onefootball"
                    onClick={handleClickSampleProfile}
                >
                    @onefootball
                </div>
                <div 
                    className={`sample-profile-realmadrid-button${sampleProfileButtons.realmadrid ? "-clicked" : "" }`}
                    id="realmadrid"
                    onClick={handleClickSampleProfile}
                >
                    @realmadrid
                </div>
            </Stack> 
            : null }

            <React.Suspense fallback={<Loading />}>
                {sampleProfile}
            </React.Suspense>
        </Stack>

        </>
    )
}


export default withErrorBoundary(Home, {
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