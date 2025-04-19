"use client";

import { Box, Typography } from "@mui/material";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar></Sidebar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography sx={{ marginBottom: 2 }}>Content</Typography>
      </Box>
    </Box>
  );
}
