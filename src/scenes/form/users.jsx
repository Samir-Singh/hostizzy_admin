import React, { useState, useEffect } from "react";
import { Box, Button, CircularProgress, OutlinedInput } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { withCookies } from "react-cookie";
import API from "../../config/api";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const initialValues = {
  display_name: "",
  email: "",
};

const checkoutSchema = yup.object().shape({
  display_name: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
});

const Form = ({ user }) => {
  const api = new API();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const text = userId ? "Update sub admin" : "Add sub admin";

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: checkoutSchema,
    onSubmit: async (values) => {
      try {
        values.created_by = user?._id;
        setLoading(true);
        const response = userId
          ? await api.put(`users/user/${userId}`, values)
          : await api.post("users/register", values);
        if (response?.success) {
          setLoading(false);
          navigate("/sub_admins");
          toast.success(
            `Sub-admin ${userId ? "updated" : "added"} sucessfully.`
          );
        }
      } catch (err) {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (userId) {
      handleEditUser();
    }
  }, [userId]);

  const handleEditUser = async () => {
    if (userId) {
      const response = await api.get(`users/user/${userId}`);
      if (response?.success) {
        formik.setValues({
          ...response?.data,
          password: response?.data?.userEncryptPassword,
        });
      }
    }
  };

  return (
    <Box m="20px">
      <Header title={text} subtitle="Create a new sub admin user" />
      <Box
        component="form"
        noValidate
        sx={{ mt: 1 }}
        onSubmit={formik?.handleSubmit}
      >
        <Box
          display="grid"
          rowGap="30px"
          gridTemplateColumns="repeat(1, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          <OutlinedInput
            type="text"
            placeholder="Display Name"
            onChange={formik?.handleChange}
            value={formik?.values?.display_name}
            name="display_name"
            error={
              !!formik?.touched.display_name && !!formik?.errors.display_name
            }
            helperText={
              !!formik?.touched.display_name && !!formik?.errors.display_name
            }
            sx={{ gridColumn: "span 4" }}
          />
          <OutlinedInput
            type="email"
            placeholder="Email"
            onChange={formik?.handleChange}
            value={formik?.values?.email}
            name="email"
            disabled={!!userId}
            error={!!formik?.touched.email && !!formik?.errors.email}
            helperText={!!formik?.touched.email && !!formik?.errors.email}
            sx={{ gridColumn: "span 4" }}
          />
        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
          <Button variant="contained" sx={{mr:2}} onClick={()=>navigate('/sub_admins')}>Back</Button>
          {loading ? (
            <Button type="submit" color="secondary" variant="contained">
              <CircularProgress size={20} />
            </Button>
          ) : (
            <Button type="submit" color="secondary" variant="contained">
              {text}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default withCookies(Form);
