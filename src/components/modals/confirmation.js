import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Divider, Typography } from '@mui/material';

const ConfirmationDialog = ({ data, handleClose, handleSubmit }) => {
    return (
        <Dialog
            maxWidth="md"
            open={data?.isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <Typography variant='h3' sx={{ p: 3 }}>Are you sure ?</Typography>
            <Divider />
            <DialogContent>{data?.text}</DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2 }}>
                <Button variant='contained' onClick={() => handleSubmit(data?.id)}>Yes</Button>
                <Button variant='contained' onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmationDialog