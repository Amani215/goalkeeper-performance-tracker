import {
  MdCategory,
  MdDashboard,
  MdLogout,
  MdSupervisorAccount,
  MdSportsHandball,
  MdSportsScore,
} from "react-icons/md";

export default [
  [
    {
      name: "Dashboard",
      link: "/",
      MenuIcon: MdDashboard,
    },
    {
      name: "Users",
      link: "/users",
      MenuIcon: MdSupervisorAccount,
    },
    {
      name: "Goalkeepers",
      link: "/goalkeepers",
      MenuIcon: MdSportsHandball,
    },
    {
      name: "Categories",
      link: "/categories",
      MenuIcon: MdCategory,
    },
    {
      name: "Matches",
      link: "/matches",
      MenuIcon: MdSportsScore,
    },
  ],
  [
    {
      name: "Logout",
      link: "/logout",
      MenuIcon: MdLogout,
    },
  ],
];
