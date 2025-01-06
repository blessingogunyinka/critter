import React from "react" ; 
import SideMenu from "./components/SideMenu" ;
import Center from "./components/Center.js" ;
import { Grid } from "@mui/material"


export default function App() {

  return (
    <div>  
      <Grid container spacing={1}> 
        <SideMenu />  
        <Center />
      </Grid>   
    </div> 
  )

}


