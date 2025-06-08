import axios from 'axios';

const API_URL = 'http://localhost:8080/api/ventas';

// ✅ Crear venta
export const registrarVenta = async (ventaData) => {
    try {
        const response = await axios.post(`${API_URL}/registrar`, ventaData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// ✅ Leer todas las ventas
export const listarVentas = async () => {
    try {
        const response = await axios.get(`${API_URL}/listar`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Opción 1: si el backend sigue sin pedir ID en la URL:
export const actualizarVenta = async (id, ventaData) => {
    try {
        const dataConId = { ...ventaData, idVenta: id }; // ✅ obligatorio
        const response = await axios.put(`${API_URL}/actualizar`, dataConId);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};


// ✅ Eliminar venta por ID
export const eliminarVenta = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/eliminar/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
export const obtenerVentaPorId = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`); // ✅ esto sí existe
    return response.data;
};


