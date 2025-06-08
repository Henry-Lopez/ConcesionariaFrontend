import axios from 'axios';

const API_URL = 'http://localhost:8080/api/empleados';

// ✅ Crear empleado
export const registrarEmpleado = async (empleado) => {
    const response = await axios.post(`${API_URL}/registrar`, empleado);
    return response.data;
};

// ✅ Leer todos los empleados
export const listarEmpleados = async () => {
    const response = await axios.get(`${API_URL}/listar`);
    return response.data;
};

export const actualizarEmpleado = async (empleado) => {
    const response = await axios.put(`${API_URL}/actualizar`, empleado);
    return response.data;
};



// ✅ Eliminar empleado por ID
export const eliminarEmpleado = async (id) => {
    const response = await axios.delete(`${API_URL}/eliminar/${id}`);
    return response.data;
};

