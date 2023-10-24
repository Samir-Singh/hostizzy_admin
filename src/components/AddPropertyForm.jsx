import React from "react";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import "./index.css";
import { useNavigate } from "react-router-dom";

const propertyFields = [
  { name: "name", label: "Name", type: "text" },
  { name: "price", label: "Price", type: "text" },
  {
    name: "price_time_period",
    label: "Price Time Period (months/years/day/night)",
    type: "text",
  },
];

const PropertyAddressList = [
  { name: "address", label: "Address", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "state", label: "State", type: "text" },
  { name: "zip", label: "Zip", type: "text" },
  { name: "country", label: "Country", type: "text" },
];

const PropertyDescription = [
  { name: "description", label: "Description", type: "textarea" },
  { name: "short_description", label: "Short Description", type: "textarea" },
  { name: "map_url", label: "Add Map Url", text: "text" },
];

const PropertyApartmentDetails = [
  { name: "rooms", label: "Rooms", type: "number" },
  { name: "baths", label: "Baths", type: "number" },
  { name: "beds", label: "Beds", type: "number" },
  { name: "number_of_guest", label: "Number Of Guest", type: "number" },
];
const openNewTab = () => {
  window.open(
    "https://www.embedmymap.com/?gclid=CjwKCAjw7c2pBhAZEiwA88pOFyOJP-qeqBYLDqgcsq6-Y7MAdnzFb6jYb9MgxS-6sDb2ByBmd6GzThoC440QAvD_BwE",
    "_blank"
  );
};

const AddPropertyForm = ({
  formik,
  propertyId,
  setActiveStep,
  activeStep,
  loading,
  text,
}) => {
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  return (
    <Box
      component={"form"}
      noValidate
      onSubmit={formik?.handleSubmit}
      sx={{ mt: 4 }}
    >
      <Box
        display="grid"
        gap="20px 45px"
        gridTemplateColumns="repeat(2, minmax(0, 1fr))"
        sx={{
          "& > div": {
            gridColumn: isNonMobile ? undefined : "span 2",
          },
        }}
      >
        {propertyFields?.map((field, index) => (
          <TextField
            key={index}
            size="small"
            type={field?.type}
            placeholder={field?.label}
            onChange={formik.handleChange}
            value={formik.values[field?.name]}
            name={field?.name}
            error={!!formik.errors[field?.name]}
            helperText={formik.errors[field?.name]}
          />
        ))}
      </Box>
      <Typography className="form___title__text">
        Property Description
      </Typography>
      <Box
        display="grid"
        gap="20px 45px"
        gridTemplateColumns="repeat(2, minmax(0, 1fr))"
        sx={{
          "& > div": {
            gridColumn: isNonMobile ? undefined : "span 2",
          },
        }}
      >
        {PropertyDescription?.map((field, index) => (
          <Box key={index}>
            <textarea
              style={{
                opacity: 0.5,
                width: "100%",
                padding: "10px",
                border: `${
                  !!formik.errors[field?.name]
                    ? "1px solid red"
                    : "1px solid #ccc"
                }`,
                borderRadius: "4px",
              }}
              className="textareas_fields"
              name={field?.name}
              placeholder={field?.label}
              value={formik.values[field?.name]}
              onChange={formik.handleChange}
              rows={4}
            ></textarea>
            {!!formik.errors[field?.name] && (
              <Typography sx={{ color: "red" }}>
                {formik.errors[field?.name]}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
      <Typography
        sx={{ color: "blue", cursor: "pointer" }}
        onClick={openNewTab}
      >
        Generate map url
      </Typography>
      <Typography className="form___title__text">Property Address</Typography>
      <Box
        display="grid"
        gap="20px 45px"
        gridTemplateColumns="repeat(2, minmax(0, 1fr))"
        sx={{
          "& > div": {
            gridColumn: isNonMobile ? undefined : "span 2",
          },
        }}
      >
        {PropertyAddressList?.map((field, index) => (
          <TextField
            key={index}
            size="small"
            type={field?.type}
            placeholder={field?.label}
            onChange={formik.handleChange}
            value={formik.values[field?.name]}
            name={field?.name}
            error={!!formik.errors[field?.name]}
            helperText={formik.errors[field?.name]}
          />
        ))}
      </Box>
      <Typography className="form___title__text">
        Property Apartment information
      </Typography>
      <Box
        display="grid"
        gap="20px 45px"
        gridTemplateColumns="repeat(2, minmax(0, 1fr))"
        sx={{
          "& > div": {
            gridColumn: isNonMobile ? undefined : "span 2",
          },
        }}
      >
        {PropertyApartmentDetails?.map((field, index) => (
          <TextField
            key={index}
            size="small"
            type={field?.type}
            placeholder={field?.label}
            onChange={formik.handleChange}
            value={formik.values[field?.name]}
            name={field?.name}
            error={!!formik.errors[field?.name]}
            helperText={formik.errors[field?.name]}
          />
        ))}
      </Box>
      <Typography className="form___title__text">Property Host User</Typography>
      <Box
        display="grid"
        gap="20px 45px"
        gridTemplateColumns="repeat(2, minmax(0, 1fr))"
        sx={{
          "& > div": {
            gridColumn: isNonMobile ? undefined : "span 2",
          },
        }}
      >
        <TextField
          size="small"
          type={"text"}
          placeholder={"Host user"}
          onChange={formik.handleChange}
          value={formik.values.host_name}
          name={"host_name"}
          error={!!formik.errors.host_name}
          helperText={formik.errors.host_name}
        />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", mt: 3 }}>
        <FormControlLabel
          control={<Checkbox checked={formik?.values?.cancel_access} />}
          label="Need to add cancellation policy ?"
          name="cancel_access"
          onChange={formik.handleChange}
        />
        {formik?.values?.cancel_access && (
          <TextField
            size="small"
            type={"text"}
            placeholder={"Add cancellation policy"}
            onChange={formik.handleChange}
            value={formik.values.cancel_policy}
            name={"cancel_policy"}
            error={!!formik.errors.cancel_policy}
            helperText={formik.errors.cancel_policy}
          />
        )}
      </Box>
      <Box display="flex" justifyContent="end" mt="20px">
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          onClick={() => navigate("/properties")}
        >
          Back
        </Button>
        {propertyId && (
          <Button
            color="secondary"
            variant="contained"
            sx={{ mr: 3 }}
            onClick={() =>
              setActiveStep({
                step: activeStep?.step + 1,
                id: propertyId,
              })
            }
          >
            Skip
          </Button>
        )}
        {loading?.propertyForm ? (
          <Button color="secondary" variant="contained">
            <CircularProgress size={20} />
          </Button>
        ) : (
          <Button type="submit" color="secondary" variant="contained">
            {text}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AddPropertyForm;
