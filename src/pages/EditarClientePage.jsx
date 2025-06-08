import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditarClientePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/clientes/${id}`)
            .then(res => setForm(res.data))
            .catch(() => alert("Error al cargar cliente"));
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/clientes/actualizar`, form);
            alert("Cliente actualizado");
            navigate('/registro-cliente');
        } catch (err) {
            alert("Error al actualizar cliente");
        }
    };

    if (!form) return <p>Cargando...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Editar Cliente</h2>
            <input name="nombre" value={form.nombre} onChange={handleChange} required />
            <input name="apellido" value={form.apellido} onChange={handleChange} required />
            <input name="direccion" value={form.direccion} onChange={handleChange} required />
            <input name="telefono" value={form.telefono} onChange={handleChange} required />
            <input name="correo" value={form.correo} onChange={handleChange} required />
            <input type="date" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} required />
            <button type="submit">Guardar Cambios</button>
        </form>
    );
}
