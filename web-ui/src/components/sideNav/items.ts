import {
  MdCategory,
  MdDashboard,
  MdLogout,
  MdSupervisorAccount,
  MdSportsHandball,
  MdSportsScore,
  MdToday,
  MdSettings,
} from "react-icons/md";

export default [
  [
    {
      name: "Dashboard",
      link: "/",
      MenuIcon: MdDashboard,
      onlyAdmin: false,
    },
    {
      name: "users",
      link: "/users",
      MenuIcon: MdSupervisorAccount,
      onlyAdmin: false,
    },
    {
      name: "goalkeepers",
      link: "/goalkeepers",
      MenuIcon: MdSportsHandball,
      onlyAdmin: false,
    },
    {
      name: "categories",
      link: "/categories",
      MenuIcon: MdCategory,
      onlyAdmin: false,
    },
    {
      name: "trainings",
      link: "/trainings",
      MenuIcon: MdToday,
      onlyAdmin: false,
    },
    {
      name: "matches",
      link: "/matches",
      MenuIcon: MdSportsScore,
      onlyAdmin: false,
    },
  ],
  [
    {
      name: "settings",
      link: "/settings",
      MenuIcon: MdSettings,
      onlyAdmin: true,
    },
  ],
  [
    {
      name: "Logout",
      link: "/logout",
      MenuIcon: MdLogout,
      onlyAdmin: false,
    },
  ],
];
