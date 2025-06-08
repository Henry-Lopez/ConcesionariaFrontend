import { useEffect, useState } from 'react';
import {
    registrarCliente,
    listarClientes,
    eliminarCliente
} from '../api/ClienteService';
import { Link } from 'react-router-dom';

export default function ClienteForm() {
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        correo: '',
        fechaNacimiento: '',
        // idCliente opcional si luego haces editar
    });

    const [clientes, setClientes] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await registrarCliente(form);
            alert(res);
            resetForm();
            await cargarClientes();
        } catch (error) {
            console.error(error);
            alert('Error al registrar el cliente');
        }
    };

    const resetForm = () => {
        setForm({
            nombre: '',
            apellido: '',
            direccion: '',
            telefono: '',
            correo: '',
            fechaNacimiento: '',
        });
    };

    const cargarClientes = async () => {
        try {
            const data = await listarClientes();
            setClientes(data);
        } catch (error) {
            console.error('Error al listar clientes:', error);
        }
    };

    const handleEliminar = async (idCliente) => {
        if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
            try {
                await eliminarCliente(idCliente);
                await cargarClientes();
            } catch (error) {
                alert('Error al eliminar cliente');
            }
        }
    };

    useEffect(() => {
        cargarClientes();
    }, []);

    return (
        <div>
            <h2>Registrar Cliente</h2>
            <form onSubmit={handleSubmit}>
                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
                <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" required />
                <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" required />
                <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" required />
                <input name="correo" value={form.correo} onChange={handleChange} placeholder="Correo" required type="email" />
                <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} required />
                <button type="submit">Registrar</button>
            </form>

            <h3>Clientes registrados</h3>
            <table border="1" cellPadding="5" style={{ marginTop: '1rem', width: '100%' }}>
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Fecha Nacimiento</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {clientes.map((cliente) => (
                    <tr key={cliente.idCliente}>
                        <td>{cliente.nombre}</td>
                        <td>{cliente.apellido}</td>
                        <td>{cliente.direccion}</td>
                        <td>{cliente.telefono}</td>
                        <td>{cliente.correo}</td>
                        <td>{cliente.fechaNacimiento}</td>
                        <td>
                            <Link to={`/editar-cliente/${cliente.idCliente}`}>
                                <button>Editar</button>
                            </Link>
                            <button onClick={() => handleEliminar(cliente.idCliente)} style={{ marginLeft: '0.5rem' }}>
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}




