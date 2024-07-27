import React from "react"
import { Grid, Stack } from "@mui/material"
import { GoHome } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import { Link } from "react-router-dom" ; 
import { useWindowWidth } from "@react-hook/window-size" ;


export default function SideMenu() {

    const windowWidth = useWindowWidth() ;

    return (
        <>
            <Grid 
                item 
                xs={2.58}
            >
                <div className="sidemenu-container">
                    <Stack className="twitterx-logo-stack">
                        <Link to="/" className="twitterx-logo-thick-router-link">
                            <img className="twitterx-logo-thick" src={require("../images/twitterx-logo-thick.png")} />
                        </Link>
                    </Stack>

                    <Stack className="sidemenu-stack" spacing={0.5}> 
                        <div 
                            className={windowWidth > 685  ? "sidemenu-item-home" : "sidemenu-item-home sidemenu-item-home-small"}
                        >
                            <Stack direction="row">
                                { windowWidth > 685 ?
                                <>
                                <Link to="/" className="sidemenu-item-home-icon-router-link">
                                    <GoHome size="23px" className="home-icon"/>
                                </Link> 
                                <Link to="/" className="sidemenu-item-text-home-router-link">
                                    <p className="sidemenu-item-text-home">Home</p>
                                 </Link>      
                                </>
                                : 
                                <Link to="/" className="sidemenu-item-home-icon-small-router-link">
                                    <GoHome size="23px" className="home-icon"/>
                                </Link> }
                            </Stack> 
                        </div>
                        <div 
                            className={windowWidth > 685  ? "sidemenu-item-search" : "sidemenu-item-search sidemenu-item-search-small"}
                        >
                            <Stack direction="row">
                                { windowWidth > 685 ?
                                <>
                                <Link to="/search" className="sidemenu-item-search-icon-router-link">
                                    <LuSearch size="21.5px" className="search-icon"/>
                                </Link> 
                                <Link to="/search" className="sidemenu-item-text-search-router-link">
                                    <p className="sidemenu-item-text-search">Search</p>
                                 </Link>      
                                </>
                                : 
                                <Link to="/search" className="sidemenu-item-search-icon-small-router-link">
                                    <LuSearch size="21.5px" className="search-icon"/>
                                </Link> }
                            </Stack> 
                        </div> 
                    </Stack> 
                </div>
            </Grid>
        </>
    )
}