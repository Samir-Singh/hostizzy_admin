import React, { useState } from "react";
import { styled } from "@mui/system";
import {
  Box,
  Typography,
  Button,
  Grid,
  InputAdornment,
  IconButton,
  Card,
  CircularProgress,
  OutlinedInput,
} from "@mui/material";
import * as yup from "yup";
import { Formik } from "formik";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { withCookies } from 'react-cookie';
import API from '../../config/api';
import { toast } from "react-toastify";
import useMediaQuery from "@mui/material/useMediaQuery";

const BoxCard = styled(Card)(({ cookies }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "White",
  padding: "20px",
  boxShadow: "0px 8px 30px rgba(141, 31, 36, 0.12)",
}));

const Register = ({
  setUser, cookies
}) => {
  const api = new API();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit = async (values) => {
    setLoading(true);
    const response = await api.post("users/register", values);
    if (response?.success) {
      setLoading(false);
      cookies.set('token', response.token);
      setUser(response.user);
      toast.success("Logged in sucessfully.");
    } else {
      cookies.remove('token');
      setLoading(false);
    }
  };

  return (
    <>
      <Box component="main">
        <Grid
          container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Grid item xs={4}>
            <BoxCard >
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={checkoutSchema}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                }) => (
                  <Box component={"form"} onSubmit={handleSubmit} sx={{ width: '100%', textAlign: "center" }}>
                    <Typography
                      component="span"
                      sx={{ fontWeight: "bold", fontSize: "20px", mb: 5 }}
                    >
                      Register to your Account
                    </Typography>
                    <Box
                      display="grid"
                      rowGap="30px"
                      gridTemplateColumns="repeat(1, minmax(0, 1fr))"
                      sx={{
                        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                      }}
                    >
                      <OutlinedInput
                        type="email"
                        placeholder="Email"
                        onChange={handleChange}
                        value={values.email}
                        name="email"
                        error={!!touched.email && !!errors.email}
                        helperText={!!touched.email && !!errors.email}
                        sx={{ gridColumn: "span 4", mt: 4 }}
                      />
                      <OutlinedInput
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        onChange={handleChange}
                        value={values.password}
                        name="password"
                        error={!!touched.password && !!errors.password}
                        helperText={!!touched.password && !!errors.password}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              onMouseDown={(e) => e.preventDefault()}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px">
                      {loading ? (
                        <Button type="submit" variant="contained">
                          <CircularProgress size={20} />
                        </Button>
                      ) : (
                        <Button type="submit" variant="contained">
                          Register
                        </Button>
                      )}
                    </Box>
                  </Box>
                )}
              </Formik>
              {/* <Button
                                    fullWidth
                                    onClick={() => navigate("/forgot-password")}
                                    variant="outlined"
                                    sx={{
                                        mt: 1,
                                        mb: 2,
                                        pl: 10,
                                        pr: 10,
                                        borderRadius: 18,
                                        textTransform: "capitalize",
                                    }}
                                >
                                    Forget Password
                                </Button> */}
            </BoxCard>
          </Grid>
        </Grid>
      </Box >
    </>
  );
};


const checkoutSchema = yup.object().shape({
  password: yup.string().required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
});
const initialValues = {
  password: "",
  email: "",
};

export default withCookies(Register);