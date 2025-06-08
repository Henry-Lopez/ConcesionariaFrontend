import axios from 'axios';

const API_URL = 'http://localhost:8080/api/repuestos';

// ✅ Crear repuesto
export const registrarRepuesto = async (repuesto) => {
    const response = await axios.post(`${API_URL}/registrar`, repuesto);
    return response.data;
};

// ✅ Leer todos los repuestos
export const listarRepuestos = async () => {
    const response = await axios.get(`${API_URL}/listar`);
    return response.data;
};

// ✅ Actualizar repuesto por ID
export const actualizarRepuesto = async (id, repuesto) => {
    const response = await axios.put(`${API_URL}/actualizar/${id}`, repuesto);
    return response.data;
};

// ✅ Eliminar repuesto por ID
export const eliminarRepuesto = async (id) => {
    const response = await axios.delete(`${API_URL}/eliminar/${id}`);
    return response.data;
};
export const obtenerRepuestoPorId = async (id) => {
    const response = await axios.get(`${API_URL}/obtener/${id}`);
    return response.data;
};


