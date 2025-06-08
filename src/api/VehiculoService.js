import axios from 'axios';

const API_URL = 'http://localhost:8080/api/vehiculos';

// ✅ Crear vehículo
export const registrarVehiculo = async (vehiculo) => {
    const response = await axios.post(`${API_URL}/registrar`, vehiculo);
    return response.data;
};

// ✅ Leer todos los vehículos
export const listarVehiculos = async () => {
    const response = await axios.get(`${API_URL}/listar`);
    return response.data;
};

// ✅ Leer solo vehículos en stock (nuevo)
export const listarVehiculosDisponibles = async () => {
    const response = await axios.get(`${API_URL}/disponibles`);
    return response.data;
};

// ✅ Actualizar vehículo por número de chasis
export const actualizarVehiculo = async (nroChasis, vehiculo) => {
    const response = await axios.put(`${API_URL}/actualizar/${nroChasis}`, vehiculo);
    return response.data;
};

// ✅ Eliminar vehículo por número de chasis
export const eliminarVehiculo = async (nroChasis) => {
    const response = await axios.delete(`${API_URL}/eliminar/${nroChasis}`);
    return response.data;
};

// ✅ Obtener un vehículo específico por su número de chasis
export const obtenerVehiculoPorChasis = async (nroChasis) => {
    const response = await axios.get(`${API_URL}/${nroChasis}`);
    return response.data;
};
