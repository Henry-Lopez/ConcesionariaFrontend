import { useEffect, useState }            from 'react';
import { useParams, useNavigate }         from 'react-router-dom';

import {
    registrarBanco, listarBancos, eliminarBanco
}                                         from '../api/bancoService';
import {
    listarFinanciamientos,
    listarFinanciamientosDisponibles
}                                         from '../api/financiamientoService';

export default function BancoForm () {

    /* ── 1. parámetro opcional ──────────────────────────── */
    const { idVenta } = useParams();               // /banco/:idVenta (opcional)
    const nav         = useNavigate();

    /* ── 2. state ───────────────────────────────────────── */
    const [form,   setForm]   = useState({
        nombre:'', numeroCuenta:'', idFinanciamiento:''
    });
    const [bancos,      setBancos]      = useState([]);
    const [finDisp,     setFinDisp]     = useState([]);   // sin banco
    const soloLectura = Boolean(idVenta);

    /* ── 3. helpers ─────────────────────────────────────── */
    const onChange = ({target:{name,value}}) =>
        setForm(f => ({...f,[name]:value}));

    const reset = ()=> setForm({ nombre:'', numeroCuenta:'', idFinanciamiento:'' });

    const submit = async e => {
        e.preventDefault();
        await registrarBanco({
            ...form,
            idFinanciamiento: Number(form.idFinanciamiento)
        });
        reset();
        cargarBancos();
        cargarFinanciamientos();
    };

    const borrar = async id => {
        if(window.confirm('¿Eliminar banco?')){
            await eliminarBanco(id);
            cargarBancos();
            cargarFinanciamientos();
        }
    };

    /* ── 4. cargas ──────────────────────────────────────── */
    const cargarBancos = async () => setBancos(await listarBancos());

    const cargarFinanciamientos = async () => {
        /* disponibles  = los que no tienen banco aún */
        const disponibles = await listarFinanciamientosDisponibles();
        setFinDisp(disponibles);

        if (idVenta){           // si venimos encadenados desde Financiamiento
            const todos = await listarFinanciamientos();        // con /banco/:idVenta
            const finSel = todos.find(f => f.idVenta === Number(idVenta));
            if (finSel){
                setForm(f=>({...f, idFinanciamiento: finSel.idFinanciamiento }));
            } else {
                alert('⚠️ No se encontró financiamiento para esa venta');
            }
        }
    };

    useEffect(() => { cargarBancos(); cargarFinanciamientos(); }, []);

    /* ── 5. UI ──────────────────────────────────────────── */
    return (
        <div>
            <h2>Registrar Banco</h2>

            <form onSubmit={submit} style={{maxWidth:'420px'}}>
                <input name="nombre"       placeholder="Nombre banco"
                       value={form.nombre}       onChange={onChange} required />

                <input name="numeroCuenta" placeholder="N° cuenta"
                       value={form.numeroCuenta} onChange={onChange} required />

                {soloLectura ? (
                    /* fijo y sin editar */
                    <input value={form.idFinanciamiento} disabled readOnly />
                ) : (
                    <select name="idFinanciamiento"
                            value={form.idFinanciamiento}
                            onChange={onChange} required>
                        <option value="">Selecciona financiamiento</option>
                        {finDisp.map(f => (
                            <option key={f.idFinanciamiento} value={f.idFinanciamiento}>
                                #{f.idFinanciamiento} – Venta {f.idVenta}
                            </option>
                        ))}
                    </select>
                )}

                <button type="submit">Registrar</button>
            </form>

            <h3 style={{marginTop:'2rem'}}>Bancos Registrados</h3>
            <table border="1" cellPadding="5">
                <thead>
                <tr><th>ID</th><th>Nombre</th><th>Cuenta</th><th>Financ.</th><th/></tr>
                </thead>
                <tbody>
                {bancos.map(b => (
                    <tr key={b.idBanco}>
                        <td>{b.idBanco}</td>
                        <td>{b.nombre}</td>
                        <td>{b.numeroCuenta}</td>
                        <td>{b.idFinanciamiento}</td>
                        <td>
                            <button onClick={()=>nav(`/editar-banco/${b.idBanco}`)}>Editar</button>{' '}
                            <button onClick={()=>borrar(b.idBanco)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
