import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { Divider, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';

const RemindersDialog = ({ reminders, setReminders, handleClose, handleReminderSubmit }) => {
    return (
        <Dialog
            fullWidth={true}
            open={reminders?.isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            component={'form'}
        >
            <Typography variant='h3' sx={{ p: 3 }}>Add Reminder</Typography>
            <Divider />
            <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <OutlinedInput
                    name='reminder'
                    sx={{ width: '100%' , mb:3}}
                    placeholder='Add reminder text ...'
                    size='small'
                    required
                    onChange={(e) => setReminders({ ...reminders, reminderText: e.target.value })}
                    value={reminders?.reminderText} />
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                    <InputLabel id="demo-select-small-label">Status</InputLabel>
                    <Select
                        required
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={reminders?.status || 'Pending'}
                        name="Status"
                        sx={{ height: "40px", width: "100%" }}
                        label="Type"
                        onChange={(e) => setReminders({ ...reminders, status: e?.target.value })}
                    >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="complete">Complete</MenuItem>
                        <MenuItem value="declined">Declined</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2 }}>
                <Button variant='contained' onClick={handleClose}>Cancel</Button>
                <Button variant='contained' onClick={() => handleReminderSubmit()}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}

export default RemindersDialog