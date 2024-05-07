export const config = {
    baseUrl: "/",  // Url base
    filename: "nacl.json", // Nome do arquivo que armazena permissões
    roleSearchPath: "user.role", // Procura o campo role no objeto user
    path: "src/config" // Pasta onde arquivo com permissões está
};

// Exibe mensagem ao usuário, no caso de ele não ter permissão para acessar rota
export const responseObject = {
    status: "Access Denied",
    message: "You are not authorized to access this resource"
};