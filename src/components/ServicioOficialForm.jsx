import React, { useEffect, useState } from 'react';
import {
    registrarServicio,
    listarServicios,
    eliminarServicio
} from '../api/servicioOficialService';
import { listarConcesionarios } from '../api/concesionarioService';
import { useNavigate } from 'react-router-dom';

const ServicioOficialForm = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        domicilio: '',
        nit: '',
        idConcesionario: ''
    });

    const [servicios, setServicios] = useState([]);
    const [concesionarios, setConcesionarios] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');
        setError('');

        try {
            const response = await registrarServicio(formData);
            setMensaje(response);
            setFormData({
                nombre: '',
                domicilio: '',
                nit: '',
                idConcesionario: ''
            });
            cargarServicios();
        } catch (err) {
            console.error(err);
            setError('⛔ Error al registrar el servicio oficial');
        }
    };

    const cargarServicios = async () => {
        const data = await listarServicios();
        setServicios(data);
    };

    const cargarConcesionarios = async () => {
        const data = await listarConcesionarios();
        setConcesionarios(data);
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Eliminar este servicio oficial?')) {
            await eliminarServicio(id);
            cargarServicios();
        }
    };

    useEffect(() => {
        cargarServicios();
        cargarConcesionarios();
    }, []);

    return (
        <div>
            <h2>Registrar Servicio Oficial</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Nombre del servicio"
                    required
                />
                <input
                    type="text"
                    name="domicilio"
                    value={formData.domicilio}
                    onChange={handleChange}
                    placeholder="Domicilio"
                    required
                />
                <input
                    type="text"
                    name="nit"
                    value={formData.nit}
                    onChange={handleChange}
                    placeholder="NIT"
                    required
                />
                <select
                    name="idConcesionario"
                    value={formData.idConcesionario}
                    onChange={handleChange}
                    required
                >
                    <option value="">Seleccionar concesionario</option>
                    {concesionarios.map(c => (
                        <option key={c.idConcesionario} value={c.idConcesionario}>
                            {c.nombre}
                        </option>
                    ))}
                </select>
                <button type="submit">Registrar</button>
            </form>

            {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <h3>Servicios Oficiales Registrados</h3>
            <table border="1" cellPadding="5" style={{ marginTop: '1rem' }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Domicilio</th>
                    <th>NIT</th>
                    <th>Concesionario</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {servicios.map((s, i) => (
                    <tr key={i}>
                        <td>{s.idServicio}</td>
                        <td>{s.nombre}</td>
                        <td>{s.domicilio}</td>
                        <td>{s.nit}</td>
                        <td>
                            {
                                concesionarios.find(c => c.idConcesionario === s.idConcesionario)?.nombre || 'N/A'
                            }
                        </td>
                        <td>
                            <button onClick={() => navigate(`/editar-servicio/${s.idServicio}`)}>Editar</button>
                            <button onClick={() => handleEliminar(s.idServicio)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ServicioOficialForm;
