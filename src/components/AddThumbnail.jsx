import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useNavigate } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ConfirmImageUploader from "./modals/confirmImageUploader";
import { thumbnailKeys } from "../utils/mockData";

const AddThumbnails = ({
  submitImageUpload,
  handleImageUpload,
  propertyId,
  thumbnails,
  coverImage,
  setCoverImage,
  loading,
  handleSubmitCoverImage,
  confirmation,
  setConfirmation,
  formik,
}) => {
  const navigate = useNavigate();
  const handleClose = () => {
    setConfirmation(false);
    setCoverImage(
      (formik?.values?.cover_image
        ? formik?.values?.cover_image
        : thumbnails[0]?.images[0]) || ""
    );
  };
  return (
    <Box
      sx={{ mt: 2 }}
      component={"form"}
      onSubmit={(e) => submitImageUpload(e)}
    >
      <Box display={"flex"} justifyContent={"space-between"}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "700" }}>
            Cover Photo
          </Typography>
          <Button
            variant="outlined"
            sx={{ mt: 3 }}
            onClick={() => setConfirmation(true)}
          >
            Change Photo
          </Button>
        </Box>
        {coverImage && (
          <Box
            width="200px"
            height="200px"
            component={"img"}
            src={coverImage}
            alt="product_img"
          />
        )}
      </Box>

      {/* {thumbnailKeys?.map((typesList) => ( */}
      {thumbnails?.map((list, index) => (
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{list?.type}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                height: "fit-content",
                mt: 2,
                flexWrap: "wrap",
              }}
              key={index}
            >
              {list?.images?.map((imageUrl, index) => (
                <Box
                  sx={{
                    width: "100px",
                    objectFit: "fill",
                    margin: "0px 3px",
                    // position: "relative",
                  }}
                  key={index}
                >
                  <img
                    src={
                      propertyId && typeof imageUrl === "string"
                        ? `${imageUrl}`
                        : URL.createObjectURL(imageUrl)
                    }
                    alt={`thumbnail ${index}`}
                    className="preview-image"
                    width="100"
                    height="100"
                  />
                </Box>
              ))}
              <Button
                component="label"
                variant="outlined"
                sx={{ height: "100px", ml: 1 }}
              >
                + Add Image
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  hidden
                  multiple
                  onChange={(e) => handleImageUpload(e, list?.type, index)}
                />
              </Button>
            </Box>
            {/* })} */}
          </AccordionDetails>
        </Accordion>
      ))}
      <Box display="flex" justifyContent="end" mt="20px">
        {propertyId && (
          <Button
            color="secondary"
            variant="contained"
            sx={{ mr: 3 }}
            onClick={() => navigate("/properties")}
          >
            Skip
          </Button>
        )}
        {loading?.thumbnailLoading ? (
          <Button color="secondary" variant="contained">
            <CircularProgress size={20} />
          </Button>
        ) : (
          <Button type="submit" color="secondary" variant="contained">
            Add thumbnail
          </Button>
        )}
      </Box>
      {/* )} */}
      {confirmation && (
        <ConfirmImageUploader
          thumbnails={thumbnails}
          confirmation={confirmation}
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          handleClose={handleClose}
          propertyId={propertyId}
          formik={formik}
          handleSubmitCoverImage={handleSubmitCoverImage}
        />
      )}
    </Box>
  );
};

export default AddThumbnails;
