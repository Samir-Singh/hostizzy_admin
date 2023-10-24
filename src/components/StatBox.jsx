import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import "./index.css";

const StatBox = ({ title, subtitle, icon, color }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex">
        <Box className="block__container" backgroundColor={color}>
          {icon}
        </Box>
        <Box
          display="flex"
          flexDirection={"column"}
          justifyContent="space-between"
          mt="2px"
        >
          <Typography
            fontSize={"16px"}
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
          <Typography fontSize="12px" sx={{ color: "#000000" }}>
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default StatBox;
