import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login, Dashboard, Users, User, Goalkeepers, Goalkeeper, Categories, Matches, Logout } from '../pages';

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
                <Route path="/goalkeepers">
                    <Route index={true} element={<Goalkeepers />} />
                    <Route path=":id" element={<Goalkeeper />} />
                </Route>
                <Route path="/categories" element={<Categories />} />
                <Route path="/matches" element={<Matches />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </BrowserRouter>

    )
}

export default AppRoutes