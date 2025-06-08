// src/components/VistaPedidosReport.jsx
import React, { useEffect, useState } from 'react';
import { listarVistaPedidos } from '../api/pedidoService';

const VistaPedidosReport = () => {
    const [vistaPedidos, setVistaPedidos] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarVista = async () => {
            try {
                const data = await listarVistaPedidos();
                setVistaPedidos(data);
            } catch (err) {
                console.error('⛔ Error al cargar vista:', err);
                setError('No se pudo cargar la vista de pedidos');
            }
        };

        cargarVista();
    }, []);

    return (
        <div>
            <h2>📦 Reporte de Pedidos de Importación</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <table border="1" cellPadding="5" style={{ marginTop: '1rem', width: '100%' }}>
                <thead>
                <tr>
                    <th>ID Pedido</th>
                    <th>ID Repuesto</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Fecha Solicitud</th>
                    <th>Fecha Entrega</th>
                </tr>
                </thead>
                <tbody>
                {vistaPedidos.map((p, i) => (
                    <tr key={i}>
                        <td>{p.idPedido}</td>
                        <td>{p.idRepuesto}</td>
                        <td>{p.descripcionRepuesto}</td>
                        <td>{p.estado}</td>
                        <td>{p.fechaSolicitud}</td>
                        <td>{p.fechaEntrega || '---'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default VistaPedidosReport;
