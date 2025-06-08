import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    registrarMecanico,
    listarMecanicos,
    eliminarMecanico
} from '../api/mecanicoService';

export default function MecanicoForm() {
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        especialidad: '',
        salario: '',
        fechaIngreso: ''
    });

    const [mecanicos, setMecanicos] = useState([]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registrarMecanico(form);
            setForm({
                nombre: '',
                apellido: '',
                direccion: '',
                telefono: '',
                especialidad: '',
                salario: '',
                fechaIngreso: ''
            });
            cargarMecanicos();
        } catch (err) {
            alert('❌ Error al registrar el mecánico');
            console.error(err);
        }
    };

    const cargarMecanicos = async () => {
        try {
            const data = await listarMecanicos();
            setMecanicos(data);
        } catch (err) {
            console.error('Error al cargar mecánicos:', err);
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Seguro de eliminar este mecánico?')) {
            await eliminarMecanico(id);
            cargarMecanicos();
        }
    };

    useEffect(() => {
        cargarMecanicos();
    }, []);

    return (
        <div>
            <h2>Registrar Mecánico</h2>
            <form onSubmit={handleSubmit}>
                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
                <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" required />
                <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" required />
                <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" required />
                <input name="especialidad" value={form.especialidad} onChange={handleChange} placeholder="Especialidad" required />
                <input name="salario" value={form.salario} onChange={handleChange} placeholder="Salario" type="number" required />
                <input name="fechaIngreso" value={form.fechaIngreso} onChange={handleChange} type="date" required />
                <button type="submit">Registrar</button>
            </form>

            <h3>Mecánicos Registrados</h3>
            <table border="1" cellPadding="5" style={{ marginTop: '1rem' }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Especialidad</th>
                    <th>Salario</th>
                    <th>Fecha Ingreso</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {mecanicos.map((m) => (
                    <tr key={m.idMecanico}>
                        <td>{m.idMecanico}</td>
                        <td>{m.nombre}</td>
                        <td>{m.apellido}</td>
                        <td>{m.direccion}</td>
                        <td>{m.telefono}</td>
                        <td>{m.especialidad}</td>
                        <td>{m.salario}</td>
                        <td>{m.fechaIngreso}</td>
                        <td>
                            <button onClick={() => navigate(`/editar-mecanico/${m.idMecanico}`)}>Editar</button>
                            <button onClick={() => handleEliminar(m.idMecanico)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
