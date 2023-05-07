import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { useGoalkeepers, useGoalkeepersReady } from '../contexts/goalkeepersContext';
import { GoalkeeperDTO } from '../DTOs/GoalkeeperDTO';
import { ModalProp } from '../interfaces/modalProp';
import { useTranslation } from 'react-i18next';


function GoalkeepersList({
    setModalIsOpen
}: ModalProp) {
    const { t } = useTranslation()
    const location = useLocation()
    const columns: GridColDef[] = [
        {
            field: 'picture',
            headerName: `${t("picture")}`,
            flex: 1,
            minWidth: 60,
            align: "center",
            renderCell: (params) => {
                return (
                    <Avatar src={params.row.picture} sx={{ width: 32, height: 32 }} />
                );
            }
        },
        {
            field: 'name',
            headerName: `${t("name")}`,
            flex: 3, minWidth: 100
        },
        {
            field: 'birthday',
            headerName: 'Age',
            flex: 1,
            minWidth: 60,
            align: "center",
            valueGetter: (params) => dayjs().diff(dayjs(params.row.birthday.split('/')[2] + "-" + params.row.birthday.split('/')[1] + "-" + params.row.birthday.split('/')[0]), 'year')
        }
    ]

    const [rows, setRows] = useState<GoalkeeperDTO[]>([] as GoalkeeperDTO[])

    const auth = useAuth()
    const goalkeepersReady = useGoalkeepersReady()
    const goalkeepers = useGoalkeepers()

    useEffect(() => {
        if (goalkeepersReady && goalkeepers) {
            setRows(goalkeepers)
        }
    }, [goalkeepersReady, goalkeepers])

    // Click event
    const [redirect, setRedirect] = useState<boolean>(false)
    const [redirectID, setRedirectID] = useState<string>("")
    const redirectTo = (id: string) => {
        setRedirect(true)
        setRedirectID(id)
    }

    if (redirect) {
        return <Navigate to={`/goalkeepers/${redirectID}`} state={{ from: location }} />
    }

    return (
        <>
            {auth?.user.admin ?
                <Box
                    display="flex" justifyContent="flex-end"
                    mb={2}>
                    <Button variant="contained" onClick={() => { setModalIsOpen() }}>{t("add_goalkeeper")}</Button>
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
    )
}

export default GoalkeepersList