import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import { useGoalkeepers, useGoalkeepersReady } from '../contexts/goalkeepersContext';
import { GoalkeeperDTO } from '../DTOs/GoalkeeperDTO';
import { ModalProp } from '../interfaces/modalProp';

const columns: GridColDef[] = [
    {
        field: 'picture',
        headerName: 'Picture',
        flex: 1,
        minWidth: 60,
        align: "center",
        renderCell: (params) => {
            return (
                <RouterLink to={`/goalkeepers/${params.id}`}>
                    <Avatar src={params.row.picture} sx={{ width: 32, height: 32 }} />
                </RouterLink>
            );
        }
    },
    {
        field: 'name',
        headerName: 'Name',
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

function GoalkeepersList({
    setModalIsOpen
}: ModalProp) {
    const [rows, setRows] = useState<GoalkeeperDTO[]>([] as GoalkeeperDTO[])

    const auth = useAuth()
    const goalkeepersReady = useGoalkeepersReady()
    const goalkeepers = useGoalkeepers()

    useEffect(() => {
        if (goalkeepersReady && goalkeepers) {
            setRows(goalkeepers)
        }
    }, [goalkeepersReady, goalkeepers])

    return (
        <>
            {auth?.user.admin ?
                <Box
                    display="flex" justifyContent="flex-end"
                    mb={2}>
                    <Button variant="contained" onClick={() => { setModalIsOpen() }}>Add Goalkeeper</Button>
                </Box> : <></>
            }

            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows || []}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                />
            </div>
        </>
    )
}

export default GoalkeepersList