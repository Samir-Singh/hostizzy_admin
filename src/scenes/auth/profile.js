import React, { useState } from 'react'
import { Box } from '@mui/system';
import API from "../../config/api";
import { styled } from '@mui/material/styles';
import Header from '../../components/Header';
import { Grid, OutlinedInput, Paper, Typography } from '@mui/material';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import { useFormik } from "formik";
import * as yup from "yup";
import './index.css';
import { toast } from 'react-toastify';

const ItemLeft = styled(Typography)(({ theme }) => ({
    fontSize: '18px',
    textAlign: 'left',
}));

const ItemRight = styled(Typography)(({ theme }) => ({
    textAlign: 'right',
    fontSize: '18px',
    fontWeight: '700',
}));

const checkoutSchema = yup.object().shape({
    display_name: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
});

const Profile = ({ user, validateUser }) => {
    const api = new API();
    const [userInfo, setUserInfo] = useState({
        // user,
        isPassword: false,
        isEdit: false
    })

    const formik = useFormik({
        initialValues: user,
        validationSchema: checkoutSchema,
        onSubmit: async (values) => {
            const payload = {
                email: values?.email,
                display_name: values?.display_name
            }
            const response = await api.put(`users/user/${user?._id}`, payload);
            if (response?.success) {
                setUserInfo({ isEdit: false })
                validateUser()
                toast.success("Profile updated sucessfully.");
            }
        }
    })

    return (
        <Box m="20px">
            <Header title={'Profile'} />
            <Paper sx={{ p: 3, width: '70%', mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='h5'><b>User Information</b></Typography>
                    <Box spacing={2} >
                        {!userInfo?.isEdit
                            ? <BorderColorIcon sx={{ cursor: 'pointer' }} onClick={() => setUserInfo({ isEdit: true })} />
                            : <Box>
                                <ClearIcon sx={{ mr: 3 }} className='action_icons' onClick={() => setUserInfo({ isEdit: false })} />
                                <DoneIcon onClick={formik?.handleSubmit} className='action_icons' />
                            </Box>
                        }
                    </Box>
                </Box>
                {/* onSubmit={handleEditSubmit} */}
                <Grid container
                    spacing={2}
                    sx={{ mt: 1 }}
                >
                    <Grid item xs={2}><ItemRight>Name :</ItemRight></Grid>
                    <Grid item xs={10}>
                        {userInfo?.isEdit ? <OutlinedInput
                            size='small'
                            name='display_name'
                            value={formik?.values?.display_name}
                            onChange={formik?.handleChange}
                        /> : <ItemLeft>{formik?.values?.display_name}</ItemLeft>}
                    </Grid>
                    <Grid item xs={2}><ItemRight>Email :</ItemRight></Grid>
                    <Grid item xs={10}>
                        {userInfo?.isEdit ? <OutlinedInput
                            size='small'
                            name='email'
                            value={formik?.values?.email}
                            onChange={formik?.handleChange}
                        /> : <ItemLeft>{formik?.values?.email}</ItemLeft>}
                    </Grid>
                </Grid>
            </Paper>
            {user?.created_by && user?.role === 'sub_admin' && <Box sx={{ mt: 3 }}>
                <Paper sx={{ p: 3, width: '70%', mt: 1 }}>
                    <Typography variant='h5'><b>Parent Information</b></Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={2}>
                            <ItemRight>Name :</ItemRight>
                        </Grid>
                        <Grid item xs={10}>
                            <ItemLeft>{user?.created_by?.display_name}</ItemLeft>
                        </Grid>
                        <Grid item xs={2}>
                            <ItemRight>Email :</ItemRight>
                        </Grid>
                        <Grid item xs={10}>
                            <ItemLeft>{user?.created_by?.email}</ItemLeft>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>}

            {/* <Paper sx={{ p: 3, width: '70%', mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='h5'><b>Update Password</b></Typography>
                    <Box spacing={2} >
                        {!userInfo?.isPassword
                            ? <BorderColorIcon sx={{ cursor: 'pointer' }} onClick={() => setUserInfo({ isPassword: true })} />
                            : <Box>
                                <ClearIcon sx={{ mr: 3 }} className='action_icons' onClick={() => setUserInfo({ isPassword: false })} />
                            </Box>
                        }
                    </Box>
                </Box>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={2}><ItemRight>Password :</ItemRight></Grid>
                    <Grid item xs={10}>
                        {userInfo?.isPassword ? <OutlinedInput
                            size='small'
                            name='display_name'
                            onChange={formik?.handleChange}
                        /> : <ItemLeft>*********</ItemLeft>}
                    </Grid>
                </Grid>
            </Paper> */}
        </Box>
    )
}

export default Profile