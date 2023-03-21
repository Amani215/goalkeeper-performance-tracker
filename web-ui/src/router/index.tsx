import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login, Dashboard, Users, User, Goalkeepers, Goalkeeper, Categories, Category, Trainings, Training, Matches, Match, MatchPerformancePage, Logout, Settings } from '../pages';

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
                <Route path="/categories">
                    <Route index={true} element={<Categories />} />
                    <Route path=":id" element={<Category />} />
                </Route>
                <Route path="/matches">
                    <Route index={true} element={<Matches />} />
                    <Route path=":id" element={<Match />} />
                </Route>
                <Route path="/trainings">
                    <Route index={true} element={<Trainings />} />
                    <Route path=":id" element={<Training />} />
                </Route>
                <Route path="/match-performance/:id" element={<MatchPerformancePage />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/logout" element={<Logout />} />
            </Routes>
        </BrowserRouter>

    )
}

export default AppRoutes