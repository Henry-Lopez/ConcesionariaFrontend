import axios from 'axios';

const API_URL = 'http://localhost:8080/api/clientes';

// ✅ Crear cliente
export const registrarCliente = async (cliente) => {
    const response = await axios.post(`${API_URL}/registrar`, cliente);
    return response.data;
};

// ✅ Leer todos los clientes
export const listarClientes = async () => {
    const response = await axios.get(`${API_URL}/listar`);
    return response.data;
};

export const actualizarCliente = async (cliente) => {
    const response = await axios.put(`${API_URL}/actualizar`, cliente);
    return response.data;
};


// ✅ Eliminar cliente por ID (esto sí se mantiene igual)
export const eliminarCliente = async (id) => {
    const response = await axios.delete(`${API_URL}/eliminar/${id}`);
    return response.data;
};
