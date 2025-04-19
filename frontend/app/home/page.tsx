"use client";

import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import { CheckBox } from "@mui/icons-material";



export default function Home() {
  return (
    
    <Box sx={{ display: 'flex' }}>
      <Sidebar></Sidebar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography sx={{ marginBottom: 2 }}>
          <List>
            <ListItem>
                <CheckBox></CheckBox>
                <ListItemText primary={'Task1'} />
            </ListItem>
            <ListItem>
                Task 2
            </ListItem>
            <ListItem>

                Task 3
            </ListItem>
          </List>
        </Typography>
      </Box>

    </Box>
  );
}