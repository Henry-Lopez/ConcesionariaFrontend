// src/pages/EditarServicioOficialPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    obtenerServicioPorId,
    actualizarServicio
} from '../api/servicioOficialService';
import { listarConcesionarios } from '../api/concesionarioService';

export default function EditarServicioOficialPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [concesionarios, setConcesionarios] = useState([]);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const servicio = await obtenerServicioPorId(id);
                setForm(servicio);
                setConcesionarios(await listarConcesionarios());
            } catch (err) {
                alert("⛔ Error al cargar datos del servicio oficial");
            }
        };
        cargarDatos();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await actualizarServicio(form);
            alert("✅ Servicio actualizado correctamente");
            navigate('/registro-servicio');
        } catch (err) {
            alert("⛔ Error al actualizar servicio oficial");
        }
    };

    if (!form) return <p>Cargando...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Editar Servicio Oficial</h2>
            <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Nombre" />
            <input name="domicilio" value={form.domicilio} onChange={handleChange} required placeholder="Domicilio" />
            <input name="nit" value={form.nit} onChange={handleChange} required placeholder="NIT" />
            <select name="idConcesionario" value={form.idConcesionario} onChange={handleChange} required>
                <option value="">Seleccionar concesionario</option>
                {concesionarios.map(c => (
                    <option key={c.idConcesionario} value={c.idConcesionario}>
                        {c.nombre}
                    </option>
                ))}
            </select>
            <button type="submit">Guardar Cambios</button>
        </form>
    );
}
