// src/api/ReporteService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/reportes';

export const getVentasPorMes = async (mes, anio) => {
    const response = await axios.get(`${BASE_URL}/ventas-por-mes`, {
        params: { mes, anio }
    });
    return response.data;
};

export const getVentasPorEmpleado = async () => {
    const response = await axios.get(`${BASE_URL}/ventas-por-empleado`);
    return response.data;
};

export const getModelosMasVendidos = async () => {
    const response = await axios.get(`${BASE_URL}/modelos-mas-vendidos`);
    return response.data;
};

export const getIngresosTotales = async () => {
    const response = await axios.get(`${BASE_URL}/ingresos-totales`);
    return response.data;
};

export const getReparacionesPorMecanico = async () => {
    const response = await axios.get(`${BASE_URL}/reparaciones-por-mecanico`);
    return response.data;
};

export const getRepuestosMasUsados = async () => {
    const response = await axios.get(`${BASE_URL}/repuestos-mas-usados`);
    return response.data;
};

export const getHistorialCliente = async (idCliente) => {
    const response = await axios.get(`${BASE_URL}/historial-cliente/${idCliente}`);
    return response.data;
};

