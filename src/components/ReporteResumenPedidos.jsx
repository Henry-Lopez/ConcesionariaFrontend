import React, { useEffect, useState } from 'react';
import { obtenerResumenPedidos } from '../api/pedidoService';
import '../styles/professional.css';

const ReporteResumenPedidos = () => {
    const [resumen, setResumen] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResumen = async () => {
            try {
                const data = await obtenerResumenPedidos();
                setResumen(data);
            } catch (err) {
                setError('⛔ Error al obtener el resumen');
            }
        };
        fetchResumen();
    }, []);

    return (
        <div className="container">
            <h2 className="title">📦 Reporte Resumen de Pedidos de Importación</h2>

            {error && <p className="error">{error}</p>}

            <table className="table">
                <thead>
                <tr>
                    <th>Descripción</th>
                    <th>Total Pendientes</th>
                    <th>Total Entregados</th>
                </tr>
                </thead>
                <tbody>
                {resumen.map((item, index) => (
                    <tr key={index}>
                        <td>{item.descripcionRepuesto}</td>
                        <td>{item.totalPendientes}</td>
                        <td>{item.totalEntregados}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReporteResumenPedidos;
