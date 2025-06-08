import axios from 'axios';

const API_BASE = 'http://localhost:8080/api/facturas';

// ✅ Listar facturas de ventas
export const listarFacturasVenta = async () => {
    const response = await axios.get(`${API_BASE}/ventas/listar`);
    return response.data;
};

// ✅ Listar facturas de reparaciones
export const listarFacturasReparacion = async () => {
    const response = await axios.get(`${API_BASE}/reparaciones/listar`);
    return response.data;
};
