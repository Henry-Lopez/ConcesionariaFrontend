import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    registrarReparacion,
    actualizarReparacion,
    listarReparaciones,
    eliminarReparacion,
} from '../api/ReparacionService';
import { listarRepuestos } from '../api/RepuestoService';
import { listarMecanicos } from '../api/mecanicoService';
import { listarVehiculos } from '../api/VehiculoService';
import { listarClientes } from '../api/ClienteService';

export default function ReparacionForm() {
    const [form, setForm] = useState({
        idCliente: '',
        nroChasis: '',
        descripcion: '',
        diagnostico: '',
        garantia: '',
        fechaEntrada: '',
        horaEntrada: '',
        idRepuestos: [],
        idMecanicos: [],
        manoObra: [],
    });

    const [editId, setEditId] = useState(null);
    const [reparaciones, setReparaciones] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [repuestos, setRepuestos] = useState([]);
    const [mecanicos, setMecanicos] = useState([]);
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState('');
    const navigate = useNavigate();

    const resetForm = () =>
        setForm({
            idCliente: '',
            nroChasis: '',
            descripcion: '',
            diagnostico: '',
            garantia: '',
            fechaEntrada: '',
            horaEntrada: '',
            idRepuestos: [],
            idMecanicos: [],
            manoObra: [],
        });

    const mapIdsToNames = (ids, pool, idKey, labelFn) =>
        ids.map((id) => pool.find((x) => x[idKey] === id))
            .filter(Boolean)
            .map(labelFn)
            .join(', ');

    const loadData = async () => {
        try {
            setClientes(await listarClientes());
            setVehiculos(await listarVehiculos());
            setRepuestos(await listarRepuestos());
            setMecanicos(await listarMecanicos());
            setReparaciones(await listarReparaciones());
        } catch (e) {
            console.error('Error de carga inicial', e);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onChange = ({ target }) => {
        const { name, value, type, selectedOptions } = target;

        if (type === 'select-multiple') {
            const ids = Array.from(selectedOptions, (o) => parseInt(o.value));
            if (name === 'idMecanicos') {
                const updated = ids.map((id) => {
                    const existing = form.manoObra.find((m) => m.idMecanico === id);
                    return existing || { idMecanico: id, horasTrabajadas: '', costoHora: '' };
                });
                setForm((f) => ({ ...f, idMecanicos: ids, manoObra: updated }));
            } else {
                setForm((f) => ({ ...f, [name]: ids }));
            }
        } else {
            setForm((f) => ({ ...f, [name]: value }));
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg('');
        setErr('');

        const now = new Date();
        const hoy = now.toISOString().slice(0, 10);
        const hora = now.toTimeString().slice(0, 5);

        const payload = {
            ...form,
            fechaEntrada: form.fechaEntrada || hoy,
            horaEntrada: form.horaEntrada || hora,
            manoObraJson: JSON.stringify(form.manoObra),
        };

        try {
            if (editId === null) {
                await registrarReparacion(payload);
                setMsg('✅ Reparación registrada');
            } else {
                await actualizarReparacion(editId, payload);
                setMsg('✅ Reparación actualizada');
                setEditId(null);
            }
            resetForm();
            setReparaciones(await listarReparaciones());
        } catch (e) {
            console.error(e);
            setErr('⛔ Error al procesar la reparación');
        }
    };

    const startEdit = (rep) => {
        setEditId(rep.idReparacion);
        setForm({
            idCliente: rep.idCliente,
            nroChasis: rep.nroChasis,
            descripcion: rep.descripcion,
            diagnostico: rep.diagnostico || '',
            garantia: rep.garantia || '',
            fechaEntrada: rep.fechaEntrada,
            horaEntrada: rep.horaEntrada,
            idRepuestos: rep.idRepuestos || [],
            idMecanicos: rep.idMecanicos || [],
            manoObra: rep.manoObra || [],
        });
    };

    const remove = async (id) => {
        if (window.confirm('¿Eliminar esta reparación?')) {
            await eliminarReparacion(id);
            setReparaciones(await listarReparaciones());
        }
    };

    return (
        <div>
            <h2>{editId ? 'Editar Reparación' : 'Registrar Reparación'}</h2>

            <form onSubmit={onSubmit}>
                <select name="idCliente" value={form.idCliente} onChange={onChange} required>
                    <option value="">Seleccionar cliente</option>
                    {clientes.map((c) => (
                        <option key={c.idCliente} value={c.idCliente}>
                            {c.nombre} {c.apellido}
                        </option>
                    ))}
                </select>

                <select name="nroChasis" value={form.nroChasis} onChange={onChange} required>
                    <option value="">Número de chasis</option>
                    {vehiculos.map((v) => (
                        <option key={v.nroChasis} value={v.nroChasis}>
                            {v.nroChasis} – {v.color} ({v.anio})
                        </option>
                    ))}
                </select>

                <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={onChange} required />
                <input name="diagnostico" placeholder="Diagnóstico" value={form.diagnostico} onChange={onChange} />
                <input name="garantia" placeholder="Garantía (ej: 3 meses)" value={form.garantia} onChange={onChange} />
                <input name="fechaEntrada" type="date" value={form.fechaEntrada} onChange={onChange} />
                <input name="horaEntrada" type="time" value={form.horaEntrada} onChange={onChange} />

                <label>Repuestos:</label>
                <select multiple name="idRepuestos" value={form.idRepuestos} onChange={onChange}>
                    {repuestos.map((r) => (
                        <option key={r.idRepuesto} value={r.idRepuesto}>{r.descripcion}</option>
                    ))}
                </select>

                <label>Mecánicos:</label>
                <select multiple name="idMecanicos" value={form.idMecanicos} onChange={onChange}>
                    {mecanicos.map((m) => (
                        <option key={m.idMecanico} value={m.idMecanico}>{m.nombre} {m.apellido}</option>
                    ))}
                </select>

                {form.manoObra.length > 0 && (
                    <table border="1" cellPadding="5">
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
                                        <input type="number" step="0.1" value={m.horasTrabajadas} onChange={(e) => {
                                            const value = e.target.value;
                                            setForm((f) => {
                                                const clone = [...f.manoObra];
                                                clone[i].horasTrabajadas = value;
                                                return { ...f, manoObra: clone };
                                            });
                                        }} />
                                    </td>
                                    <td>
                                        <input type="number" step="0.1" value={m.costoHora} onChange={(e) => {
                                            const value = e.target.value;
                                            setForm((f) => {
                                                const clone = [...f.manoObra];
                                                clone[i].costoHora = value;
                                                return { ...f, manoObra: clone };
                                            });
                                        }} />
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}

                <button type="submit">{editId ? 'Actualizar' : 'Registrar'}</button>
            </form>

            {msg && <p style={{ color: 'green' }}>{msg}</p>}
            {err && <p style={{ color: 'red' }}>{err}</p>}

            <h3>Reparaciones Registradas</h3>
            <table border="1" cellPadding="5" style={{ marginTop: '1rem' }}>
                <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Vehículo</th>
                    <th>Descripción</th>
                    <th>Diagnóstico</th>
                    <th>Garantía</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Repuestos</th>
                    <th>Mecánicos</th>
                    <th>Mano de Obra</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {reparaciones.map((r) => (
                    <tr key={r.idReparacion}>
                        <td>{mapIdsToNames([r.idCliente], clientes, 'idCliente', (c) => `${c.nombre} ${c.apellido}`)}</td>
                        <td>{r.nroChasis}</td>
                        <td>{r.descripcion}</td>
                        <td>{r.diagnostico}</td>
                        <td>{r.garantia}</td>
                        <td>{r.fechaEntrada}</td>
                        <td>{r.horaEntrada}</td>
                        <td>{mapIdsToNames(r.idRepuestos || [], repuestos, 'idRepuesto', (rep) => rep.descripcion)}</td>
                        <td>{mapIdsToNames(r.idMecanicos || [], mecanicos, 'idMecanico', (m) => `${m.nombre} ${m.apellido}`)}</td>
                        <td>
                            <ul style={{ paddingLeft: '1rem' }}>
                                {(r.manoObra || []).map((m, i) => {
                                    const mec = mecanicos.find((me) => me.idMecanico === m.idMecanico);
                                    const nombre = mec ? `${mec.nombre} ${mec.apellido}` : `Mecánico ${m.idMecanico}`;
                                    const horas = m.horasTrabajadas || 0;
                                    const costo = m.costoHora || 0;
                                    return (
                                        <li key={i}>
                                            {nombre} → {horas}h × Bs.{costo} = Bs.{(horas * costo).toFixed(2)}
                                        </li>
                                    );
                                })}
                                <li style={{ fontWeight: 'bold' }}>
                                    Total Mano Obra: Bs.{' '}
                                    {r.manoObra
                                        ? r.manoObra.reduce((acc, m) => acc + m.horasTrabajadas * m.costoHora, 0).toFixed(2)
                                        : '0.00'}
                                </li>
                            </ul>
                        </td>
                        <td>
                            <button onClick={() => startEdit(r)}>Editar</button>
                            <button onClick={() => remove(r.idReparacion)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
