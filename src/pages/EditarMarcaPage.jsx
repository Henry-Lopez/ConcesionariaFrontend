import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditarMarcaPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/marcas/${id}`)
            .then(res => setForm(res.data))
            .catch(() => alert("Error al cargar marca"));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/marcas/actualizar`, form);
            alert("Marca actualizada");
            navigate('/registro-marca');
        } catch {
            alert("Error al actualizar marca");
        }
    };

    if (!form) return <p>Cargando...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Editar Marca</h2>
            <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre de Marca"
                required
            />
            <button type="submit">Guardar Cambios</button>
        </form>
    );
}
