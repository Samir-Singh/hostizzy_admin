import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import API from "../../config/api";
import { withCookies } from "react-cookie";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import EventIcon from "@mui/icons-material/Event";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import AddIcon from "@mui/icons-material/Add";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import RemindersDialog from "../../components/modals/reminder";
import { toast } from "react-toastify";

const Dashboard = ({ user }) => {
  const api = new API();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState({});
  const [anchorEls, setAnchorE1s] = useState({});
  const [reminders, setReminders] = useState({
    isOpen: false,
    reminderText: "",
    status: "pending",
    list: [],
  });

  const recorsList = [
    {
      link: "/leads",
      length: records?.leads,
      subTitle: "Leads",
      color: "#f50d0d40",
      icon: <LeaderboardIcon sx={{ color: "#fe5858", fontSize: "26px" }} />,
    },
    {
      link: "/enquiries",
      length: records?.enquiries,
      subTitle: "Enquiries received",
      color: "#0049ff30",
      icon: <TroubleshootIcon sx={{ color: "#1c55e3", fontSize: "26px" }} />,
    },
    {
      link: "/bookings",
      length: records?.bookings,
      subTitle: "Booking",
      color: "#2fc10a45",
      icon: <PersonAddIcon sx={{ color: "#2fc10a", fontSize: "26px" }} />,
    },
    {
      link: "/properties",
      length: records?.propertiesCount,
      subTitle: "Properties",
      color: "#e7d10d6b",
      icon: <LocationCityIcon sx={{ color: "#c4a52a", fontSize: "26px" }} />,
    },
  ];

  useEffect(() => {
    fetchRecords();
    fetchReminder();
  }, []);

  const fetchRecords = async () => {
    const response = await api.get(`form/records/${user?._id}`);
    if (response?.success) {
      setLoading(false);
      setRecords({ ...response?.data });
    }
  };

  const handleReminderSubmit = async () => {
    if (reminders?.reminderText === "") {
      toast.error("Add reminder text.");
    } else {
      const payload = {
        text: reminders?.reminderText,
        userId: user?._id,
        status: reminders?.status,
      };
      const response = anchorEls?.todo?._id
        ? await api.put(`reminder/${anchorEls?.todo?._id}`, payload)
        : await api.post(`reminder`, payload);
      if (response?.success) fetchReminder();
    }
  };

  const fetchReminder = async () => {
    const response = await api.get(`reminder/${user?._id}`);
    if (response?.success) {
      setReminders({
        ...reminders,
        reminderText: "",
        isOpen: false,
        list: response?.data,
      });
    }
  };

  const AddReminder = () => {
    setReminders({ ...reminders, isOpen: true });
    setAnchorE1s({ todo: {}, element: null });
  };

  const handleEditModel = async () => {
    setAnchorE1s({ ...anchorEls, element: null });
    setReminders({
      ...reminders,
      status: reminders?.status,
      reminderText: anchorEls?.todo?.text,
      isOpen: true,
    });
  };

  const handleDeleteClose = async () => {
    const response = await api.delete(`reminder/${anchorEls?.todo?._id}`);
    if (response?.success) {
      setAnchorE1s({ ...anchorEls, element: null });
      fetchReminder();
    }
  };

  return (
    <Box m="20px">
      {loading ? (
        <Box className="loader____container">
          <Box className="loader" />
        </Box>
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Header title="Admin" subtitle="" />
          </Box>

          <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="120px"
            gap="20px"
          >
            {/* ROW 1 */}
            {recorsList?.map((record) => (
              <Box
                key={record?.link}
                borderRadius={"8px"}
                boxShadow={"rgba(149, 157, 165, 0.2) 0px 8px 24px"}
                gridColumn="span 3"
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(record?.link)}
              >
                <StatBox
                  title={record?.length || 0}
                  subtitle={record?.subTitle}
                  color={record?.color}
                  icon={record?.icon}
                />
              </Box>
            ))}
            {/* ROW 2 */}
            <Box
              gridColumn="span 7"
              sx={{
                height: "fit-content",
                boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                padding: "28px",
                borderRadius: " 7px",
              }}
            >
              <Box display={"flex"} alignItems={"center"}>
                <ReceiptLongIcon sx={{ fontSize: "25px" }} />
                <Typography className="table__title">
                  Recently Added propeties
                </Typography>
              </Box>
              <Box sx={{ mt: 3, overflowY: "auto" }}>
                <Table className="dashboard_hostizzy_properties">
                  <TableHead>
                    <TableRow>
                      <TableCell>Property Name</TableCell>
                      <TableCell>Creation Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {records?.properties?.map((property) => (
                      <TableRow key={property?._id}>
                        <TableCell>{property?.name}</TableCell>
                        <TableCell>
                          {moment(property?.created_at).format(
                            "DD - MM - YYYY"
                          )}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Box
                              className={`status__container ${
                                property?.is_active
                                  ? "active___container"
                                  : "deactive___container"
                              }`}
                            />
                            <Typography>
                              {property?.is_active ? "Listed" : "Unlisted"}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Box>
            <Box
              gridColumn="span 5"
              sx={{
                height: "438px",
                boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                padding: "28px",
                borderRadius: " 7px",
              }}
            >
              <Box display={"flex"} alignItems={"center"}>
                <EventIcon sx={{ fontSize: "25px" }} />
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent=" space-between"
                  sx={{ width: "-webkit-fill-available" }}
                >
                  <Typography className="table__title">Reminders</Typography>
                  <AddIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => AddReminder()}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  maxHeight: "350px",
                  overflowY: "auto",
                }}
              >
                {reminders?.list?.map((todo) => (
                  <Box className="hostizzy_task" key={todo?._id}>
                    <Box
                      className={`slug__container ${
                        todo?.status === "complete"
                          ? "green_slug"
                          : todo?.status === "declined"
                          ? "red_slug"
                          : "yellow_slug"
                      }`}
                    />
                    <Box
                      display={"flex"}
                      alignItems="center"
                      width={"inherit"}
                      justifyContent="space-between"
                    >
                      <Box display="flex">
                        {todo?.status ? (
                          <CheckCircleOutlineIcon />
                        ) : (
                          <CancelOutlinedIcon />
                        )}
                        <Typography className="hostizzy__task__text">
                          {todo?.text}
                        </Typography>
                      </Box>
                      <Box>
                        <Button
                          id="basic-button"
                          aria-controls={
                            Boolean(anchorEls?.element)
                              ? "basic-menu"
                              : undefined
                          }
                          aria-haspopup="true"
                          aria-expanded={
                            Boolean(anchorEls?.element) ? "true" : undefined
                          }
                          sx={{ marginRight: "10px" }}
                          onClick={(event) =>
                            setAnchorE1s({
                              todo: todo,
                              element: event.currentTarget,
                            })
                          }
                          size="small"
                        >
                          <MoreVertOutlinedIcon />
                        </Button>
                        <Menu
                          id="basic-menu"
                          anchorEl={anchorEls?.element}
                          open={Boolean(anchorEls?.element)}
                          onClose={() => {
                            setAnchorE1s({
                              todo: {},
                              element: null,
                            });
                          }}
                          MenuListProps={{
                            "aria-labelledby": "basic-button",
                          }}
                        >
                          <MenuItem onClick={() => handleEditModel()}>
                            Edit
                          </MenuItem>
                          <MenuItem onClick={() => handleDeleteClose()}>
                            Delete
                          </MenuItem>
                        </Menu>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
          {reminders?.isOpen && (
            <RemindersDialog
              reminders={reminders}
              setReminders={setReminders}
              handleClose={() => setReminders({ ...reminders, isOpen: false })}
              handleReminderSubmit={handleReminderSubmit}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default withCookies(Dashboard);
