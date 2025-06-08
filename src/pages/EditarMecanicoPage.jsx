import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditarMecanicoPage() {
    const { idMecanico } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/mecanicos/${idMecanico}`)
            .then(res => setForm(res.data))
            .catch(() => alert("❌ Error al cargar mecánico"));
    }, [idMecanico]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/mecanicos/actualizar`, form);
            alert("✅ Mecánico actualizado");
            navigate('/registro-mecanico');
        } catch {
            alert("❌ Error al actualizar mecánico");
        }
    };

    if (!form) return <p>Cargando...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Editar Mecánico</h2>
            <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                required
            />
            <input
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                placeholder="Apellido"
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
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                required
            />
            <input
                name="especialidad"
                value={form.especialidad}
                onChange={handleChange}
                placeholder="Especialidad"
                required
            />
            <input
                name="salario"
                value={form.salario}
                onChange={handleChange}
                type="number"
                placeholder="Salario"
                required
            />
            <input
                name="fechaIngreso"
                value={form.fechaIngreso}
                onChange={handleChange}
                type="date"
                placeholder="Fecha de Ingreso"
                required
            />
            <button type="submit">Guardar Cambios</button>
        </form>
    );
}
