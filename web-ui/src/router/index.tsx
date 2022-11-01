import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login, Dashboard, Users, User, Logout } from '../pages';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/users">
                    <Route index={true} element={<Users />} />
                    <Route path=":id" element={<User />} />
                </Route>
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </BrowserRouter>

    )
}

export default AppRoutes