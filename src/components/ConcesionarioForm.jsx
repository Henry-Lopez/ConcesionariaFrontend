import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    registrarConcesionario,
    listarConcesionarios,
    eliminarConcesionario
} from '../api/concesionarioService';

export default function ConcesionarioForm() {
    const [form, setForm] = useState({ nombre: '', direccion: '', nit: '' });
    const [concesionarios, setConcesionarios] = useState([]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registrarConcesionario(form);
            setForm({ nombre: '', direccion: '', nit: '' });
            cargarConcesionarios();
        } catch (err) {
            alert('❌ Error al registrar el concesionario');
            console.error(err);
        }
    };

    const cargarConcesionarios = async () => {
        try {
            const data = await listarConcesionarios();
            setConcesionarios(data);
        } catch (err) {
            console.error('Error al cargar concesionarios:', err);
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Seguro de eliminar este concesionario?')) {
            await eliminarConcesionario(id);
            cargarConcesionarios();
        }
    };

    useEffect(() => {
        cargarConcesionarios();
    }, []);

    return (
        <div>
            <h2>Registrar Concesionario</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Nombre"
                    required
                />
                <input
                    name="direccion"
                    value={form.direccion}
                    onChange={handleChange}
                    placeholder="Dirección"
                    required
                />
                <input
                    name="nit"
                    value={form.nit}
                    onChange={handleChange}
                    placeholder="NIT"
                    required
                />
                <button type="submit">Registrar</button>
            </form>

            <h3>Concesionarios Registrados</h3>
            <table border="1" cellPadding="5" style={{ marginTop: '1rem' }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Dirección</th>
                    <th>NIT</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {concesionarios.map((c) => (
                    <tr key={c.idConcesionario}>
                        <td>{c.idConcesionario}</td>
                        <td>{c.nombre}</td>
                        <td>{c.direccion}</td>
                        <td>{c.nit}</td>
                        <td>
                            <button onClick={() => navigate(`/editar-concesionario/${c.idConcesionario}`)}>Editar</button>
                            <button onClick={() => handleEliminar(c.idConcesionario)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
