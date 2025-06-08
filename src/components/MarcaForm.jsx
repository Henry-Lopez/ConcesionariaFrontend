import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    registrarMarca,
    listarMarcas,
    eliminarMarca
} from '../api/marcaService';

export default function MarcaForm() {
    const [form, setForm] = useState({ nombre: '' });
    const [marcas, setMarcas] = useState([]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, nombre: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registrarMarca(form);
            setForm({ nombre: '' });
            cargarMarcas();
        } catch (err) {
            alert('❌ Error al registrar la marca');
            console.error(err);
        }
    };

    const cargarMarcas = async () => {
        try {
            const data = await listarMarcas();
            setMarcas(data);
        } catch (err) {
            console.error('Error al cargar marcas:', err);
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Seguro de eliminar esta marca?')) {
            await eliminarMarca(id);
            cargarMarcas();
        }
    };

    useEffect(() => {
        cargarMarcas();
    }, []);

    return (
        <div>
            <h2>Registrar Marca</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Nombre de la Marca"
                    required
                />
                <button type="submit">Registrar</button>
            </form>

            <h3>Marcas Registradas</h3>
            <table border="1" cellPadding="5" style={{ marginTop: '1rem' }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {marcas.map((m) => (
                    <tr key={m.idMarca}>
                        <td>{m.idMarca}</td>
                        <td>{m.nombre}</td>
                        <td>
                            <button onClick={() => navigate(`/editar-marca/${m.idMarca}`)}>Editar</button>
                            <button onClick={() => handleEliminar(m.idMarca)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
