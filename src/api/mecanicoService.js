import axios from 'axios';

const API_URL = 'http://localhost:8080/api/mecanicos';

export const registrarMecanico = async (mecanico) => {
    const response = await axios.post(`${API_URL}/registrar`, mecanico);
    return response.data;
};

export const listarMecanicos = async () => {
    const response = await axios.get(`${API_URL}/listar`);
    return response.data;
};

export const actualizarMecanico = async (mecanico) => {
    const response = await axios.put(`${API_URL}/actualizar`, mecanico);
    return response.data;
};

export const eliminarMecanico = async (id) => {
    const response = await axios.delete(`${API_URL}/eliminar/${id}`);
    return response.data;
};

export const obtenerMecanicoPorId = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
