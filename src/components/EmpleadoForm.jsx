import { useEffect, useState } from 'react';
import {
    registrarEmpleado,
    listarEmpleados,
    eliminarEmpleado
} from '../api/EmpleadoService';
import { listarConcesionarios } from '../api/concesionarioService';
import { listarServicios } from '../api/servicioOficialService';
import { Link } from 'react-router-dom';

export default function EmpleadoForm() {
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        correo: '',
        fechaContratacion: '',
        cargo: '',
        trabajaEn: 'concesionario',
        idConcesionario: '',
        idServicio: '',
    });

    const [empleados, setEmpleados] = useState([]);
    const [concesionarios, setConcesionarios] = useState([]);
    const [servicios, setServicios] = useState([]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            ...form,
            idConcesionario: form.trabajaEn === 'concesionario' ? parseInt(form.idConcesionario) : null,
            idServicio: form.trabajaEn === 'servicio_oficial' ? parseInt(form.idServicio) : null,
        };

        try {
            const res = await registrarEmpleado(data);
            alert(res);
            setForm({
                nombre: '',
                apellido: '',
                direccion: '',
                telefono: '',
                correo: '',
                fechaContratacion: '',
                cargo: '',
                trabajaEn: 'concesionario',
                idConcesionario: '',
                idServicio: '',
            });
            cargarEmpleados();
        } catch (error) {
            alert('Error al registrar empleado');
            console.error(error);
        }
    };

    const cargarEmpleados = async () => {
        try {
            const data = await listarEmpleados();
            setEmpleados(data);
        } catch (error) {
            console.error('Error al listar empleados:', error);
        }
    };

    const cargarDatosRelacionados = async () => {
        try {
            const conc = await listarConcesionarios();
            const serv = await listarServicios();
            setConcesionarios(conc);
            setServicios(serv);
        } catch (error) {
            console.error('Error al cargar concesionarios o servicios:', error);
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Eliminar este empleado?')) {
            await eliminarEmpleado(id);
            cargarEmpleados();
        }
    };

    useEffect(() => {
        cargarEmpleados();
        cargarDatosRelacionados();
    }, []);

    return (
        <div>
            <h2>Registrar Empleado</h2>
            <form onSubmit={handleSubmit}>
                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
                <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" required />
                <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" required />
                <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" required />
                <input name="correo" value={form.correo} onChange={handleChange} placeholder="Correo" required />
                <input type="date" name="fechaContratacion" value={form.fechaContratacion} onChange={handleChange} required />
                <input name="cargo" value={form.cargo} onChange={handleChange} placeholder="Cargo" required />

                <label>Trabajo:</label>
                <select name="trabajaEn" value={form.trabajaEn} onChange={handleChange}>
                    <option value="concesionario">Concesionario</option>
                    <option value="servicio_oficial">Servicio Oficial</option>
                </select>

                {form.trabajaEn === 'concesionario' ? (
                    <select name="idConcesionario" value={form.idConcesionario} onChange={handleChange} required>
                        <option value="">Seleccione un concesionario</option>
                        {concesionarios.map(c => (
                            <option key={c.idConcesionario} value={c.idConcesionario}>
                                {c.nombre}
                            </option>
                        ))}
                    </select>
                ) : (
                    <select name="idServicio" value={form.idServicio} onChange={handleChange} required>
                        <option value="">Seleccione un servicio oficial</option>
                        {servicios.map(s => (
                            <option key={s.idServicio} value={s.idServicio}>
                                {s.nombre}
                            </option>
                        ))}
                    </select>
                )}

                <button type="submit">Registrar</button>
            </form>

            <h3>Empleados Registrados</h3>
            <table border="1" cellPadding="5" style={{ marginTop: '1rem' }}>
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Contratación</th>
                    <th>Cargo</th>
                    <th>Trabajo</th>
                    <th>Lugar de Trabajo</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {empleados.map((emp) => (
                    <tr key={emp.idEmpleado}>
                        <td>{emp.nombre}</td>
                        <td>{emp.apellido}</td>
                        <td>{emp.direccion}</td>
                        <td>{emp.telefono}</td>
                        <td>{emp.correo}</td>
                        <td>{emp.fechaContratacion}</td>
                        <td>{emp.cargo}</td>
                        <td>{emp.trabajaEn}</td>
                        <td>
                            {emp.trabajaEn === 'concesionario'
                                ? emp.nombreConcesionario || 'N/A'
                                : emp.nombreServicio || 'N/A'}
                        </td>
                        <td>
                            <Link to={`/editar-empleado/${emp.idEmpleado}`}>
                                <button>Editar</button>
                            </Link>
                            <button onClick={() => handleEliminar(emp.idEmpleado)} style={{ marginLeft: '0.5rem' }}>
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
