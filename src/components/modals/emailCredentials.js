import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Box, Divider, Grid, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';
import { decryptAES } from '../../utils/helper';

const EmailCredentials = ({ credentialModel, handleClose }) => {
  const { email, userEncryptPassword } = credentialModel?.credentials
  const handleCopyText = (text, type) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied.`);
  }
  return (
    <div>
      <Dialog
        maxWidth="md"
        open={credentialModel?.isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Typography variant='h3' sx={{ p: 3 }}>Email Credentials </Typography>
        <Divider />
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Grid><b>Email : </b> {email}</Grid>
            <Grid sx={{ display: 'flex' }}> <ContentCopyIcon sx={{ ml: 2 }} onClick={() => handleCopyText(email, "Email")} /></Grid>
          </Box>
          <Box sx={{ display: 'flex', mt: 2, justifyContent: 'space-between' }}>
            <Grid ><b>Password :</b> {decryptAES(userEncryptPassword)} </Grid>
            <Grid sx={{ display: 'flex' }}><ContentCopyIcon sx={{ ml: 2 }} onClick={() => handleCopyText(decryptAES(userEncryptPassword), "Password")} /></Grid>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button variant='contained' onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default EmailCredentials