import React, { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography } from "@mui/material";

const Home = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("response", response);
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error uploading the file", error);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "auto",
            mt: 7,
            boxShadow: 3,
            p: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
            File Summarizer
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField type="file" onChange={handleFileChange} />
            <Button type="submit" variant="contained" sx={{ ml: 3, mt: 1 }}>
              Upload
            </Button>
          </form>
        </Box>
      </Box>
      {summary && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
            Summary
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              border: "1px solid #c3c3c3",
              boxShadow: 3,
              width: "59vh",
              flexWrap: "wrap",
              margin: "0 auto",
              p: 4,
            }}
          >
            <Typography variant="body1">{summary}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Home;
