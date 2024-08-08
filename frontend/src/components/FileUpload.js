import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState('');

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(event.target.result);
    };
    reader.readAsText(uploadedFile);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      onFileUpload(formData);
    }
  };

  return (
    <Box sx={{mt:3}}>
      <TextField type="file" onChange={handleFileChange} />
      <Button sx={{ml:3 ,mt:1}} onClick={handleUpload} variant='contained'>Upload</Button>
     
      {fileContent && (
        <Box>
          <Typography>File Content:</Typography>
          <pre>{fileContent}</pre>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
