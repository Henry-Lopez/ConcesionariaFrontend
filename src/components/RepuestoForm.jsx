import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    registrarRepuesto,
    listarRepuestos,
    actualizarRepuesto,
    eliminarRepuesto,
} from '../api/RepuestoService';

export default function RepuestoForm() {
    const [form, setForm] = useState({
        descripcion: '',
        precioUnidad: '',
    });

    const [repuestos, setRepuestos] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const navigate = useNavigate(); // 🔁 Hook para redireccionar

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            descripcion: form.descripcion,
            precioUnidad: parseFloat(form.precioUnidad),
        };

        try {
            if (editandoId === null) {
                await registrarRepuesto(data);
            } else {
                await actualizarRepuesto(editandoId, data);
                setEditandoId(null);
            }
            setForm({ descripcion: '', precioUnidad: '' });
            cargarRepuestos();
        } catch (err) {
            alert('Error al guardar el repuesto');
        }
    };

    const cargarRepuestos = async () => {
        try {
            const data = await listarRepuestos();
            setRepuestos(data);
        } catch (err) {
            console.error('Error al cargar repuestos:', err);
        }
    };

    const handleEditar = (id) => {
        navigate(`/editar-repuesto/${id}`); // 🔁 Redirección a la página de edición
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este repuesto?')) {
            await eliminarRepuesto(id);
            cargarRepuestos();
        }
    };

    useEffect(() => {
        cargarRepuestos();
    }, []);

    return (
        <div>
            <h2>{editandoId ? 'Editar Repuesto' : 'Registrar Repuesto'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    placeholder="Descripción"
                    required
                />
                <input
                    type="number"
                    name="precioUnidad"
                    value={form.precioUnidad}
                    onChange={handleChange}
                    placeholder="Precio"
                    required
                />
                <button type="submit">{editandoId ? 'Actualizar' : 'Registrar'}</button>
            </form>

            <h3>Repuestos Registrados</h3>
            <table border="1" cellPadding="5" style={{ marginTop: '1rem' }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Descripción</th>
                    <th>Precio Unidad</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {repuestos.map((rep) => (
                    <tr key={rep.idRepuesto}>
                        <td>{rep.idRepuesto}</td>
                        <td>{rep.descripcion}</td>
                        <td>{rep.precioUnidad}</td>
                        <td>
                            <button onClick={() => handleEditar(rep.idRepuesto)}>Editar</button>
                            <button onClick={() => handleEliminar(rep.idRepuesto)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
