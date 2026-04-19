import React, { useState, useEffect, useContext } from "react";
import { Typography, Divider, Box, Paper } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import { AppContext } from "../../App";
import fetchModel from "../../lib/fetchModelData";
import "./styles.css";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function UserPhotos() {
  const { userId } = useParams();
  const [photos, setPhotos] = useState([]);
  const { setTopBarContent } = useContext(AppContext);

  useEffect(() => {
    fetchModel(`/user/${userId}`)
      .then((data) => setTopBarContent(`Photos of ${data.first_name} ${data.last_name}`))
      .catch(console.error);
    fetchModel(`/photosOfUser/${userId}`)
      .then((data) => setPhotos(data))
      .catch(console.error);
  }, [userId, setTopBarContent]);

  return (
    <Box sx={{ p: 2 }}>
      {photos.map((photo) => (
        <Paper key={photo._id} elevation={2} sx={{ mb: 4, p: 2 }}>
          <Box
            component="img"
            src={`/images/${photo.file_name}`}
            alt={photo.file_name}
            sx={{ maxWidth: "100%", maxHeight: 400, display: "block", mb: 1 }}
          />
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            {formatDate(photo.date_time)}
          </Typography>
          {photo.comments && photo.comments.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Comments
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {photo.comments.map((comment) => (
                <Box key={comment._id} sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <Link
                      to={`/users/${comment.user._id}`}
                      style={{ fontWeight: "bold", textDecoration: "none" }}
                    >
                      {comment.user.first_name} {comment.user.last_name}
                    </Link>
                    {" — "}
                    <Typography component="span" variant="caption" color="text.secondary">
                      {formatDate(comment.date_time)}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {comment.comment}
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      ))}
    </Box>
  );
}

export default UserPhotos;
