import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditarEquipoPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/equipos/${id}`)
            .then(res => setForm(res.data))
            .catch(() => alert("Error al cargar equipo"));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: name === "precio" ? parseFloat(value) : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/equipos/actualizar`, form);
            alert("✅ Equipo actualizado");
            navigate('/registro-equipo');
        } catch {
            alert("❌ Error al actualizar equipo");
        }
    };

    if (!form) return <p>Cargando...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Editar Equipo</h2>
            <input
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Descripción del Equipo"
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
            <button type="submit">Guardar Cambios</button>
        </form>
    );
}
