import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditarPedidoImportacionPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(null);
    const [repuestos, setRepuestos] = useState([]);

    // Cargar datos del pedido
    useEffect(() => {
        axios.get(`http://localhost:8080/api/pedidos-importacion/${id}`)
            .then(res => {
                const pedido = res.data;
                if (pedido.fechaSolicitud?.length > 10)
                    pedido.fechaSolicitud = pedido.fechaSolicitud.slice(0, 10);
                if (pedido.fechaEntrega?.length > 10)
                    pedido.fechaEntrega = pedido.fechaEntrega.slice(0, 10);
                setForm(pedido);
            })
            .catch(() => alert("⛔ Error al cargar el pedido"));
    }, [id]);

    // Cargar repuestos para select
    useEffect(() => {
        axios.get("http://localhost:8080/api/repuestos/listar")
            .then(res => setRepuestos(res.data))
            .catch(() => alert("⛔ Error al cargar repuestos"));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/pedidos-importacion/actualizar`, form);
            alert("✅ Pedido actualizado correctamente");
            navigate("/registro-pedido-importacion");
        } catch (err) {
            console.error(err);
            alert("⛔ Error al actualizar el pedido");
        }
    };

    if (!form) return <p>Cargando pedido...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Editar Pedido de Importación</h2>

            <label>Repuesto:</label>
            <select name="idRepuesto" value={form.idRepuesto} onChange={handleChange} required disabled>
                <option value="">Seleccione un repuesto</option>
                {repuestos.map(r => (
                    <option key={r.idRepuesto} value={r.idRepuesto}>
                        {r.descripcion}
                    </option>
                ))}
            </select>

            <label>Estado:</label>
            <select name="estado" value={form.estado} onChange={handleChange} required>
                <option value="pendiente">Pendiente</option>
                <option value="recibido">Recibido</option>
                <option value="entregado">Entregado</option>
            </select>

            <label>Fecha de entrega:</label>
            <input
                type="date"
                name="fechaEntrega"
                value={form.fechaEntrega || ''}
                onChange={handleChange}
            />

            <button type="submit">Guardar Cambios</button>
        </form>
    );
}
