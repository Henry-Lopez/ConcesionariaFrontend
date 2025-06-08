import { useEffect, useMemo, useState } from 'react';
import { useNavigate }                  from 'react-router-dom';

import {
    registrarVenta, listarVentas, actualizarVenta, eliminarVenta,
} from '../api/VentaService';
import { listarModelos } from '../api/ModeloService';
import axios from 'axios';

const API_URL = 'http://localhost:8080';

export default function VentaForm() {
    const nav = useNavigate();

    /* ═════════════ STATE “vacío” ═════════════ */
    const hoyISO = new Date().toISOString().slice(0, 10);

    const inicial = {
        idCliente: '', idEmpleado: '', nroChasis: '',
        formaPago: 'contado', cuotas: 1, precioTotal: '',
        fechaVenta: hoyISO,   fechaEntrega: hoyISO,
        matricula: '',        esStock: true, origen: 'stock',
    };

    const [venta, setVenta]           = useState(inicial);
    const [extras, setExtras]         = useState([]);   // check-boxes elegidos
    const [equipos, setEquipos]       = useState([]);
    const [ventas, setVentas]         = useState([]);
    const [clientes, setClientes]     = useState([]);
    const [empleados, setEmpleados]   = useState([]);
    const [vehiculos, setVehiculos]   = useState([]);
    const [modelos, setModelos]       = useState([]);
    const [editId, setEditId]         = useState(null);

    /* ═════════════ PRECIOS en memoria ═════════════ */
    const vehiculoSel = useMemo(
        () => vehiculos.find(v => v.nroChasis === venta.nroChasis),
        [vehiculos, venta.nroChasis],
    );

    const precioExtras = useMemo(
        () => extras.reduce(
            (sum, id) => sum + (equipos.find(e => e.idEquipo === id)?.precio || 0), 0),
        [extras, equipos],
    );

    const precioBase = useMemo(() => {
        if (!vehiculoSel) return 0;
        const m   = modelos.find(x => x.idModelo === vehiculoSel.idModelo);
        const dto = Number(m?.descuento || 0);
        return Number(vehiculoSel.precio) - dto;
    }, [vehiculoSel, modelos]);

    useEffect(() => {
        setVenta(v => ({ ...v, precioTotal: (precioBase + precioExtras).toFixed(2) }));
    }, [precioBase, precioExtras]);

    /* ═════════════ Helper para mostrar extras ═════════════ */
    const getExtrasDesc = (ids = []) =>
        ids.length === 0
            ? 'Sin extras'
            : ids
                .map(id => equipos.find(e => e.idEquipo === id)?.descripcion ?? id)
                .join(', ');

    /* ═════════════ HANDLERS UI ═════════════ */
    const onChange = e => {
        const { name, value, type, checked } = e.target;
        setVenta(v => ({ ...v, [name]: type === 'checkbox' ? checked : value }));
    };

    const onVehiculo = e => {
        const chasis = e.target.value;
        const veh    = vehiculos.find(v => v.nroChasis === chasis);
        setVenta(v => ({
            ...v,
            nroChasis: chasis,
            matricula: chasis,
            esStock  : veh?.enStock ?? true,
            origen   : veh?.enStock ? 'stock' : 'fábrica',
        }));
    };

    const toggleExtra = id =>
        setExtras(xs => (xs.includes(id) ? xs.filter(x => x !== id) : [...xs, id]));

    /* ═════════════ SUBMIT ═════════════ */
    const handleSubmit = async e => {
        e.preventDefault();
        const dto = {
            ...venta,
            idCliente  : Number(venta.idCliente),
            idEmpleado : Number(venta.idEmpleado),
            cuotas     : Number(venta.cuotas),
            precioTotal: Number(venta.precioTotal),
            idExtras   : extras.map(Number),
        };
        try {
            if (editId) {
                await actualizarVenta(dto);
                setEditId(null);
            } else {
                await registrarVenta(dto);
            }
            reset();
            cargarVentas();
        } catch (err) {
            console.error(err);
            alert('Error al guardar venta');
        }
    };

    const reset  = () => { setVenta(inicial); setExtras([]); };
    const edit   = v => nav(`/editar-venta/${v.idVenta}`);
    const remove = async id => {
        if (window.confirm('¿Eliminar venta?')) {
            await eliminarVenta(id);
            cargarVentas();
        }
    };

    /* ═════════════ CARGAS iniciales ═════════════ */
    const cargarVentas    = async () => setVentas(await listarVentas());
    const cargarEquipos   = async () => setEquipos((await axios.get(`${API_URL}/api/equipos/listar`)).data);
    const cargarClientes  = async () => setClientes((await axios.get(`${API_URL}/api/clientes/listar`)).data);
    const cargarEmpleados = async () => setEmpleados((await axios.get(`${API_URL}/api/empleados/listar`)).data);
    const cargarVehiculos = async () => setVehiculos((await axios.get(`${API_URL}/api/vehiculos/disponibles`)).data);
    const cargarModelos   = async () => setModelos(await listarModelos());

    useEffect(() => {
        cargarVentas();
        cargarClientes();
        cargarEmpleados();
        cargarVehiculos();
        cargarEquipos();
        cargarModelos();
    }, []);

    /* ═════════════ RENDER ═════════════ */
    return (
        <div>
            <h2>{editId ? 'Editar Venta' : 'Registrar Venta'}</h2>

            {/* ─────────────── FORMULARIO COMPLETO ─────────────── */}
            <form onSubmit={handleSubmit}>
                {/* Cliente */}
                <select name="idCliente" value={venta.idCliente} onChange={onChange} required>
                    <option value="">Selecciona cliente</option>
                    {clientes.map(c => (
                        <option key={c.idCliente} value={c.idCliente}>
                            {c.nombre} {c.apellido}
                        </option>
                    ))}
                </select>

                {/* Empleado */}
                <select name="idEmpleado" value={venta.idEmpleado} onChange={onChange} required>
                    <option value="">Selecciona empleado</option>
                    {empleados.map(e => (
                        <option key={e.idEmpleado} value={e.idEmpleado}>
                            {e.nombre} {e.apellido}
                        </option>
                    ))}
                </select>

                {/* Vehículo */}
                <select name="nroChasis" value={venta.nroChasis} onChange={onVehiculo} required>
                    <option value="">Selecciona vehículo</option>
                    {vehiculos.map(v => (
                        <option key={v.nroChasis} value={v.nroChasis}>
                            {v.nroChasis} – {v.modelo} – {v.color}
                        </option>
                    ))}
                </select>

                {/* Pago / cuotas */}
                <select name="formaPago" value={venta.formaPago} onChange={onChange}>
                    <option value="contado">Contado</option>
                    <option value="financiera">Financiera</option>
                </select>

                <input
                    name="cuotas"
                    type="number"
                    min="1"
                    value={venta.cuotas}
                    onChange={onChange}
                    placeholder="Cuotas"
                    required
                />

                {/* Precio total */}
                <input
                    name="precioTotal"
                    type="number"
                    step="0.01"
                    value={venta.precioTotal}
                    onChange={onChange}
                    placeholder="Precio Total"
                    required
                />

                {/* Fechas */}
                <input
                    name="fechaVenta"
                    type="date"
                    value={venta.fechaVenta}
                    onChange={onChange}
                    placeholder="Fecha venta"
                    required
                />
                <input
                    name="fechaEntrega"
                    type="date"
                    value={venta.fechaEntrega}
                    onChange={onChange}
                    placeholder="Fecha entrega"
                    required
                />

                {/* Matrícula */}
                <input
                    name="matricula"
                    value={venta.matricula}
                    onChange={onChange}
                    placeholder="Matrícula"
                />

                {/* Stock / Origen */}
                <label>
                    ¿Es stock?
                    <input
                        type="checkbox"
                        name="esStock"
                        checked={venta.esStock}
                        onChange={onChange}
                    />
                </label>

                <select name="origen" value={venta.origen} onChange={onChange}>
                    <option value="stock">Stock</option>
                    <option value="fábrica">Fábrica</option>
                </select>

                {/* Extras */}
                <fieldset>
                    <legend>Equipos Extra</legend>
                    {equipos.map(eq => (
                        <label key={eq.idEquipo} style={{ display: 'block' }}>
                            <input
                                type="checkbox"
                                value={eq.idEquipo}
                                checked={extras.includes(eq.idEquipo)}
                                onChange={() => toggleExtra(eq.idEquipo)}
                            />
                            {eq.descripcion} (Bs {eq.precio})
                        </label>
                    ))}
                </fieldset>

                <button type="submit">{editId ? 'Actualizar' : 'Registrar'}</button>
            </form>

            {/* ─────────────── TABLA ─────────────── */}
            <h3>Ventas Registradas</h3>
            <table border="1" cellPadding="5" style={{ marginTop: '1rem' }}>
                <thead>
                <tr>
                    <th>ID</th><th>Cliente</th><th>Empleado</th><th>Vehículo</th>
                    <th>Pago</th><th>Cuotas</th><th>Total</th><th>Venta</th>
                    <th>Entrega</th><th>Mat.</th><th>Stock</th><th>Origen</th>
                    <th>Extras</th><th />
                </tr>
                </thead>
                <tbody>
                {ventas.map(v => (
                    <tr key={v.idVenta}>
                        <td>{v.idVenta}</td>
                        <td>{clientes.find(c => c.idCliente === v.idCliente)?.nombre || v.idCliente}</td>
                        <td>{empleados.find(e => e.idEmpleado === v.idEmpleado)?.nombre || v.idEmpleado}</td>
                        <td>{v.nroChasis}</td>
                        <td>{v.formaPago}</td>
                        <td>{v.cuotas}</td>
                        <td>{v.precioTotal}</td>
                        <td>{v.fechaVenta}</td>
                        <td>{v.fechaEntrega}</td>
                        <td>{v.matricula}</td>
                        <td>{v.esStock ? 'Sí' : 'No'}</td>
                        <td>{v.origen}</td>
                        <td>{getExtrasDesc(v.idExtras)}</td>
                        <td>
                            <button onClick={() => edit(v)}>Editar</button>{' '}
                            <button onClick={() => remove(v.idVenta)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
