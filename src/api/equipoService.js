import axios from 'axios';

const API_URL = 'http://localhost:8080/api/equipos';

export const registrarEquipo = async (equipo) => {
    const response = await axios.post(`${API_URL}/registrar`, equipo);
    return response.data;
};

export const listarEquipos = async () => {
    const response = await axios.get(`${API_URL}/listar`);
    return response.data;
};

export const actualizarEquipo = async (equipo) => {
    const response = await axios.put(`${API_URL}/actualizar`, equipo);
    return response.data;
};

export const eliminarEquipo = async (id) => {
    const response = await axios.delete(`${API_URL}/eliminar/${id}`);
    return response.data;
};

export const obtenerEquipoPorId = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
