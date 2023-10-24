import React, { useEffect, useState } from "react";
import { Box, Button, Tooltip, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { withCookies } from "react-cookie";
import API from "../../config/api";
import DownloadIcon from "@mui/icons-material/Download";
import { toast } from "react-toastify";
import { exportEnquiriesList } from "../../utils/helper";

const EnquiriesList = () => {
  const api = new API();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [enquiries, setEnquiries] = useState({
    loading: true,
    data: [],
  });

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    const response = await api.get(`form/enquiry`);
    if (response?.success) {
      setEnquiries({ loading: false, data: response?.data });
    }
  };

  const handleExportDetails = () => {
    toast.success("Enquiries list exporting ...");
    exportEnquiriesList(enquiries?.data);
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phone_number",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "comments",
      headerName: "Comments",
      flex: 1,
    },
    {
      field: "property_details",
      headerName: "Property Name",
      flex: 1,
      renderCell: ({ row: { property_details } }) => {
        return (
          <Typography>
            {property_details?.name ? property_details?.name : "Not available"}
          </Typography>
        );
      },
    },
  ];
  return (
    <Box mt="20px">
      {enquiries?.loading ? (
        <Box className="loader____container">
          <Box className="loader" />
        </Box>
      ) : (
        <>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"flex-end"}
          >
            <Header title="Enquiries List" subtitle="Managing the enquiries" />
            <Box>
              <Tooltip title="Download Enquiries Details">
                <Button
                  sx={{ height: "40px" }}
                  variant="contained"
                  onClick={() => handleExportDetails()}
                >
                  <DownloadIcon />
                </Button>
              </Tooltip>
            </Box>
          </Box>
          <Box
            m="40px 0 0 0"
            height="75vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none !important ",
                "&:focus": {
                  outline: "none !important",
                },
              },
              "& .MuiDataGrid-columnHeaders": {
                fontSize: "13px",
                color: "rgb(131 131 169/0.9) !important",
                fontWeight: "700 !important",
                textTransform: "uppercase !important",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                color: "white",
              },
              "& .MuiDataGrid-row": {
                maxHeight: "75px !important",
                height: "70px !important",
                padding: "10px 0px !important",
                borderBottom: "0.5px solid #f0f0f0 !important",
              },
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
              "& .MuiDataGrid-withBorderColor": {
                borderColor: "#f0f0f0 !important",
              },
            }}
          >
            <DataGrid
              disableRowSelectionOnClick
              getRowId={(row) => row._id}
              rows={enquiries?.data}
              columns={columns}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default withCookies(EnquiriesList);
