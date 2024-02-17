import { Box, IconButton, List, ListItem, ListItemText, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { MdAddCircle, MdDeleteOutline } from 'react-icons/md'
import { useDeleteParam, useNewParam, useParamUpdated, useParams } from '../contexts/paramsContext'
import { useTranslation } from 'react-i18next';

type PropType = {
    itemsName: string
}

function SettingsList({ itemsName }: Readonly<PropType>) {
    const { t } = useTranslation();

    const [items, setItems] = useState<string[]>([])
    const [newItem, setNewItem] = useState<string>("")

    const paramsContext = useParams()
    const newParamContext = useNewParam()
    const deleteParamContext = useDeleteParam()
    const paramUpdatedContext = useParamUpdated()

    useEffect(() => {
        if (paramsContext) {
            paramsContext(itemsName).then(res => setItems(res as string[]))
        }
    }, [paramsContext, paramUpdatedContext])

    const handleAdd = () => {
        if (newParamContext && newItem != "") {
            newParamContext(itemsName, newItem)
            setNewItem("")
        }
    }

    const handleDelete = (value: string) => {
        if (deleteParamContext) {
            deleteParamContext(itemsName, value)
            if (paramsContext) {
                paramsContext(itemsName).then(res => setItems(res as string[]))
            }
        }
    }

    return (
        <>
            <Box
                display="flex"
                justifyContent="flex-end">
                <TextField
                    id="outlined-basic"
                    label={`${t("add")}...`}
                    variant="outlined"
                    fullWidth
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    onSubmit={() => handleAdd()}
                />
                <IconButton
                    color="primary"
                    onClick={() => { handleAdd() }}
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
                                    onClick={() => handleDelete(item)}>
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
                    {t("no_data")}
                </Box>
            }
        </>
    )
}

export default SettingsList