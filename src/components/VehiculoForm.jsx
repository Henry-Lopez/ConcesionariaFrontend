/*  src/components/VehiculoForm.jsx  */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    registrarVehiculo,
    listarVehiculos,
    eliminarVehiculo,
} from '../api/VehiculoService';
import { listarModelos } from '../api/ModeloService';
import { listarConcesionarios } from '../api/concesionarioService';
import { listarServicios } from '../api/servicioOficialService';

export default function VehiculoForm() {
    /* ────────────────────────────────────
       STATE
    ──────────────────────────────────── */
    const [form, setForm] = useState({
        nroChasis: '',
        idModelo: '',
        color: '',
        anio: '',
        precio: '',
        estado: '',
        enStock: true,
        ubicacion: 'concesionario',
        idConcesionario: '',
        idServicio: '',
    });

    const [vehiculos,      setVehiculos]      = useState([]);
    const [modelos,        setModelos]        = useState([]);
    const [concesionarios, setConces]         = useState([]);
    const [servicios,      setServicios]      = useState([]);
    const [msgPrecio,      setMsgPrecio]      = useState('');

    const navigate = useNavigate();

    /* ────────────────────────────────────
       HELPERS
    ──────────────────────────────────── */
    const normalizeNumber = (txt) =>
        Number(String(txt).replace(/[ ,.]/g, '')) || 0;

    /* ────────────────────────────────────
       HANDLERS
    ──────────────────────────────────── */
    const handleChange = ({ target }) => {
        const { name, value, type, checked } = target;
        setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleModeloChange = ({ target }) => {
        const seleccionado = parseInt(target.value, 10);
        const modeloObj     = modelos.find((m) => m.idModelo === seleccionado);

        if (modeloObj) {
            const precio     = normalizeNumber(modeloObj.precioBase);
            const descuento  = normalizeNumber(modeloObj.descuento);
            const final      = Math.max(precio - descuento, 0);

            setForm((f) => ({ ...f, idModelo: seleccionado, precio: final }));
            setMsgPrecio(`💸 Precio con descuento aplicado (-${descuento})`);
        } else {
            setForm((f) => ({ ...f, idModelo: '', precio: '' }));
            setMsgPrecio('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const datos = {
            ...form,
            idModelo:       parseInt(form.idModelo, 10),
            anio:           parseInt(form.anio, 10),
            precio:         parseFloat(form.precio),
            idConcesionario: form.ubicacion === 'concesionario'
                ? parseInt(form.idConcesionario, 10)
                : null,
            idServicio: form.ubicacion === 'servicio_oficial'
                ? parseInt(form.idServicio, 10)
                : null,
        };

        if (
            isNaN(datos.anio) ||
            datos.anio < 1900 ||
            datos.anio > new Date().getFullYear() + 1
        ) {
            alert('⚠️ El año debe estar entre 1900 y el año actual + 1');
            return;
        }

        try {
            await registrarVehiculo(datos);
            setForm({
                nroChasis: '',
                idModelo: '',
                color: '',
                anio: '',
                precio: '',
                estado: '',
                enStock: true,
                ubicacion: 'concesionario',
                idConcesionario: '',
                idServicio: '',
            });
            setMsgPrecio('');
            cargarVehiculos();
        } catch (e) {
            alert('❌ Error al guardar el vehículo');
            console.error(e);
        }
    };

    const handleEliminar = async (nroChasis) => {
        if (window.confirm('¿Seguro de eliminar este vehículo?')) {
            await eliminarVehiculo(nroChasis);
            cargarVehiculos();
        }
    };

    /* ────────────────────────────────────
       LOADERS
    ──────────────────────────────────── */
    const cargarVehiculos = async () => {
        try {
            setVehiculos(await listarVehiculos());
        } catch (e) {
            console.error('Error al cargar vehículos:', e);
        }
    };

    const cargarModelos = async () => {
        try {
            setModelos(await listarModelos());
        } catch (e) {
            console.error('Error al cargar modelos:', e);
        }
    };

    const cargarEntidades = async () => {
        try {
            setConces(await listarConcesionarios());
            setServicios(await listarServicios());
        } catch (e) {
            console.error('Error al cargar concesionarios / servicios:', e);
        }
    };

    useEffect(() => {
        cargarVehiculos();
        cargarModelos();
        cargarEntidades();
    }, []);

    /* ────────────────────────────────────
       UI
    ──────────────────────────────────── */
    return (
        <div>
            <h2>Registrar Vehículo</h2>

            <form onSubmit={handleSubmit}>
                {/* CHASIS */}
                <input
                    name="nroChasis"
                    value={form.nroChasis}
                    onChange={handleChange}
                    placeholder="Nro Chasis"
                    required
                />

                {/* MODELO */}
                <select
                    name="idModelo"
                    value={form.idModelo}
                    onChange={handleModeloChange}
                    required
                >
                    <option value="">Seleccionar modelo</option>
                    {modelos.map((m) => (
                        <option key={m.idModelo} value={m.idModelo}>
                            {m.nombreModelo}
                        </option>
                    ))}
                </select>

                {/* BÁSICOS */}
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
                {msgPrecio && <p style={{ color: 'green' }}>{msgPrecio}</p>}

                <input
                    name="estado"
                    value={form.estado}
                    onChange={handleChange}
                    placeholder="Estado"
                    required
                />

                {/* STOCK & UBICACIÓN */}
                <label>
                    <input
                        type="checkbox"
                        name="enStock"
                        checked={form.enStock}
                        onChange={handleChange}
                    />
                    En stock
                </label>

                <select name="ubicacion" value={form.ubicacion} onChange={handleChange}>
                    <option value="concesionario">Concesionario</option>
                    <option value="servicio_oficial">Servicio Oficial</option>
                </select>

                {/* CONCESIONARIO o SERVICIO */}
                {form.ubicacion === 'concesionario' ? (
                    <select
                        name="idConcesionario"
                        value={form.idConcesionario}
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
                        value={form.idServicio}
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

                <button type="submit">Registrar</button>
            </form>

            {/* LISTA */}
            <h3>Vehículos Registrados</h3>
            <table border="1" cellPadding="5" style={{ marginTop: '1rem' }}>
                <thead>
                <tr>
                    <th>Chasis</th>
                    <th>Modelo</th>
                    <th>Color</th>
                    <th>Año</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>En Stock</th>
                    <th>Ubicación</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {vehiculos.map((v) => {
                    /* ========== Nombres relacionados ========== */
                    const nomModelo =
                        modelos.find((m) => m.idModelo === v.idModelo)?.nombreModelo ||
                        v.idModelo;

                    const nomConces =
                        concesionarios.find((c) => c.idConcesionario === v.idConcesionario)
                            ?.nombre || '';

                    const nomServicio =
                        servicios.find((s) => s.idServicio === v.idServicio)?.nombre ||
                        '';

                    const ubicacionTxt = v.idConcesionario
                        ? `Concesionario (${nomConces || v.idConcesionario})`
                        : `Servicio (${nomServicio || v.idServicio})`;

                    return (
                        <tr key={v.nroChasis}>
                            <td>{v.nroChasis}</td>
                            <td>{nomModelo}</td>
                            <td>{v.color}</td>
                            <td>{v.anio}</td>
                            <td>{v.precio}</td>
                            <td>{v.estado}</td>
                            <td>{v.enStock ? 'Sí' : 'No'}</td>
                            <td>{ubicacionTxt}</td>
                            <td>
                                <button
                                    onClick={() => navigate(`/editar-vehiculo/${v.nroChasis}`)}
                                >
                                    Editar
                                </button>
                                <button onClick={() => handleEliminar(v.nroChasis)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}
