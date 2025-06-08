import axios from 'axios';

const API_URL = 'http://localhost:8080/api/marcas';

export const registrarMarca = async (marca) => {
    const response = await axios.post(`${API_URL}/registrar`, marca);
    return response.data;
};

export const listarMarcas = async () => {
    const response = await axios.get(`${API_URL}/listar`);
    return response.data;
};

export const actualizarMarca = async (marca) => {
    const response = await axios.put(`${API_URL}/actualizar`, marca);
    return response.data;
};

export const eliminarMarca = async (id) => {
    const response = await axios.delete(`${API_URL}/eliminar/${id}`);
    return response.data;
};

export const obtenerMarcaPorId = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
