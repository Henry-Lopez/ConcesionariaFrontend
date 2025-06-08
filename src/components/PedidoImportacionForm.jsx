import React, { useEffect, useState } from 'react';
import {
    registrarPedido,
    listarPedidos,
    eliminarPedido,
    actualizarPedido,
    obtenerPedidoPorId
} from '../api/pedidoService';
import { listarRepuestos } from '../api/RepuestoService';

const PedidoImportacionForm = () => {
    const [formData, setFormData] = useState({
        idRepuesto: '',
        estado: 'pendiente',
        fechaEntrega: ''
    });

    const [pedidos, setPedidos] = useState([]);
    const [repuestos, setRepuestos] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [resultado, setResultado] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResultado('');
        setError('');

        try {
            let response;

            if (editandoId === null) {
                const today = new Date().toISOString().split("T")[0];
                const payload = { ...formData, fechaSolicitud: today };
                response = await registrarPedido(payload);
            } else {
                const payload = {
                    idPedido: editandoId,
                    ...formData
                };
                response = await actualizarPedido(payload);
                setEditandoId(null);
            }

            setResultado(response);
            cargarPedidos();
            setFormData({
                idRepuesto: '',
                estado: 'pendiente',
                fechaEntrega: ''
            });
        } catch (err) {
            console.error(err);
            setError('⛔ Error al procesar el pedido');
        }
    };

    const cargarPedidos = async () => {
        try {
            const data = await listarPedidos();
            setPedidos(data);
        } catch (err) {
            console.error('⛔ Error al cargar pedidos:', err);
        }
    };

    const cargarRepuestos = async () => {
        try {
            const data = await listarRepuestos();
            setRepuestos(data);
        } catch (err) {
            console.error('⛔ Error al cargar repuestos:', err);
        }
    };

    const handleEditar = async (id) => {
        try {
            const pedido = await obtenerPedidoPorId(id);
            setFormData({
                idRepuesto: pedido.idRepuesto,
                estado: pedido.estado,
                fechaEntrega: pedido.fechaEntrega || ''
            });
            setEditandoId(id);
        } catch (err) {
            console.error('⛔ Error al obtener pedido:', err);
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Eliminar este pedido de importación?')) {
            await eliminarPedido(id);
            cargarPedidos();
        }
    };

    useEffect(() => {
        cargarPedidos();
        cargarRepuestos();
    }, []);

    return (
        <div>
            <h2>{editandoId ? 'Editar Pedido de Importación' : 'Registrar Pedido de Importación'}</h2>
            <form onSubmit={handleSubmit}>
                <label>Repuesto:</label>
                <select
                    name="idRepuesto"
                    value={formData.idRepuesto}
                    onChange={handleChange}
                    required
                    disabled={editandoId !== null}
                >
                    <option value="">-- Selecciona un repuesto --</option>
                    {repuestos.map(r => (
                        <option key={r.idRepuesto} value={r.idRepuesto}>
                            {r.descripcion}
                        </option>
                    ))}
                </select>

                {editandoId && (
                    <>
                        <label>Estado:</label>
                        <select name="estado" value={formData.estado} onChange={handleChange}>
                            <option value="pendiente">Pendiente</option>
                            <option value="recibido">Recibido</option>
                            <option value="entregado">Entregado</option>
                        </select>

                        <label>Fecha de Entrega:</label>
                        <input
                            type="date"
                            name="fechaEntrega"
                            value={formData.fechaEntrega}
                            onChange={handleChange}
                        />
                    </>
                )}

                <button type="submit">{editandoId ? 'Actualizar' : 'Registrar'}</button>
            </form>

            {resultado && <p style={{ color: 'green' }}>{resultado}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h3>Pedidos Registrados</h3>
            <table border="1" cellPadding="5" style={{ marginTop: '1rem' }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Repuesto</th>
                    <th>Estado</th>
                    <th>Fecha Solicitud</th>
                    <th>Fecha Entrega</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {pedidos.map((p, index) => (
                    <tr key={index}>
                        <td>{p.idPedido}</td>
                        <td>{repuestos.find(r => r.idRepuesto === p.idRepuesto)?.descripcion || p.idRepuesto}</td>
                        <td>{p.estado}</td>
                        <td>{p.fechaSolicitud}</td>
                        <td>{p.fechaEntrega || '---'}</td>
                        <td>
                            <button onClick={() => handleEditar(p.idPedido)}>Editar</button>
                            <button onClick={() => handleEliminar(p.idPedido)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PedidoImportacionForm;
