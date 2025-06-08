import axios from 'axios';

const API_URL = 'http://localhost:8080/api/financiamientos';

// ✅ Registrar nuevo financiamiento
export const registrarFinanciamiento = async (financiamiento) => {
    const response = await axios.post(`${API_URL}/registrar`, financiamiento);
    return response.data;
};

// ✅ Listar todos los financiamientos
export const listarFinanciamientos = async () => {
    const response = await axios.get(`${API_URL}/listar`);
    return response.data;
};

// ✅ Obtener financiamiento por ID
export const obtenerFinanciamientoPorId = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// ✅ Obtener financiamiento por ID de venta
export const obtenerFinanciamientoPorVenta = async (idVenta) => {
    const response = await axios.get(`${API_URL}/venta/${idVenta}`);
    return response.data;
};

// ✅ Actualizar financiamiento
export const actualizarFinanciamiento = async (financiamiento) => {
    const response = await axios.put(`${API_URL}/actualizar`, financiamiento);
    return response.data;
};

// ✅ Eliminar financiamiento
export const eliminarFinanciamiento = async (id) => {
    const response = await axios.delete(`${API_URL}/eliminar/${id}`);
    return response.data;
};

// ✅ Listar financiamientos sin banco
export const listarFinanciamientosDisponibles = async () => {
    const response = await axios.get(`${API_URL}/disponibles`);
    return response.data;
};
