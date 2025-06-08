import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditarEmpleadoPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/empleados/${id}`)
            .then(res => setForm(res.data))
            .catch(() => alert("Error al cargar empleado"));
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/empleados/actualizar`, form);
            alert("Empleado actualizado");
            navigate('/registro-empleado');
        } catch (err) {
            alert("Error al actualizar empleado");
        }
    };

    if (!form) return <p>Cargando...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Editar Empleado</h2>
            <input name="nombre" value={form.nombre} onChange={handleChange} required />
            <input name="apellido" value={form.apellido} onChange={handleChange} required />
            <input name="direccion" value={form.direccion} onChange={handleChange} required />
            <input name="telefono" value={form.telefono} onChange={handleChange} required />
            <input name="correo" value={form.correo} onChange={handleChange} required />
            <input type="date" name="fechaContratacion" value={form.fechaContratacion} onChange={handleChange} required />
            <input name="cargo" value={form.cargo} onChange={handleChange} required />
            <select name="trabajaEn" value={form.trabajaEn} onChange={handleChange}>
                <option value="concesionario">Concesionario</option>
                <option value="servicio_oficial">Servicio Oficial</option>
            </select>
            {form.trabajaEn === 'concesionario' ? (
                <input name="idConcesionario" value={form.idConcesionario} onChange={handleChange} />
            ) : (
                <input name="idServicio" value={form.idServicio} onChange={handleChange} />
            )}
            <button type="submit">Guardar Cambios</button>
        </form>
    );
}
