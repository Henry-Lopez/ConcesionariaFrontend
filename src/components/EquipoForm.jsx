import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    registrarEquipo,
    listarEquipos,
    eliminarEquipo
} from '../api/equipoService';

export default function EquipoForm() {
    const [form, setForm] = useState({ descripcion: '', precio: '' });
    const [equipos, setEquipos] = useState([]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registrarEquipo({
                descripcion: form.descripcion,
                precio: parseFloat(form.precio)
            });
            setForm({ descripcion: '', precio: '' });
            cargarEquipos();
        } catch (err) {
            alert('❌ Error al registrar el equipo');
            console.error(err);
        }
    };

    const cargarEquipos = async () => {
        try {
            const data = await listarEquipos();
            setEquipos(data);
        } catch (err) {
            console.error('Error al cargar equipos:', err);
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Seguro de eliminar este equipo?')) {
            await eliminarEquipo(id);
            cargarEquipos();
        }
    };

    useEffect(() => {
        cargarEquipos();
    }, []);

    return (
        <div>
            <h2>Registrar Equipo</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    placeholder="Descripción del equipo"
                    required
                />
                <input
                    name="precio"
                    type="number"
                    step="0.01"
                    value={form.precio}
                    onChange={handleChange}
                    placeholder="Precio"
                    required
                />
                <button type="submit">Registrar</button>
            </form>

            <h3>Equipos Registrados</h3>
            <table border="1" cellPadding="5" style={{ marginTop: '1rem' }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {equipos.map((e) => (
                    <tr key={e.idEquipo}>
                        <td>{e.idEquipo}</td>
                        <td>{e.descripcion}</td>
                        <td>{e.precio}</td>
                        <td>
                            <button onClick={() => navigate(`/editar-equipo/${e.idEquipo}`)}>Editar</button>
                            <button onClick={() => handleEliminar(e.idEquipo)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
