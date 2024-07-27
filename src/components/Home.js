import React from 'react' ;
import { Stack } from "@mui/material" ; 
import { LuSearch } from "react-icons/lu";
import { useNavigate } from "react-router-dom" 
import { withErrorBoundary } from 'react-error-boundary' ;


function Home() { 

    const [usernameSubmission, setUsernameSubmission] = React.useState(null) ;   
    const [usernameInput, setUsernameInput] = React.useState(null) ;  

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

    return (
        <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            spacing={0}
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
        </Stack>
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