import axios from 'axios';

const API_URL = 'http://localhost:8080/api/pedidos';

// ✅ Registrar un nuevo pedido
export const registrarPedido = async (pedido) => {
    const response = await axios.post(`${API_URL}/registrar`, pedido);
    return response.data;
};

// ✅ Listar todos los pedidos
export const listarPedidos = async () => {
    const response = await axios.get(`${API_URL}/listar`);
    return response.data;
};

// ✅ Obtener pedido por ID
export const obtenerPedidoPorId = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// ✅ Actualizar pedido
export const actualizarPedido = async (pedido) => {
    const response = await axios.put(`${API_URL}/actualizar`, pedido, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
};

// ✅ Eliminar pedido
export const eliminarPedido = async (id) => {
    const response = await axios.delete(`${API_URL}/eliminar/${id}`);
    return response.data;
};

// ✅ Obtener resumen de pedidos de importación
export const obtenerResumenPedidos = async () => {
    const response = await axios.get(`${API_URL}/reporte-resumen`);
    return response.data;
};
export const listarVistaPedidos = async () => {
    const response = await axios.get('http://localhost:8080/api/pedidos/vista');
    return response.data;
};
