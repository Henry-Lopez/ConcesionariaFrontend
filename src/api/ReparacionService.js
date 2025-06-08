import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/reparaciones';

// ✅ Crear reparación
export const registrarReparacion = async (datos) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/registrar`, datos);
        return response.data;
    } catch (error) {
        console.error('Error al registrar reparación:', error);
        throw error;
    }
};

// ✅ Leer todas las reparaciones
export const listarReparaciones = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/listar`);
        return response.data;
    } catch (error) {
        console.error('Error al listar reparaciones:', error);
        throw error;
    }
};

// ✅ Actualizar reparación por ID
export const actualizarReparacion = async (id, datos) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/actualizar/${id}`, datos);
        return response.data;
    } catch (error) {
        console.error('Error al actualizar reparación:', error);
        throw error;
    }
};

// ✅ Eliminar reparación por ID
export const eliminarReparacion = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/eliminar/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar reparación:', error);
        throw error;
    }
};


