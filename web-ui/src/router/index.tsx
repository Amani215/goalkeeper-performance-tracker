import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Dashboard from '../pages/dashboard';
import Login from '../pages/login';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Dashboard />} />
            </Routes>
        </Router>

    )
}


export default AppRoutes