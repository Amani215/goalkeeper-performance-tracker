import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { MatchDTO } from "../../DTOs/MatchDTO";
import { Box, Card, IconButton, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

type PropType = {
    matches: MatchDTO[]
}

const columns: GridColDef[] = [
    {
        field: 'date',
        headerName: 'Date',
        flex: 2,
        minWidth: 80,
        renderCell: (params) => {
            return (
                <Link
                    component={RouterLink}
                    to={`/matches/${params.id}`}
                    underline="none"
                    color="inherit">
                    <Typography>{params.row.date}</Typography>
                </Link>
            );
        }
    },
    {
        field: 'local',
        headerName: 'Local',
        flex: 2,
        minWidth: 80,
        renderCell: (params) => {
            return (
                <Link
                    component={RouterLink}
                    to={`/matches/${params.id}`}
                    underline="none"
                    color="inherit">
                    <Typography>{params.row.local}</Typography>
                </Link>
            );
        }
    },
    {
        field: 'visitor',
        headerName: 'Visitor',
        flex: 2,
        minWidth: 80,
        renderCell: (params) => {
            return (
                <Link
                    component={RouterLink}
                    to={`/matches/${params.id}`}
                    underline="none"
                    color="inherit">
                    <Typography>{params.row.visitor}</Typography>
                </Link>
            );
        }
    },
    {
        field: 'match_type',
        headerName: 'Match Type',
        flex: 2,
        minWidth: 80,
        renderCell: (params) => {
            return (
                <Link
                    component={RouterLink}
                    to={`/matches/${params.id}`}
                    underline="none"
                    color="inherit">
                    <Typography>{params.row.match_type}</Typography>
                </Link>
            );
        }
    },
    {
        field: 'delete',
        headerName: 'Delete',
        flex: 1,
        minWidth: 30,
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => {
            return (
                <IconButton onClick={() => { console.log("delete match: ", params.row.id) }}>
                    <MdDelete color='red' />
                </IconButton>
            );
        }
    }
];

function MatchesList({ matches }: PropType) {
    return (
        <>
            {matches.length > 0 ?
                <div style={{ display: 'flex' }}>
                    <div style={{ height: 400, width: '100%', flexGrow: 1 }}>
                        <DataGrid
                            rows={matches || []}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                        />
                    </div>
                </div> :
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    mt={1}
                >
                    <Card
                        sx={{
                            height: { xs: 100 },
                            width: { xs: "100%" },
                        }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '15vh',
                            color: '#616161'
                        }}>
                            <Typography
                                variant='subtitle2'>No matches in this section.
                            </Typography>
                        </div>
                    </Card>
                </Box>
            }
        </>


    )
}

export default MatchesList