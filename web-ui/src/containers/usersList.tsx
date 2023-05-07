import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useUsers, useUsersReady } from '../contexts/usersContext';
import { UserDTO } from '../DTOs';
import Avatar from '@mui/material/Avatar';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { ModalProp } from '../interfaces/modalProp';
import { useAuth } from '../contexts/authContext';
import { useTranslation } from 'react-i18next';

export default function UsersList({
    setModalIsOpen
}: ModalProp) {
    const { t } = useTranslation();
    const location = useLocation()

    const columns: GridColDef[] = [
        {
            field: 'profile_pic',
            headerName: `${t("profile_pic")}`,
            flex: 1,
            minWidth: 60,
            align: "center",
            renderCell: (params) => {
                return (
                    <Avatar src={params.row.profile_pic} sx={{ width: 32, height: 32 }} />
                );
            }
        },
        {
            field: 'username',
            headerName: `${t("username")}`,
            flex: 3, minWidth: 100
        },
        {
            field: 'admin',
            headerName: 'Admin',
            flex: 1,
            type: 'boolean',
            minWidth: 80
        }
    ];

    const [rows, setRows] = useState<UserDTO[]>([] as UserDTO[])
    const auth = useAuth()

    const usersReady = useUsersReady()
    const users = useUsers()

    useEffect(() => {
        if (usersReady && users) {
            setRows(users)
        }
    }, [usersReady, users])

    // Click event
    const [redirect, setRedirect] = useState<boolean>(false)
    const [redirectID, setRedirectID] = useState<string>("")
    const redirectTo = (id: string) => {
        setRedirect(true)
        setRedirectID(id)
    }

    if (redirect) {
        return <Navigate to={`/users/${redirectID}`} state={{ from: location }} />
    }

    return (
        <>
            {auth?.user.admin ?
                <Box
                    display="flex" justifyContent="flex-end"
                    mb={2}>
                    <Button variant="contained" onClick={() => { setModalIsOpen() }}>{t("add_user")}</Button>
                </Box> : <></>
            }

            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows || []}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    onRowClick={(params) => {
                        redirectTo(params.row.id)
                    }}
                />
            </div>
        </>
    );
}
