/*  src/pages/EditarVentaPage.jsx  */
import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate }       from 'react-router-dom';
import axios                            from 'axios';

/* END-POINTS --------------------------------------------------------- */
const API = 'http://localhost:8080/api';


/* COMPONENT ---------------------------------------------------------- */
export default function EditarVentaPage () {
    const { id } = useParams();          // idVenta
    const nav    = useNavigate();

    /* ------------ state principal ------------------------------------ */
    const [form,        setForm]      = useState(null);
    const [extrasSel,   setExtrasSel] = useState([]);     // ← IDs marcados
    const [clientes,    setClientes]  = useState([]);
    const [empleados,   setEmpleados] = useState([]);
    const [vehiculos,   setVehiculos] = useState([]);
    const [equipos,     setEquipos]   = useState([]);
    const [modelos,     setModelos]   = useState([]);

    /* ------------ helpers de precio ---------------------------------- */
    const vehSel = useMemo(
        () => vehiculos.find(v => v.nroChasis === form?.nroChasis),
        [vehiculos, form?.nroChasis]
    );

    const precioExtras = useMemo(
        () => extrasSel.reduce(
            (s, idEq) => s + (equipos.find(e => e.idEquipo === idEq)?.precio || 0),
            0
        ),
        [extrasSel, equipos]
    );

    const precioBaseDescuento = useMemo(() => {
        if (!vehSel) return 0;
        const m   = modelos.find(x => x.idModelo === vehSel.idModelo);
        const dto = m ? Number(m.descuento || 0) : 0;
        return Number(vehSel.precio) - dto;
    }, [vehSel, modelos]);

    /* ── actualiza precio cuando cambia base o extras ── */
    useEffect(() => {
        if (!form) return;
        setForm(f => ({
            ...f,
            precioTotal: (precioBaseDescuento + precioExtras).toFixed(2)
        }));
    }, [precioBaseDescuento, precioExtras]);

    /* ------------ cargar datos --------------------------------------- */
    useEffect(() => {
        /* 1) cabecera + extras en una sola llamada */
        axios.get(`${API}/ventas/${id}`).then(r => {
            const v = r.data;
            v.fechaVenta   = v.fechaVenta?.slice(0, 10)   || '';
            v.fechaEntrega = v.fechaEntrega?.slice(0, 10) || '';
            setForm(v);
            setExtrasSel(v.idExtras ?? []);          // 👈  inicializa checks
        });

        /* 2) catálogos */
        axios.get(`${API}/clientes/listar`).then(r => setClientes(r.data));
        axios.get(`${API}/empleados/listar`).then(r => setEmpleados(r.data));
        axios.get(`${API}/vehiculos/disponibles`).then(r => setVehiculos(r.data));
        axios.get(`${API}/equipos/listar`).then(r => setEquipos(r.data));
        axios.get(`${API}/modelos/listar`).then(r => setModelos(r.data));
    }, [id]);

    /* ------------ handlers ------------------------------------------- */
    const onChange = ({ target: { name, value, type, checked } }) =>
        setForm({ ...form, [name]: type === 'checkbox' ? checked : value });

    const toggleExtra = id =>
        setExtrasSel(xs => (xs.includes(id) ? xs.filter(y => y !== id) : [...xs, id]));

    /* ------------ submit --------------------------------------------- */
    const save = async e => {
        e.preventDefault();

        await axios.put(`${API}/ventas/actualizar/${id}`, {
            ...form,
            idCliente  : Number(form.idCliente),
            idEmpleado : Number(form.idEmpleado),
            cuotas     : Number(form.cuotas),
            precioTotal: Number(form.precioTotal),
            idExtras   : extrasSel               /* 👈  viaja al backend */
        });

        alert('✅ Venta actualizada');
        nav('/registro-venta');
    };

    if (!form) return <p>Cargando venta…</p>;

    /* ------------ UI -------------------------------------------------- */
    return (
        <form onSubmit={save} style={{ maxWidth: 640 }}>
            <h2>Editar Venta</h2>

            {/* Cliente */}
            <label>Cliente:</label>
            <select name="idCliente" value={form.idCliente} onChange={onChange} required>
                <option value="">Seleccione…</option>
                {clientes.map(c => (
                    <option key={c.idCliente} value={c.idCliente}>
                        {c.nombre} {c.apellido}
                    </option>
                ))}
            </select>

            {/* Empleado */}
            <label>Empleado:</label>
            <select name="idEmpleado" value={form.idEmpleado} onChange={onChange} required>
                <option value="">Seleccione…</option>
                {empleados.map(e => (
                    <option key={e.idEmpleado} value={e.idEmpleado}>
                        {e.nombre} {e.apellido}
                    </option>
                ))}
            </select>

            {/* Vehículo */}
            <label>Vehículo:</label>
            <select name="nroChasis" value={form.nroChasis} onChange={onChange} required>
                <option value="">Seleccione…</option>
                {vehiculos.map(v => (
                    <option key={v.nroChasis} value={v.nroChasis}>
                        {v.nroChasis} – {v.modelo} – {v.color}
                    </option>
                ))}
            </select>

            {/* Pago / cuotas / precio */}
            <label>Forma de pago:</label>
            <select name="formaPago" value={form.formaPago} onChange={onChange}>
                <option value="contado">Contado</option>
                <option value="financiera">Financiera</option>
            </select>

            <input
                name="cuotas"
                type="number"
                min="1"
                value={form.cuotas}
                onChange={onChange}
                placeholder="Cuotas"
                required
            />

            <input
                name="precioTotal"
                type="number"
                step="0.01"
                value={form.precioTotal}
                onChange={onChange}
                placeholder="Precio total"
                required
            />

            {/* Fechas */}
            <label>Fecha de venta:</label>
            <input
                name="fechaVenta"
                type="date"
                value={form.fechaVenta}
                onChange={onChange}
                required
            />

            <label>Fecha de entrega:</label>
            <input
                name="fechaEntrega"
                type="date"
                value={form.fechaEntrega}
                onChange={onChange}
                required
            />

            {/* Matrícula, stock, origen */}
            <input
                name="matricula"
                value={form.matricula}
                onChange={onChange}
                placeholder="Matrícula"
                required
            />

            <label>
                ¿Es stock?
                <input type="checkbox" name="esStock" checked={form.esStock} onChange={onChange} />
            </label>

            <label>Origen:</label>
            <select name="origen" value={form.origen} onChange={onChange}>
                <option value="stock">Stock</option>
                <option value="fábrica">Fábrica</option>
            </select>

            {/* EXTRAS */}
            <fieldset style={{ marginTop: 20 }}>
                <legend>Equipos extra</legend>
                {equipos.map(eq => (
                    <label key={eq.idEquipo} style={{ display: 'block' }}>
                        <input
                            type="checkbox"
                            checked={extrasSel.includes(eq.idEquipo)}
                            onChange={() => toggleExtra(eq.idEquipo)}
                        />
                        {eq.descripcion} (Bs {eq.precio})
                    </label>
                ))}
            </fieldset>

            <button type="submit" style={{ marginTop: 20 }}>
                Guardar Cambios
            </button>
        </form>
    );
}
