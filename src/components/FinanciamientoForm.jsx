/*  src/components/FinanciamientoForm.jsx  */
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { listarVentas } from '../api/VentaService';
import {
    registrarFinanciamiento,
    listarFinanciamientos,
    actualizarFinanciamiento,
    eliminarFinanciamiento,
} from '../api/financiamientoService';

/* ───────────────────────────────────────────── */

export default function FinanciamientoForm() {
    /* 1. – origen de llamada (ruta o state) */
    const nav                 = useNavigate();
    const { idVenta: idURL }  = useParams();      // /financiamiento/:idVenta?
    const { state }           = useLocation();    // navigate(...,{state:{…}})
    const idVentaIn           = idURL ?? state?.idVenta ?? null; // numérico o null

    /* 2. – state */
    const [ventasTodas,  setVentasTodas] = useState([]);
    const [finanzas,     setFinanzas]    = useState([]);
    const [ventasDisp,   setVentasDisp]  = useState([]);
    const [editId,       setEditId]      = useState(null);

    const [fin, setFin] = useState({
        tipoFinanciamiento : '',
        entidadFinanciera  : '',
        monto              : state?.monto  ?? '',
        cuotas             : state?.cuotas ?? '',
        tasaInteres        : '',
        plazo              : '',
        idVenta            : idVentaIn     ?? '',
    });

    const soloLectura = Boolean(idVentaIn); // si viene de Venta, bloqueamos combo

    /* 3. – helpers */
    const onChange = ({ target:{ name, value }}) =>
        setFin(f => ({ ...f, [name]: value }));

    const onVentaSelect = ({ target:{ value }}) => {
        const vSel = ventasTodas.find(v => v.idVenta === Number(value));
        setFin(f => ({
            ...f,
            idVenta : value,
            monto   : vSel ? vSel.precioTotal : '',
            cuotas  : vSel ? vSel.cuotas      : '',
        }));
    };

    const reset = () => setFin({
        tipoFinanciamiento:'', entidadFinanciera:'', monto:'', cuotas:'',
        tasaInteres:'', plazo:'', idVenta: idVentaIn ?? ''
    });

    /* 4. – submit */
    const submit = async e => {
        e.preventDefault();
        const dto = {
            ...fin,
            monto       : parseFloat(fin.monto),
            cuotas      : parseInt(fin.cuotas),
            tasaInteres : parseFloat(fin.tasaInteres),
            plazo       : parseInt(fin.plazo),
            idVenta     : parseInt(fin.idVenta),
        };

        editId
            ? await actualizarFinanciamiento(dto)
            : await registrarFinanciamiento(dto);

        /* ✅ redirigimos al mismo formulario de Banco que ya existe */
        nav('/registro-banco');           // ← único cambio real
        reset();
        cargarFinanciamientos();
    };

    const editar  = f => { setFin({ ...f }); setEditId(f.idFinanciamiento); };
    const borrar  = async id => {
        if (window.confirm('¿Eliminar financiamiento?')) {
            await eliminarFinanciamiento(id);
            cargarFinanciamientos();
        }
    };

    /* 5. – cargas */
    const cargarFinanciamientos = async () =>
        setFinanzas(await listarFinanciamientos());

    const cargarVentas = async () =>
        setVentasTodas(await listarVentas());

    /* 6. – filtrar ventas disponibles */
    useEffect(() => {
        const usadas = new Set(finanzas.map(f => f.idVenta));
        setVentasDisp(ventasTodas.filter(v => !usadas.has(v.idVenta)));
    }, [ventasTodas, finanzas]);

    /* 7. – inicial */
    useEffect(() => {
        cargarFinanciamientos();
        cargarVentas();
    }, []);

    /* 8. – UI */
    return (
        <div>
            <h2>{editId ? 'Editar Financiamiento' : 'Registrar Financiamiento'}</h2>

            <form onSubmit={submit} style={{ maxWidth: 420 }}>
                <input
                    name="tipoFinanciamiento"
                    placeholder="Tipo"
                    value={fin.tipoFinanciamiento}
                    onChange={onChange}
                    required
                />
                <input
                    name="entidadFinanciera"
                    placeholder="Entidad"
                    value={fin.entidadFinanciera}
                    onChange={onChange}
                    required
                />
                <input
                    name="monto"
                    type="number"
                    step="0.01"
                    placeholder="Monto"
                    value={fin.monto}
                    onChange={onChange}
                    required
                />
                <input
                    name="cuotas"
                    type="number"
                    placeholder="Cuotas"
                    value={fin.cuotas}
                    onChange={onChange}
                    required
                />
                <input
                    name="tasaInteres"
                    type="number"
                    step="0.01"
                    placeholder="Interés (%)"
                    value={fin.tasaInteres}
                    onChange={onChange}
                    required
                />
                <input
                    name="plazo"
                    type="number"
                    placeholder="Plazo (meses)"
                    value={fin.plazo}
                    onChange={onChange}
                    required
                />

                {/* selector idVenta */}
                {soloLectura ? (
                    <input value={fin.idVenta} disabled readOnly />
                ) : (
                    <select name="idVenta" value={fin.idVenta} onChange={onVentaSelect} required>
                        <option value="">Seleccionar venta</option>
                        {ventasDisp.map(v => (
                            <option key={v.idVenta} value={v.idVenta}>
                                {v.idVenta} – {v.nroChasis}
                            </option>
                        ))}
                    </select>
                )}

                <button type="submit">{editId ? 'Actualizar' : 'Registrar'}</button>
            </form>

            {/* listado */}
            <h3 style={{ marginTop: '2rem' }}>Financiamientos Registrados</h3>
            <table border="1" cellPadding="5" style={{ width: '100%', maxWidth: 960 }}>
                <thead>
                <tr>
                    <th>ID</th><th>Tipo</th><th>Entidad</th><th>Monto</th><th>Cuotas</th>
                    <th>%</th><th>Plazo</th><th>Venta</th><th/>
                </tr>
                </thead>
                <tbody>
                {finanzas.map(f => (
                    <tr key={f.idFinanciamiento}>
                        <td>{f.idFinanciamiento}</td>
                        <td>{f.tipoFinanciamiento}</td>
                        <td>{f.entidadFinanciera}</td>
                        <td>{f.monto}</td>
                        <td>{f.cuotas}</td>
                        <td>{f.tasaInteres}</td>
                        <td>{f.plazo}</td>
                        <td>{f.idVenta}</td>
                        <td>
                            <button onClick={() => editar(f)}>Editar</button>{' '}
                            <button onClick={() => borrar(f.idFinanciamiento)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
