import React, { useState, useEffect, useContext } from "react";
import { Typography, Button, Box } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import { AppContext } from "../../App";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const { setTopBarContent } = useContext(AppContext);

  useEffect(() => {
    fetchModel(`/user/${userId}`)
      .then((data) => {
        setUser(data);
        setTopBarContent(`${data.first_name} ${data.last_name}`);
      })
      .catch(console.error);
  }, [userId, setTopBarContent]);

  if (!user) return null;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {user.first_name} {user.last_name}
      </Typography>
      <Typography variant="body1">
        <strong>Location:</strong> {user.location}
      </Typography>
      <Typography variant="body1">
        <strong>Occupation:</strong> {user.occupation}
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
        {user.description}
      </Typography>
      <Button
        component={Link}
        to={`/photos/${userId}`}
        variant="contained"
        color="primary"
      >
        View Photos
      </Button>
    </Box>
  );
}

export default UserDetail;
