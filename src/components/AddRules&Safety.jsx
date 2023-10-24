import { Box } from "@mui/system";
import React from "react";
import { mockAmenities } from "../utils/mockData";
import { Button, CircularProgress, Divider, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import { WithContext as ReactTags } from "react-tag-input";

const AddRulesAndSafety = ({
  nestedArray,
  setNestedArray,
  handleAmenities,
  propertyId,
  setActiveStep,
  activeStep,
  loading,
  text,
  submitPropertyRules,
}) => {
  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  return (
    <Box>
      <Typography className="form___title__text">House Rules</Typography>
      <Box>
        <ReactTags
          className="house_roles"
          tags={nestedArray?.house_roles}
          delimiters={delimiters}
          handleDelete={(i) =>
            setNestedArray({
              ...nestedArray,
              house_roles: nestedArray?.house_roles?.filter(
                (tag, index) => index !== i
              ),
            })
          }
          handleAddition={(tag) =>
            setNestedArray({
              ...nestedArray,
              house_roles: [...nestedArray?.house_roles, tag],
            })
          }
          inputFieldPosition="top"
          autocomplete
        />
      </Box>
      <Typography className="form___title__text">Add Amenities</Typography>
      <Box sx={{ width: "100%", mt: 6 }}>
        {mockAmenities?.map((amenities) => (
          <Box key={amenities}>
            <Box
              sx={{
                margin: "20px 0px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ fontSize: "17px" }}> {amenities}</Typography>
              <Box>
                <ClearIcon
                  className={`icons_class`}
                  onClick={() => handleAmenities(amenities, "remove")}
                />
                <DoneIcon
                  className={`icons_class ${
                    nestedArray?.amenities?.find(
                      (amenity) => amenity === amenities
                    )
                      ? "active_amenity"
                      : ""
                  }`}
                  onClick={() => handleAmenities(amenities, "add")}
                />
              </Box>
            </Box>
            <Divider />
          </Box>
        ))}
      </Box>
      <Box display="flex" justifyContent="end" mt="20px">
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
        {loading?.propertyRule ? (
          <Button color="secondary" variant="contained">
            <CircularProgress size={20} />
          </Button>
        ) : (
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={() => submitPropertyRules()}
          >
            {text}
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default AddRulesAndSafety;
