import { PropsWithChildren, createContext, useContext } from "react";
import { useTranslation } from "react-i18next";

type DocumentDelegate = (endpoint: string, id: string, force?: boolean) => Promise<string>;
const getDocumentContext = createContext<DocumentDelegate | null>(null)
export function useGetDocument() {
    return useContext(getDocumentContext)
}

export default function DocumentGenerationProvider(props: PropsWithChildren<{}>) {
    const t = useTranslation()
    const lang = t.i18n.language
    const getDocument: DocumentDelegate = async (endpoint: string, id: string, force?: boolean) => {
        const f: boolean = force ? force : false
        const data = await fetch("/api/doc/" + endpoint + "?category_id=" + id + "&lang=" + lang + "&force=" + f, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json_data = await data.json();
        return json_data["link"] as string;
    }

    return (
        <getDocumentContext.Provider value={getDocument}>
            {props.children}
        </getDocumentContext.Provider>
    )
}