import React, { useState, useEffect, useContext } from "react";
import { Typography, Box, Paper, Divider } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import { AppContext } from "../../App";
import fetchModel from "../../lib/fetchModelData";

function UserComments() {
  const { userId } = useParams();
  const [comments, setComments] = useState([]);
  const { setTopBarContent } = useContext(AppContext);

  useEffect(() => {
    fetchModel(`/user/${userId}`).then((user) => {
      setTopBarContent(`Comments by ${user.first_name} ${user.last_name}`);
    });

    // Fetch all users' photos concurrently to find comments by this user
    fetchModel("/user/list").then((users) => {
      Promise.all(users.map((u) => fetchModel(`/photosOfUser/${u._id}`))).then(
        (allPhotoArrays) => {
          const userComments = [];
          allPhotoArrays.forEach((photos) => {
            photos.forEach((photo) => {
              photo.comments.forEach((comment) => {
                if (comment.user._id === userId) {
                  userComments.push({ comment, photo });
                }
              });
            });
          });
          setComments(userComments);
        }
      );
    });
  }, [userId, setTopBarContent]);

  return (
    <Box sx={{ p: 2 }}>
      {comments.length === 0 && (
        <Typography variant="body1" color="text.secondary">
          No comments yet.
        </Typography>
      )}
      {comments.map(({ comment, photo }) => (
        <Paper key={comment._id} elevation={2} sx={{ mb: 3, p: 2, display: "flex", gap: 2, alignItems: "flex-start" }}>
          <Link to={`/photos/${photo.user_id}`} style={{ flexShrink: 0 }}>
            <Box
              component="img"
              src={`/images/${photo.file_name}`}
              alt={photo.file_name}
              sx={{ width: 80, height: 80, objectFit: "cover", display: "block" }}
            />
          </Link>
          <Box sx={{ flex: 1 }}>
            <Typography
              component={Link}
              to={`/photos/${photo.user_id}`}
              variant="body2"
              sx={{ textDecoration: "none", color: "primary.main", fontWeight: "bold" }}
            >
              View photo
            </Typography>
            <Divider sx={{ my: 0.5 }} />
            <Typography variant="body2">{comment.comment}</Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

export default UserComments;
