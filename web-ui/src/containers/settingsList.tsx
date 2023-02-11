import { Box, IconButton, List, ListItem, ListItemText, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { MdAddCircle, MdDeleteOutline } from 'react-icons/md'
import { useParams } from '../contexts/paramsContext'

type PropType = {
    itemsName: string
}

function SettingsList({ itemsName }: PropType) {
    const [items, setItems] = useState<string[]>([])

    const paramsContext = useParams()

    useEffect(() => {
        if (paramsContext) {
            paramsContext(itemsName).then(res => setItems(res as string[]))
        }
    }, [paramsContext])

    return (
        <>
            <Box
                display="flex"
                justifyContent="flex-end">
                <TextField
                    id="outlined-basic"
                    label="Add item..."
                    variant="outlined"
                    fullWidth
                />
                <IconButton
                    color="primary"
                    onClick={() => { console.log("Add") }}
                    size="large">
                    <MdAddCircle size={36} />
                </IconButton>
            </Box>

            {items.length > 0 ?
                <List>
                    {items.map((item) => (
                        <ListItem
                            key={item}
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => console.log("Delete")}>
                                    <MdDeleteOutline />
                                </IconButton>
                            }
                        >
                            <ListItemText
                                primary={item}
                            />
                        </ListItem>
                    ))}
                </List>
                : <Box display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center">
                    No data available.
                </Box>
            }
        </>
    )
}

export default SettingsList