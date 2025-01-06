import React from 'react';
import { Grid } from "@mui/material"
import { useWindowWidth } from '@react-hook/window-size'
import Profile from "./Profile" 
import Home from "./Home" 
import Search from "./Search"  
import { Routes, Route } from "react-router-dom" ; 


export default function Feed() {
    
    const windowWidth = useWindowWidth() ; 
    
    return (
        <Grid
            item 
            xs={5.65} 
            className="center-grid"
            style={{width: "574.25px"}}
        >
            <div className="center-container">
                <Routes>
                    <Route index element={<Home />} />
                    <Route path="/:username" element={<Profile />}></Route>
                    <Route path="/search" element={<Search />}></Route>
                </Routes>
            </div>
        </Grid>
    )

}

