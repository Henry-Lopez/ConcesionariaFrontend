// src/api/ModeloService.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/modelos';

// ✅ Registrar nuevo modelo
export const registrarModelo = async (modelo) => {
    const response = await axios.post(`${API_URL}/registrar`, modelo);
    return response.data;
};

// ✅ Listar todos los modelos
export const listarModelos = async () => {
    const response = await axios.get(`${API_URL}/listar`);
    return response.data;
};

// ✅ Obtener un modelo por ID
export const obtenerModeloPorId = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// ✅ Actualizar modelo por ID
export const actualizarModelo = async (id, modelo) => {
    const response = await axios.put(`${API_URL}/actualizar/${id}`, modelo);
    return response.data;
};

// ✅ Eliminar modelo por ID
export const eliminarModelo = async (id) => {
    const response = await axios.delete(`${API_URL}/eliminar/${id}`);
    return response.data;
};
