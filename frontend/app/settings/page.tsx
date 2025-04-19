"use client";

import {Box, Typography } from "@mui/material";
import Sidebar from "../../components/Sidebar";

export default function Settings() {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar></Sidebar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        
        <Typography sx={{ marginBottom: 2 }}>
          Settings
        </Typography>
      </Box>
    </Box>
  );
}
