/*  src/pages/EditarVehiculoPage.jsx  */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditarVehiculoPage() {
    const { nroChasis } = useParams();
    const navigate      = useNavigate();

    const [form, setForm]                 = useState(null);
    const [modelos, setModelos]           = useState([]);
    const [concesionarios, setConces]     = useState([]);
    const [servicios, setServicios]       = useState([]);

    /* ────────────────────────────────────
       CARGAS INICIALES
    ──────────────────────────────────── */
    useEffect(() => {
        const load = async () => {
            try {
                // vehiculo + tablas auxiliares
                const [vehRes, modRes, concRes, servRes] = await Promise.all([
                    axios.get(`http://localhost:8080/api/vehiculos/${nroChasis}`),
                    axios.get(`http://localhost:8080/api/modelos/listar`),
                    axios.get(`http://localhost:8080/api/concesionarios/listar`),
                    axios.get(`http://localhost:8080/api/servicios/listar`),
                ]);

                setForm(vehRes.data);
                setModelos(modRes.data);
                setConces(concRes.data);
                setServicios(servRes.data);
            } catch (e) {
                console.error(e);
                alert('Error al cargar datos');
                navigate('/registro-vehiculo');
            }
        };
        load();
    }, [nroChasis, navigate]);

    /* ────────────────────────────────────
       HANDLERS
    ──────────────────────────────────── */
    const handleChange = ({ target }) => {
        const { name, type, value, checked } = target;
        setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:8080/api/vehiculos/actualizar/${nroChasis}`,
                form
            );
            alert('Vehículo actualizado');
            navigate('/registro-vehiculo');
        } catch (e) {
            alert('Error al actualizar vehículo');
            console.error(e);
        }
    };

    /* ────────────────────────────────────
       RENDER
    ──────────────────────────────────── */
    if (!form) return <p>Cargando...</p>;

    // nombre del modelo solo para mostrar
    const nombreModelo =
        modelos.find((m) => m.idModelo === form.idModelo)?.nombreModelo ||
        form.idModelo;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Editar Vehículo</h2>

            {/* ========= CAMPOS =========== */}
            <label>
                Modelo (no editable):
                <input value={nombreModelo} disabled style={{ width: '100%' }} />
            </label>

            <input
                name="color"
                value={form.color}
                onChange={handleChange}
                placeholder="Color"
                required
            />

            <input
                name="anio"
                type="number"
                value={form.anio}
                onChange={handleChange}
                placeholder="Año"
                required
            />

            <input
                name="precio"
                type="number"
                value={form.precio}
                onChange={handleChange}
                placeholder="Precio"
                required
            />

            <input
                name="estado"
                value={form.estado}
                onChange={handleChange}
                placeholder="Estado"
                required
            />

            <label>
                En stock:
                <input
                    type="checkbox"
                    name="enStock"
                    checked={form.enStock}
                    onChange={handleChange}
                />
            </label>

            {/* UBICACIÓN */}
            <select name="ubicacion" value={form.ubicacion} onChange={handleChange}>
                <option value="concesionario">Concesionario</option>
                <option value="servicio_oficial">Servicio Oficial</option>
            </select>

            {/* CONCESIONARIO / SERVICIO DESPLEGABLES */}
            {form.ubicacion === 'concesionario' ? (
                <select
                    name="idConcesionario"
                    value={form.idConcesionario || ''}
                    onChange={handleChange}
                    required
                >
                    <option value="">Seleccionar concesionario</option>
                    {concesionarios.map((c) => (
                        <option key={c.idConcesionario} value={c.idConcesionario}>
                            {c.nombre}
                        </option>
                    ))}
                </select>
            ) : (
                <select
                    name="idServicio"
                    value={form.idServicio || ''}
                    onChange={handleChange}
                    required
                >
                    <option value="">Seleccionar servicio oficial</option>
                    {servicios.map((s) => (
                        <option key={s.idServicio} value={s.idServicio}>
                            {s.nombre}
                        </option>
                    ))}
                </select>
            )}

            <button type="submit">Guardar Cambios</button>
        </form>
    );
}
