/* src/pages/EditarReparacionPage.jsx */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ensureArray = (v) => (Array.isArray(v) ? v : v ? v.split?.(',').map(Number) : []);
const ensureManoObra = (ids, prev = []) =>
    ids.map((id) => prev.find((m) => m.idMecanico === id) || {
        idMecanico: id,
        horasTrabajadas: '',
        costoHora: '',
    });

export default function EditarReparacionPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [clientes, setClientes] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [repuestos, setRepuestos] = useState([]);
    const [mecanicos, setMecanicos] = useState([]);

    const [form, setForm] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/reparaciones/${id}`)
            .then(({ data }) =>
                setForm({
                    ...data,
                    idRepuestos: ensureArray(data.idRepuestos),
                    idMecanicos: ensureArray(data.idMecanicos),
                    manoObra: data.manoObra || [],
                }))
            .catch(() => alert('⛔ Error al cargar reparación'));

        axios.get('http://localhost:8080/api/clientes/listar').then(({ data }) => setClientes(data));
        axios.get('http://localhost:8080/api/vehiculos/listar').then(({ data }) => setVehiculos(data));
        axios.get('http://localhost:8080/api/repuestos/listar').then(({ data }) => setRepuestos(data));
        axios.get('http://localhost:8080/api/mecanicos/listar').then(({ data }) => setMecanicos(data));
    }, [id]);

    const handleChange = ({ target }) => {
        const { name, value } = target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleListChange = ({ target }) => {
        const arr = Array.from(target.selectedOptions, (o) => Number(o.value));
        setForm((f) => ({ ...f, idRepuestos: arr }));
    };

    const handleListChangeMec = ({ target }) => {
        const arr = Array.from(target.selectedOptions, (o) => Number(o.value));
        setForm((f) => ({
            ...f,
            idMecanicos: arr,
            manoObra: ensureManoObra(arr, f.manoObra),
        }));
    };

    const handleManoObraChange = (index, field, value) => {
        const updated = [...form.manoObra];
        updated[index][field] = value;
        setForm((f) => ({ ...f, manoObra: updated }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                manoObraJson: JSON.stringify(
                    form.manoObra.filter(
                        (m) => m.horasTrabajadas !== '' && m.costoHora !== ''
                    )
                ),
            };
            await axios.put(`http://localhost:8080/api/reparaciones/actualizar/${id}`, payload);
            alert('✅ Reparación actualizada');
            navigate('/registro-reparacion');
        } catch (err) {
            console.error(err);
            alert('⛔ Error al actualizar reparación');
        }
    };

    if (!form) return <p>Cargando…</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Editar Reparación</h2>

            <select name="idCliente" value={form.idCliente} onChange={handleChange} required>
                <option value="">Seleccionar cliente</option>
                {clientes.map((c) => (
                    <option key={c.idCliente} value={c.idCliente}>
                        {c.nombre} {c.apellido}
                    </option>
                ))}
            </select>

            <select name="nroChasis" value={form.nroChasis} onChange={handleChange} required>
                <option value="">Seleccionar chasis</option>
                {vehiculos.map((v) => (
                    <option key={v.nroChasis} value={v.nroChasis}>
                        {v.nroChasis} – {v.color} / {v.anio}
                    </option>
                ))}
            </select>

            <input name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción" required />
            <input type="date" name="fechaEntrada" value={form.fechaEntrada} onChange={handleChange} required />
            <input type="time" name="horaEntrada" value={form.horaEntrada} onChange={handleChange} required />

            <label>Repuestos:</label>
            <select multiple value={form.idRepuestos} onChange={handleListChange}>
                {repuestos.map((r) => (
                    <option key={r.idRepuesto} value={r.idRepuesto}>
                        {r.descripcion}
                    </option>
                ))}
            </select>

            <label>Mecánicos:</label>
            <select multiple value={form.idMecanicos} onChange={handleListChangeMec}>
                {mecanicos.map((m) => (
                    <option key={m.idMecanico} value={m.idMecanico}>
                        {m.nombre} {m.apellido}
                    </option>
                ))}
            </select>

            {/* Campos adicionales: horas trabajadas y costo por hora */}
            {form.manoObra.length > 0 && (
                <table border="1" cellPadding="5" style={{ marginTop: '1rem' }}>
                    <thead>
                    <tr>
                        <th>Mecánico</th>
                        <th>Horas trabajadas</th>
                        <th>Costo por hora</th>
                    </tr>
                    </thead>
                    <tbody>
                    {form.manoObra.map((m, i) => {
                        const mec = mecanicos.find((me) => me.idMecanico === m.idMecanico);
                        return (
                            <tr key={m.idMecanico}>
                                <td>{mec ? `${mec.nombre} ${mec.apellido}` : m.idMecanico}</td>
                                <td>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={m.horasTrabajadas}
                                        onChange={(e) =>
                                            handleManoObraChange(i, 'horasTrabajadas', e.target.value)
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={m.costoHora}
                                        onChange={(e) =>
                                            handleManoObraChange(i, 'costoHora', e.target.value)
                                        }
                                    />
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            )}

            <button type="submit">Guardar Cambios</button>
        </form>
    );
}
