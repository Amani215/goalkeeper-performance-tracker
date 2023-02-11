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
      name: "Users",
      link: "/users",
      MenuIcon: MdSupervisorAccount,
      onlyAdmin: false,
    },
    {
      name: "Goalkeepers",
      link: "/goalkeepers",
      MenuIcon: MdSportsHandball,
      onlyAdmin: false,
    },
    {
      name: "Categories",
      link: "/categories",
      MenuIcon: MdCategory,
      onlyAdmin: false,
    },
    {
      name: "Trainings",
      link: "/trainings",
      MenuIcon: MdToday,
      onlyAdmin: false,
    },
    {
      name: "Matches",
      link: "/matches",
      MenuIcon: MdSportsScore,
      onlyAdmin: false,
    },
  ],
  [
    {
      name: "Settings",
      link: "/",
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
