import { useEffect, useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { MatchDTO } from "../../DTOs/MatchDTO";
import { Box, Card, Typography } from '@mui/material';

type PropType = {
    matches: MatchDTO[]
}

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'ID',
        flex: 2,
        minWidth: 80
    }
];

function MatchesList({ matches }: PropType) {
    const [rows, setRows] = useState<MatchDTO[]>([] as MatchDTO[])

    useEffect(() => {
        if (matches) {
            setRows(matches)
        }
    }, [matches])

    return (
        <>
            {rows.length > 0 ?
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows || []}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                    />
                </div> :

                <Box
                    display="flex"
                    // flexDirection="column"
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
                                // p={1}
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