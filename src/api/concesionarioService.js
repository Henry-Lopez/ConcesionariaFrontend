import axios from 'axios';

const API_URL = 'http://localhost:8080/api/concesionarios';

export const registrarConcesionario = async (concesionario) => {
    const response = await axios.post(`${API_URL}/registrar`, concesionario);
    return response.data;
};

export const listarConcesionarios = async () => {
    const response = await axios.get(`${API_URL}/listar`);
    return response.data;
};

export const actualizarConcesionario = async (concesionario) => {
    const response = await axios.put(`${API_URL}/actualizar`, concesionario);
    return response.data;
};

export const eliminarConcesionario = async (id) => {
    const response = await axios.delete(`${API_URL}/eliminar/${id}`);
    return response.data;
};

export const obtenerConcesionarioPorId = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
