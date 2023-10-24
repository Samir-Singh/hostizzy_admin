import * as yup from "yup";

// property details
export const propertyInitialValues = {
  name: "",
  description: "",
  short_description: "",
  price: "",
  rooms: "",
  baths: "",
  beds: "",
  number_of_guest: "",
  price_time_period: "night",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  cancel_access: false,
  host_name: "",
  map_url:""
};

export const propertySchema = yup.object().shape({
  name: yup.string().required("Required"),
  description: yup.string().required("Required"),
  short_description: yup.string().required("Required"),
  price: yup.string().required("Required"),
  rooms: yup.string().required("Required"),
  baths: yup.string().required("Required"),
  beds: yup.string().required("Required"),
  number_of_guest: yup.string().required("Required"),
  price_time_period: yup.string().required("Required"),
  address: yup.string().required("Required"),
  city: yup.string().required("Required"),
  state: yup.string().required("Required"),
  zip: yup.string().required("Required"),
  country: yup.string().required("Required"),
  map_url: yup.string().required("Required"),
  host_name: yup.string().required("Required"),
});
