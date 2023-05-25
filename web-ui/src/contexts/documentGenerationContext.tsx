import { PropsWithChildren, createContext, useContext } from "react";

type DocumentDelegate = (endpoint: string, id: string) => Promise<string>;
const getDocumentContext = createContext<DocumentDelegate | null>(null)
export function useGetDocument() {
    return useContext(getDocumentContext)
}

export default function DocumentGenerationProvider(props: PropsWithChildren<{}>) {
    const getDocument: DocumentDelegate = async (endpoint: string, id: string) => {
        const data = await fetch("/api/doc/" + endpoint + "?category_id=" + id, {
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