import axios from 'axios';

const API_URL = 'http://localhost:8080/api/servicios';

// ✅ Crear servicio oficial
export const registrarServicio = async (servicio) => {
    const response = await axios.post(`${API_URL}/registrar`, servicio);
    return response.data;
};

// ✅ Leer todos los servicios oficiales
export const listarServicios = async () => {
    const response = await axios.get(`${API_URL}/listar`);
    return response.data;
};

// ✅ Obtener servicio oficial por ID
export const obtenerServicioPorId = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// ✅ Actualizar servicio oficial
export const actualizarServicio = async (servicio) => {
    const response = await axios.put(`${API_URL}/actualizar/${servicio.idServicio}`, servicio);
    return response.data;
};

// ✅ Eliminar servicio oficial por ID
export const eliminarServicio = async (id) => {
    const response = await axios.delete(`${API_URL}/eliminar/${id}`);
    return response.data;
};
