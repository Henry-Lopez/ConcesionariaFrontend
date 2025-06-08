import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditarConcesionarioPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/concesionarios/${id}`)
            .then(res => setForm(res.data))
            .catch(() => alert("Error al cargar concesionario"));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/concesionarios/actualizar`, form);
            alert("Concesionario actualizado");
            navigate('/registro-concesionario');
        } catch {
            alert("Error al actualizar concesionario");
        }
    };

    if (!form) return <p>Cargando...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Editar Concesionario</h2>
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
            <button type="submit">Guardar Cambios</button>
        </form>
    );
}
