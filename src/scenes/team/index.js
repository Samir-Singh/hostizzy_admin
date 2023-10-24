import React, { useEffect, useState } from 'react';
import { Box, Button, Tooltip, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { withCookies } from 'react-cookie';
import API from '../../config/api';
import EmailCredentials from '../../components/modals/emailCredentials';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from '../../components/modals/confirmation';
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import DescriptionIcon from '@mui/icons-material/Description';
import { toast } from 'react-toastify';

const Team = ({ user }) => {
  const api = new API();
  const theme = useTheme();
  const navigate = useNavigate()
  const colors = tokens(theme.palette.mode);
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [credentialModel, setCredentialModel] = useState({
    isOpen: false,
    credentials: null,
  })
  const [confirmInfo, setConfirmInfo] = useState({
    id: "",
    isOpen: false,
    text: 'Are you sure want to delete this entity?'
  })

  useEffect(() => { fetchSubAdmins() }, [])

  const fetchSubAdmins = async () => {
    const response = await api.get(`users/sub_admin/${user?._id}`);
    if (response?.success) { setLoading(false); setSubAdmins(response?.data) }
  }

  const handleEmailCredentials = (e, row) => {
    const { email, password, userEncryptPassword } = row
    const credentials = { email, password, userEncryptPassword }
    setCredentialModel({
      isOpen: true,
      credentials
    })
  }
  const handleDelete = async (id) => {
    const response = await api.delete(`users/user/${id}`);
    if (response?.success) {
      setConfirmInfo({ ...confirmInfo, isOpen: false, id: '' })
      fetchSubAdmins();
    }
  }

  const handleEmailSender = async (e, row) => {
    e.stopPropagation();
    const response = await api.post(`users/mailer`, { email: row?.email });
    if (response?.success) {
      toast.success('Mail sent successfully.')
    }
  }

  const handleEdit = (e, row) => {
    e.stopPropagation();
    navigate(`/form/${row?._id}`);
  };

  const handleDeleteProperty = (e, row) => {
    e.stopPropagation();
    setConfirmInfo({
      ...confirmInfo,
      isOpen: true,
      id: row?._id,
    });
  };


  const columns = [
    {
      field: "display_name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "is_active",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box sx={{ textAlign: "left", cursor: "pointer" }}>
            <Tooltip title="Email Credentials">
              <DescriptionIcon onClick={(e) => handleEmailCredentials(e, params.row)} />
            </Tooltip>
            <Tooltip title="Send email for credentials">
              <ForwardToInboxIcon sx={{ ml: 3 }}
                onClick={(e) => handleEmailSender(e, params.row)}
              />
            </Tooltip>
            <Tooltip title="Edit User">
              <BorderColorIcon sx={{ ml: 3 }} onClick={(e) => handleEdit(e, params.row)} />
            </Tooltip>
            <Tooltip title='Delete User'>
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
      {loading ? (
        <Box className="loader____container">
          <Box className="loader" />
        </Box>
      ) : (
        <>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'flex-end'}>
            <Header title="Sub Admins" subtitle="Managing the sub admins" />
            <Button sx={{ height: '40px' }} variant='contained' onClick={()=>navigate('/form')}>Add Sub-admin</Button>
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
              rows={subAdmins}
              columns={columns}
            />
          </Box>
          {credentialModel?.isOpen && <EmailCredentials
            credentialModel={credentialModel}
            handleClose={() => setCredentialModel({ isOpen: false, credentials: null })}
          />
          }
          {confirmInfo && <ConfirmationDialog
            data={confirmInfo}
            handleClose={() => setConfirmInfo({ ...confirmInfo, isOpen: false, id: '' })}
            handleSubmit={handleDelete} />}
        </>)
      }
    </Box>
  );
};

export default withCookies(Team);
