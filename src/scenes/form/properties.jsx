import React, { useState, useEffect } from "react";
import { Box, StepLabel } from "@mui/material";
import { useFormik } from "formik";
import Header from "../../components/Header";
import { withCookies } from "react-cookie";
import API from "../../config/api";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "./index.css";
import AddThumbnails from "../../components/AddThumbnail";
import AddPropertyForm from "../../components/AddPropertyForm";
import AddRulesAndSafety from "../../components/AddRules&Safety";
import { propertyInitialValues, propertySchema } from "../../utils/validation";
import { imageTypes, mockAmenities } from "../../utils/mockData";

const steps = ["Add Property Details", "Add Rules & Safety", "Add Images "];

const PropertyForm = ({ user }) => {
  const api = new API();
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const [loading, setLoading] = useState({
    propertyForm: false,
    propertyRule: false,
    thumbnailLoading: false,
  });
  const [nestedArray, setNestedArray] = useState({
    amenities: mockAmenities,
    house_roles: [],
  });
  const [thumbnails, setThumbnails] = useState(imageTypes);
  const [coverImage, setCoverImage] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [activeStep, setActiveStep] = useState({
    step: 0,
    id: "",
  });

  useEffect(() => {
    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  // handle property api calling
  const formik = useFormik({
    initialValues: propertyInitialValues,
    validationSchema: propertySchema,
    onSubmit: async (values) => {
      values.location = {
        address: values.address,
        city: values.city,
        state: values.state,
        zip: values.zip,
        country: values.country,
      };
      values.created_by = user?._id;
      values.cancellation = {
        have_access: values.cancel_access,
        cancel_policy: values.cancel_access ? values.cancel_policy : "",
      };
      delete values.address;
      delete values.city;
      delete values.state;
      delete values.zip;
      delete values.country;
      setLoading({ ...loading, propertyForm: true });

      if (propertyId) {
        let response = await api.put(
          `api/property/${user._id}/${propertyId}`,
          values
        );
        if (response?.success) {
          setLoading({ ...loading, propertyForm: false });
          toast.success("Property updated sucessfully.");
          setActiveStep({
            step: activeStep?.step + 1,
            id: response?.data?._id,
          });
        }
      } else {
        let response = await api.post(`api/property/${user._id}`, values);
        if (response?.success) {
          setLoading({ ...loading, propertyForm: false });
          toast.success("Property added sucessfully.");
          setActiveStep({
            step: activeStep?.step + 1,
            id: response?.data?._id,
          });
        }
      }
    },
  });

  // get all properties
  const fetchProperty = async () => {
    const response = await api.get(`api/property/${user._id}/${propertyId}`);
    if (response?.success) {
      formik.setValues({
        ...response?.data,
        address: response?.data?.location?.address,
        city: response?.data?.location?.city,
        state: response?.data?.location?.state,
        zip: response?.data?.location?.zip,
        country: response?.data?.location?.country,
        cancel_access: response?.data?.cancellation.have_access,
        cancel_policy: response?.data?.cancellation.cancel_policy,
      });
      const thumbnailList =
        response?.data?.thumbnails?.length > 0
          ? response?.data?.thumbnails
          : imageTypes;
      setThumbnails(thumbnailList);
      setNestedArray({
        amenities: response?.data?.amenities,
        house_roles: response?.data?.house_roles,
      });
      setCoverImage(response?.data?.cover_image || "");
    }
  };

  // handle rules api calling
  const submitPropertyRules = async () => {
    const requestBody = {
      amenities: nestedArray.amenities,
      house_roles: nestedArray.house_roles,
    };
    const requestId = propertyId ? propertyId : activeStep?.id;
    setLoading({ ...loading, propertyRule: true });
    const response = await api.put(`api/properties/${requestId}`, requestBody);
    if (response?.success) {
      toast.success("Sucessfully added data.");
      setNestedArray({
        amenities: response?.data?.amenities
          ? response?.data?.amenities
          : nestedArray.amenities,
        house_roles: response?.data?.house_roles
          ? response?.data?.house_roles
          : nestedArray.house_roles,
      });
      setLoading({ ...loading, propertyRule: false });
      setActiveStep({
        step: activeStep?.step + 1,
        id: response?.data?._id,
      });
    }
  };

  // handle image api calling
  const submitImageUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let data of thumbnails) {
      if (!data?.images?.length > 0) {
        toast.error("Select Image with type.");
        return;
      } else {
        formData.append(`type`, data?.type);
        data?.images?.forEach((key) => {
          formData.append(`image_${data?.type}_${new Date().getTime()}`, key);
        });
      }
    }
    try {
      setLoading({ ...loading, thumbnailLoading: true });
      const response = await api.post(
        `api/property/${user._id}/${activeStep?.id}`,
        formData
      );
      if (response?.success) {
        setLoading({ ...loading, thumbnailLoading: false });
        navigate("/properties");
        toast.success("Property added sucessfully.");
      }
    } catch (err) {
      setLoading({ ...loading, thumbnailLoading: false });
    }
  };

  // handle image upload onchange functionality
  const handleImageUpload = (event, key, index) => {
    const files = event?.target?.files;
    const newImages = [];
    for (let i = 0; i < files?.length; i++) {
      newImages.push(files[i]);
    }
    if (thumbnails[index]["images"]?.length > 0) {
      thumbnails[index]["images"]?.forEach((image) => newImages.push(image));
    }
    thumbnails[index]["images"] =
      thumbnails[index]["type"] === key && newImages;
    setThumbnails([...thumbnails]);
  };

  // handle amenities on changes
  const handleAmenities = (e, action) => {
    let newList = [...nestedArray?.amenities];
    if (action === "add" && !newList?.find((i) => i === e)) {
      newList?.push(e);
    } else if (action === "remove") {
      newList = nestedArray?.amenities?.filter((amenity) => amenity !== e);
    }
    setNestedArray({
      ...nestedArray,
      amenities: newList,
    });
  };

  // upload Cover Image
  const handleSubmitCoverImage = async () => {
    if (typeof coverImage === "string") {
      const response = await api.post(`api/coverimage/${activeStep?.id}`, {
        image: coverImage,
        type: "string",
      });
      if (response?.success) {
        setConfirmation(false);
        setCoverImage(response?.data?.cover_image || "");
      }
    } else {
      const formData = new FormData();
      formData.append(`image_cover_image`, coverImage);
      try {
        const response = await api.post(
          `api/coverimage/${activeStep?.id}`,
          formData
        );
        if (response?.success) {
          setConfirmation(false);
          setCoverImage(response?.data?.cover_image || "");
        }
      } catch (err) {
        console.log("----err----", err);
      }
    }
  };

  const text = propertyId ? "Update property" : "Add property";
  return (
    <Box m="20px">
      <Header title={text} subtitle="Create a new property" />
      <Box>
        <Stepper activeStep={activeStep?.step} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <React.Fragment>
          {activeStep?.step === 0 ? (
            <AddPropertyForm
              formik={formik}
              propertyId={propertyId}
              setActiveStep={setActiveStep}
              activeStep={activeStep}
              loading={loading}
              text={text}
            />
          ) : activeStep?.step === 1 ? (
            <AddRulesAndSafety
              nestedArray={nestedArray}
              setNestedArray={setNestedArray}
              handleAmenities={handleAmenities}
              propertyId={propertyId}
              setActiveStep={setActiveStep}
              activeStep={activeStep}
              loading={loading}
              text={propertyId ? "Update Rules" : "Add Rules"}
              submitPropertyRules={submitPropertyRules}
            />
          ) : activeStep?.step === 2 ? (
            <AddThumbnails
              submitImageUpload={submitImageUpload}
              handleImageUpload={handleImageUpload}
              selectedImages={thumbnails}
              propertyId={propertyId}
              thumbnails={thumbnails}
              loading={loading}
              coverImage={coverImage}
              setCoverImage={setCoverImage}
              setConfirmation={setConfirmation}
              confirmation={confirmation}
              handleSubmitCoverImage={handleSubmitCoverImage}
              formik={formik}
            />
          ) : null}
        </React.Fragment>
      </Box>
    </Box>
  );
};

export default withCookies(PropertyForm);
