import { MdDashboard, MdLogout, MdSupervisorAccount } from "react-icons/md";

export default [
    [
        {
            name: "Dashboard",
            link: "/",
            MenuIcon: MdDashboard
        },
        {
            name: "Users",
            link: "/users",
            MenuIcon: MdSupervisorAccount
        }, 
    ],
    [
        {
            name: "Logout",
            link: "/logout",
            MenuIcon: MdLogout
        }
    ]
]