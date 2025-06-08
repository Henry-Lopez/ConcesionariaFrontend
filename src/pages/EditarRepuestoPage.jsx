import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditarRepuestoPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/repuestos/${id}`)
            .then(res => setForm(res.data))
            .catch(() => alert("Error al cargar repuesto"));
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/repuestos/actualizar/${id}`, form);
            alert("Repuesto actualizado");
            navigate('/registro-repuesto');
        } catch (err) {
            alert("Error al actualizar repuesto");
        }
    };

    if (!form) return <p>Cargando...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Editar Repuesto</h2>
            <input name="descripcion" value={form.descripcion} onChange={handleChange} required />
            <input name="precioUnidad" type="number" value={form.precioUnidad} onChange={handleChange} required />
            <button type="submit">Guardar Cambios</button>
        </form>
    );
}
