import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Tooltip,
  Button,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { withCookies } from "react-cookie";
import API from "../../config/api";
import { useNavigate } from "react-router-dom";
import EmailCredentials from "../../components/modals/emailCredentials";
import moment from "moment/moment";
import ConfirmationDialog from "../../components/modals/confirmation";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import DownloadIcon from "@mui/icons-material/Download";
import "./index.css";
import { exportProperty } from "../../utils/helper";
import { toast } from "react-toastify";

const PropertiesList = ({ user }) => {
  const api = new API();
  const theme = useTheme();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState({
    data: true,
    status: false,
    id: "",
  });
  const [credentialModel, setCredentialModel] = useState({
    isOpen: false,
    credentials: null,
  });
  const [confirmInfo, setConfirmInfo] = useState({
    id: "",
    isOpen: false,
    text: "Are you sure want to delete this entity?",
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const apiUrl =
      user?.role === "admin" ? `api/properties` : `api/property/${user?._id}`;
    const response = await api.get(apiUrl);
    if (response?.success) {
      setLoading({ status: false, data: false });
      setProperties(response?.data);
    }
  };

  const handleDelete = async (id) => {
    const response = await api.delete(`api/property/${user._id}/${id}`);
    if (response?.success) {
      setConfirmInfo({ ...confirmInfo, isOpen: false, id: "" });
      fetchProperties();
    }
  };

  const handleEdit = (e, row) => {
    e.stopPropagation();
    navigate(`/property/${row?._id}`);
  };

  const handleDeleteProperty = (e, row) => {
    e.stopPropagation();
    setConfirmInfo({
      ...confirmInfo,
      isOpen: true,
      id: row?._id,
    });
  };

  const handlePropertyStatus = async (e, row) => {
    e.stopPropagation();
    const payload = { status: !row?.is_active };
    setLoading({ ...loading, status: true, id: row?._id });
    let response = await api.put(`api/property/${row?._id}`, payload);
    if (response?.success) {
      fetchProperties();
      // setLoading({ ...loading, status: false });
    }
  };

  const handleExportDetails = () => {
    toast.success("Property list exporting ...");
    exportProperty(properties);
  };

  const columns = [
    {
      field: "created_at",
      headerName: "Created",
      flex: 1,
      renderCell: ({ row: { created_at } }) => {
        return (
          <Typography>{moment(created_at).format("MMMM Do YYYY")}</Typography>
        );
      },
    },
    {
      field: "tumbnail",
      headerName: "Image",
      flex: 1,
      renderCell: ({ row: { thumbnails } }) => {
        const imagesSrc =
          thumbnails?.length > 0
            ? thumbnails[0].images && thumbnails[0].images[0]
            : "";
        return (
          <img
            src={`${imagesSrc}`}
            width="60"
            height="40"
            alt="property"
            className="property_image_class"
          />
        );
      },
    },
    {
      field: "created_by",
      headerName: "Creator user",
      flex: 1,
      renderCell: ({ row: { created_by } }) => {
        return <Typography>{created_by?.display_name}</Typography>;
      },
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      renderCell: ({ row: { price, price_time_period } }) => {
        return (
          <Typography> &#x20B9;{`${price} / ${price_time_period}`}</Typography>
        );
      },
    },
    {
      field: "is_active",
      headerName: "Property Status",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            {loading?.status && loading.id === params?.row?._id ? (
              <CircularProgress size={20} />
            ) : params?.row?.is_active ? (
              <CheckCircleIcon
                color="success"
                onClick={(e) => handlePropertyStatus(e, params?.row)}
                sx={{ mr: 1, cursor: "pointer" }}
              />
            ) : (
              <RadioButtonUncheckedIcon
                color="disabled"
                onClick={(e) => handlePropertyStatus(e, params?.row)}
                sx={{ mr: 1, cursor: "pointer" }}
              />
            )}
            {loading?.status && loading.id === params?.row?._id
              ? ""
              : params?.row?.is_active
              ? "On"
              : "Off"}
          </Box>
        );
      },
    },
    {
      field: "_id",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box sx={{ textAlign: "left", cursor: "pointer" }}>
            <Tooltip title="Edit Property">
              <BorderColorIcon onClick={(e) => handleEdit(e, params.row)} />
            </Tooltip>
            <Tooltip title="Delete Property">
              <DeleteIcon
                sx={{ ml: 3 }}
                onClick={(e) => handleDeleteProperty(e, params.row)}
              />
            </Tooltip>
          </Box>
        );
      },
    },
  ];
  return (
    <Box mt="20px">
      {loading?.data ? (
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
            <Header title="Properties" subtitle="Managing the properties" />
            <Box>
              <Button
                sx={{ height: "40px", mr: 2 }}
                variant="contained"
                onClick={() => navigate("/property")}
              >
                Add Property
              </Button>
              <Tooltip title="Download Property Details">
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
              rows={properties}
              columns={columns}
            />
          </Box>
          {credentialModel?.isOpen && (
            <EmailCredentials
              credentialModel={credentialModel}
              handleClose={() =>
                setCredentialModel({ isOpen: false, credentials: null })
              }
            />
          )}
          {confirmInfo && (
            <ConfirmationDialog
              data={confirmInfo}
              handleClose={() =>
                setConfirmInfo({ ...confirmInfo, isOpen: false, id: "" })
              }
              handleSubmit={handleDelete}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default withCookies(PropertiesList);
