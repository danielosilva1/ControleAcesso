export const setStoredItem = (key: string, value: string) => {
    localStorage.setItem(key, value);
}

export const getStoredItem = (key: string) => {
    // Valida se aplicação está rodando no lado do cliente, pois no lado do servidor os dados do localStorage não existem
    if (typeof window !== "undefined") {
        try {
            return localStorage.getItem(key);
        } catch(error) {
            console.log(`Ocorreu um erro ao buscar valor referente à chave ${key} do localStorage`);
            return null;
        }
    }
}

export const removeStoredItem = (key: string) => {
    try {
        localStorage.removeItem(key);
    } catch {
        console.log(`Ocorreu um erro ao tentar remover o valor referente à chave ${key} do localStorage`)
    }
}