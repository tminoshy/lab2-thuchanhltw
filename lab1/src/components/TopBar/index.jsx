import React, { useContext } from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

import { AppContext } from "../../App";
import "./styles.css";

function TopBar() {
  const { topBarContent } = useContext(AppContext);

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
          Minh Do
        </Typography>
        <Typography variant="h6" color="inherit">
          {topBarContent}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
