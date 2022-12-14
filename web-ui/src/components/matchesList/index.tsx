import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { MatchDTO } from "../../DTOs/MatchDTO";
import { Box, Card, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

type PropType = {
    matches: MatchDTO[]
}

const columns: GridColDef[] = [
    {
        field: 'date',
        headerName: 'Date',
        flex: 2,
        minWidth: 80
    },
    {
        field: 'id',
        headerName: 'ID',
        flex: 2,
        minWidth: 80,
        renderCell: (params) => {
            return (
                <Link
                    component={RouterLink}
                    to={`/matches/${params.id}`}
                    underline="none"
                    color="inherit">
                    <Typography>{params.row.id}</Typography>
                </Link>
            );
        }
    },
    {
        field: 'local',
        headerName: 'Local',
        flex: 2,
        minWidth: 80
    },
    {
        field: 'visitor',
        headerName: 'Visitor',
        flex: 2,
        minWidth: 80
    },
    {
        field: 'match_type',
        headerName: 'Match Type',
        flex: 2,
        minWidth: 80
    }
];

function MatchesList({ matches }: PropType) {
    return (
        <>
            {matches.length > 0 ?
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={matches || []}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                    />
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