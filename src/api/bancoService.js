// src/api/bancoService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/bancos';

// ✅ Crear banco
export const registrarBanco = async (banco) => {
    const response = await axios.post(`${API_URL}/registrar`, banco);
    return response.data;
};

// ✅ Obtener todos los bancos
export const listarBancos = async () => {
    const response = await axios.get(`${API_URL}/listar`);
    return response.data;
};

// ✅ Obtener banco por ID
export const obtenerBancoPorId = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// ✅ Actualizar banco
export const actualizarBanco = async (banco) => {
    const response = await axios.put(`${API_URL}/actualizar`, banco);
    return response.data;
};

// ✅ Eliminar banco
export const eliminarBanco = async (id) => {
    const response = await axios.delete(`${API_URL}/eliminar/${id}`);
    return response.data;
};
