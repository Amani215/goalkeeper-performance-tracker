import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/dashboard';
import Login from '../pages/login';
import Users from '../pages/users';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={ <Dashboard />}/>
                <Route path="/users" element={<Users />}/>
            </Routes>
        </BrowserRouter>

    )
}

export default AppRoutes