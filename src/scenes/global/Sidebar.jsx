import React from "react";
import { useState } from "react";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import GroupsIcon from "@mui/icons-material/Groups";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import LogoutIcon from "@mui/icons-material/Logout";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import "./index.css";
import { withCookies } from "react-cookie";
import { toast } from "react-toastify";
import Logo from "../../assets/images/white_logo.png";

const SidebarContainer = ({ cookies, user }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Home");

  const adminOptions = [
    { title: "Sub Admins", url: "sub_admins", icon: <GroupsIcon /> },
    { title: "Properties ", url: "properties", icon: <ApartmentIcon /> },
    { title: "Booking List ", url: "bookings", icon: <PersonAddIcon /> },
    { title: "Leads List ", url: "leads", icon: <LeaderboardIcon /> },
    { title: "Enquiry List ", url: "enquiries", icon: <PersonSearchIcon /> },
    { title: "Newsletters ", url: "newsletters", icon: <NewspaperIcon /> },
  ];

  const subAdminOptions = [
    { title: "Properties ", url: "properties", icon: <ApartmentIcon /> },
    { title: "Booking List ", url: "bookings", icon: <PersonAddIcon /> },
    { title: "Leads List ", url: "leads", icon: <LeaderboardIcon /> },
    { title: "Enquiry List ", url: "enquiries", icon: <PersonSearchIcon /> },
    { title: "Newsletters ", url: "newsletters", icon: <NewspaperIcon /> },
  ];

  const handleRedirectItem = (title, to) => {
    setSelected(title);
    navigate(to);
  };

  const handleLogout = () => {
    cookies.remove("token");
    navigate("/login");
    toast.success("Logout successfully!");
  };

  const Item = ({ title, to, icon, selected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
      <MenuItem
        active={selected === title}
        style={{
          color: `${location?.pathname === to ? "#fb7979" : colors.grey[100]}`,
        }}
        onClick={() => handleRedirectItem(title, to)}
        icon={icon}
      >
        <Typography>{title}</Typography>
        <Link to={to} />
      </MenuItem>
    );
  };

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <Sidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={
              isCollapsed ? (
                <Box display="flex" flexDirection="column-reverse">
                  <Box
                    sx={{ mt: 2 }}
                    component={"img"}
                    src={Logo}
                    alt="Hostizzy_logos"
                    width="30px"
                    height="20px"
                  />
                  <MenuOutlinedIcon />
                </Box>
              ) : undefined
            }
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  <Box
                    component={"img"}
                    src={Logo}
                    alt="Hostizzy_logos"
                    width="80px"
                    height="50px"
                  />
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
              ></Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Hello {user?.display_name}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Home"
              to="/home"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Profile"
              to="/profile"
              icon={<ManageAccountsIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {user?.role === "admin" ? (
              <>
                {adminOptions?.map((i, index) => (
                  <Item
                    key={index}
                    title={i?.title}
                    to={`/${i?.url}`}
                    icon={i?.icon}
                    selected={selected}
                    setSelected={setSelected}
                  />
                ))}
              </>
            ) : (
              <>
                {subAdminOptions?.map((i, index) => (
                  <Item
                    key={index}
                    title={i?.title}
                    to={`/${i?.url}`}
                    icon={i?.icon}
                    selected={selected}
                    setSelected={setSelected}
                  />
                ))}
              </>
            )}
            <MenuItem
              active={"Logout"}
              style={{ color: colors.grey[100] }}
              onClick={() => handleLogout()}
              icon={<LogoutIcon />}
            >
              <Typography>Logout</Typography>
            </MenuItem>
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default withCookies(SidebarContainer);
