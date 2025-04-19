"use client";

import { AppBar, Box, CssBaseline, Toolbar, Typography } from "@mui/material";
import Sidebar from "../../components/Sidebar";



export default function Scoreboard() {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Hometasker
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar></Sidebar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography sx={{ marginBottom: 2 }}>
          Your Score:
        </Typography>
      </Box>

    </Box>
  );
}