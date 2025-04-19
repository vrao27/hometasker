import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChecklistIcon from "@mui/icons-material/Checklist";
import { Button, Link, Menu, MenuItem, Typography } from "@mui/material";

const drawerWidth = 240;

export default function Sidebar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Drawer
      variant="permanent"
      elevation={100}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Box sx={{ overflow: "auto" }}>
        <Typography
          align="center"
          variant="h4"
          noWrap
          component="div"
          marginTop={3}
          marginBottom={3}
        >
          Hometasker
        </Typography>

        <List>
          <ListItem key={"list"} disablePadding>
            <ListItemButton
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <ListItemIcon></ListItemIcon>
              
              <ListItemText primary={"Account"} />
            </ListItemButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Settings</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </ListItem>

          <ListItem key={"list"} disablePadding>
            <ListItemButton href="/home/">
              <ListItemIcon>
                <ChecklistIcon></ChecklistIcon>
              </ListItemIcon>

              <ListItemText primary={"Tasks"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"statistics"} disablePadding>
            <ListItemButton href="/scoreboard/">
              <ListItemIcon></ListItemIcon>

              <ListItemText primary={"Scoreboard"} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"about"} disablePadding>
            <ListItemButton href="/about/">
              <ListItemIcon></ListItemIcon>

              <ListItemText primary={"About"} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
