import React, { useState, useEffect, useContext } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

import { AppContext } from "../../App";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function UserList() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const { setTopBarContent } = useContext(AppContext);

  useEffect(() => {
    fetchModel("/user/list").then((data) => setUsers(data)).catch(console.error);
    fetchModel("/user/stats").then((data) => setStats(data)).catch(console.error);
    setTopBarContent("User List");
  }, [setTopBarContent]);

  return (
    <List component="nav">
      {users.map((user) => {
        const userStats = stats[user._id] || { photoCount: 0, commentCount: 0 };
        return (
          <React.Fragment key={user._id}>
            <ListItem disablePadding>
              <ListItemButton component={Link} to={`/users/${user._id}`}>
                <ListItemText primary={`${user.first_name} ${user.last_name}`} />
                <Box sx={{ display: "flex", gap: 0.5, ml: 1 }}>
                  <Chip
                    label={userStats.photoCount}
                    size="small"
                    sx={{ bgcolor: "success.main", color: "white", fontWeight: "bold", cursor: "pointer" }}
                  />
                  <Chip
                    component={Link}
                    to={`/comments/${user._id}`}
                    label={userStats.commentCount}
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                    sx={{ bgcolor: "error.main", color: "white", fontWeight: "bold", cursor: "pointer" }}
                  />
                </Box>
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        );
      })}
    </List>
  );
}

export default UserList;
