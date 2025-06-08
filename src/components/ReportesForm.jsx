// src/components/ReportesForm.jsx
import React, { useState, useEffect } from 'react';
import '../styles/reportes.css';
import { getVentasPorMes } from '../api/ReporteService'; // usa tu service

const ReportesForm = ({
                          ventasMes,              // ya no se usa directamente, solo como fallback
                          ventasEmpleado,
                          modelosVendidos,
                          ingresosTotales,
                          reparacionesMecanico = [],
                          repuestosUsados = [],
                          historialCliente = []
                      }) => {
    /* ──────────────── estados de UI ──────────────── */
    const [filtroAnio, setFiltroAnio] = useState('');   // '' = todos
    const [filtroMes,  setFiltroMes]  = useState('');   // '' = todos
    const [modoOscuro, setModoOscuro] = useState(false);
    const [tabActivo,  setTabActivo]  = useState('ventas');
    const [colapsado,  setColapsado]  = useState({});

    /* ───── estado local con las ventas que vienen del back ───── */
    const [ventasMesState, setVentasMesState] = useState(ventasMes || []);

    /* ───────────── recarga dinámica desde el backend ─────────── */
    useEffect(() => {
        // convertimos '' → 0 para que el SP entienda “todos”
        const mes  = filtroMes  ? filtroMes  : 6;
        const anio = filtroAnio ? filtroAnio : 2025;

        getVentasPorMes(mes, anio)
            .then(setVentasMesState)
            .catch(console.error);
    }, [filtroMes, filtroAnio]);
    /* ─────────────────────────────────────────────────────────── */

    /* ─────── utilidades de listado (para select) ─────── */
    const añosDisponibles = [...new Set(ingresosTotales.map(i => i.anio))];
    const meses = Array.from({ length: 12 }, (_, i) => i + 1);

    /* ─────── exportar CSV (ventas usa ventasMesState) ─────── */
    const exportarCSV = (tipo) => {
        let encabezado = '';
        let filas = [];

        if (tipo === 'ventas') {
            encabezado = 'Modelo,Cantidad,Ingreso';
            filas = ventasMesState.map(
                v => `${v.nombreModelo},${v.cantidadVendida},${v.ingresoTotal}`
            );
        }

        if (tipo === 'ingresos') {
            encabezado = 'Origen,Mes,Año,Total';
            filas = ingresosTotales
                .filter(v =>
                    (!filtroAnio || v.anio === +filtroAnio) &&
                    (!filtroMes  || v.mes  === +filtroMes)
                )
                .map(v => `${v.origen},${v.mes},${v.anio},${v.total}`);
        }

        if (tipo === 'reparaciones') {
            encabezado = 'Mecánico,Apellido,Cant.Rep,Total';
            filas = reparacionesMecanico.map(
                v => `${v.nombre},${v.apellido},${v.cantidadReparaciones},${v.totalGenerado}`
            );
        }

        const csv  = encabezado + '\n' + filas.join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `reporte_${tipo}.csv`;
        link.click();
    };

    const toggleColapsado = (seccion) =>
        setColapsado(prev => ({ ...prev, [seccion]: !prev[seccion] }));

    /* ───────────────────────── render ───────────────────────── */
    return (
        <div className={`reporte-container ${modoOscuro ? 'modo-oscuro' : ''}`}>
            {/* filtros */}
            <div className="reporte-acciones" style={{ display:'flex', flexWrap:'wrap', gap:'1rem', marginBottom:'1rem' }}>
                <select value={filtroAnio} onChange={e => setFiltroAnio(e.target.value)}>
                    <option value="">📅 Todos los años</option>
                    {añosDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
                </select>

                <select value={filtroMes} onChange={e => setFiltroMes(e.target.value)}>
                    <option value="">📆 Todos los meses</option>
                    {meses.map(m => (
                        <option key={m} value={m}>
                            {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
                        </option>
                    ))}
                </select>

                <button className="export-btn" onClick={() => window.print()}>🖨️ Imprimir</button>
                <button className="export-btn" onClick={() => exportarCSV('ventas')}>📄 CSV Ventas</button>
                <button className="export-btn" onClick={() => exportarCSV('ingresos')}>📄 CSV Ingresos</button>
                <button className="export-btn" onClick={() => exportarCSV('reparaciones')}>📄 CSV Reparaciones</button>
                <button className="export-btn" onClick={() => setModoOscuro(!modoOscuro)}>
                    {modoOscuro ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
                </button>
            </div>

            {/* tabs */}
            <div className="tabs">
                {['ventas','ingresos','reparaciones','otros'].map(tab => (
                    <button
                        key={tab}
                        className={`tab-btn ${tabActivo === tab ? 'activo' : ''}`}
                        onClick={() => setTabActivo(tab)}
                    >
                        {tab.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* contenido */}
            <div id="reporte-exportable">
                {/* ───────── pestaña VENTAS ───────── */}
                {tabActivo === 'ventas' && (
                    <>
                        <div className="reporte-card ventas-mes">
                            <div className="reporte-title" onClick={() => toggleColapsado('ventasMes')}>
                                📊 Ventas por Mes
                            </div>
                            {!colapsado.ventasMes && (
                                <ul className="reporte-list">
                                    {ventasMesState.map((it, idx) => (
                                        <li key={idx} className="reporte-item">
                                            Modelo: {it.nombreModelo} | Cantidad: {it.cantidadVendida} | Ingreso: ${it.ingresoTotal}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="reporte-card ventas-empleado">
                            <div className="reporte-title" onClick={() => toggleColapsado('ventasEmpleado')}>
                                👷 Ventas por Empleado
                            </div>
                            {!colapsado.ventasEmpleado && (
                                <ul className="reporte-list">
                                    {ventasEmpleado.map((it, idx) => (
                                        <li key={idx} className="reporte-item">
                                            {it.nombre} {it.apellido} - Ventas: {it.cantidadVentas} - Total: ${it.totalGenerado}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="reporte-card modelos-vendidos">
                            <div className="reporte-title" onClick={() => toggleColapsado('modelosVendidos')}>
                                🚗 Modelos Más Vendidos
                            </div>
                            {!colapsado.modelosVendidos && (
                                <ul className="reporte-list">
                                    {modelosVendidos.map((it, idx) => (
                                        <li key={idx} className="reporte-item">
                                            {it.nombreModelo} - Unidades: {it.unidadesVendidas} - Total: ${it.totalGenerado}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>
                )}

                {/* ───────── pestaña INGRESOS ───────── */}
                {tabActivo === 'ingresos' && (
                    <div className="reporte-card ingresos-totales">
                        <div className="reporte-title" onClick={() => toggleColapsado('ingresosTotales')}>
                            💰 Ingresos Totales
                        </div>
                        {!colapsado.ingresosTotales && (
                            <ul className="reporte-list">
                                {ingresosTotales
                                    .filter(v =>
                                        (!filtroAnio || v.anio === +filtroAnio) &&
                                        (!filtroMes  || v.mes  === +filtroMes)
                                    )
                                    .map((it, idx) => (
                                        <li key={idx} className="reporte-item">
                                            {it.origen} - {it.mes}/{it.anio} - Total: ${it.total}
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* ───────── pestaña REPARACIONES ───────── */}
                {tabActivo === 'reparaciones' && (
                    <>
                        <div className="reporte-card reparaciones-mecanico">
                            <div className="reporte-title" onClick={() => toggleColapsado('reparacionesMecanico')}>
                                🔧 Reparaciones por Mecánico
                            </div>
                            {!colapsado.reparacionesMecanico && (
                                <ul className="reporte-list">
                                    {reparacionesMecanico.map((it, idx) => (
                                        <li key={idx} className="reporte-item">
                                            {it.nombre} {it.apellido} - Reparaciones: {it.cantidadReparaciones} - Total: ${it.totalGenerado}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="reporte-card repuestos-usados">
                            <div className="reporte-title" onClick={() => toggleColapsado('repuestosUsados')}>
                                🧩 Repuestos Más Usados
                            </div>
                            {!colapsado.repuestosUsados && (
                                <ul className="reporte-list">
                                    {repuestosUsados.map((it, idx) => (
                                        <li key={idx} className="reporte-item">
                                            {it.descripcion} - Usos: {it.vecesUtilizado} - Gasto Total: ${it.totalGastado}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>
                )}

                {/* ───────── pestaña OTROS (historial cliente) ───────── */}
                {tabActivo === 'otros' && historialCliente.length > 0 && (
                    <div className="reporte-card historial-cliente">
                        <div className="reporte-title" onClick={() => toggleColapsado('historialCliente')}>
                            📂 Historial del Cliente
                        </div>
                        {!colapsado.historialCliente && (
                            <ul className="reporte-list">
                                {historialCliente.map((it, idx) => (
                                    <li key={idx} className="reporte-item">
                                        [{it.tipo}] {it.fecha} - {it.descripcion || '---'} - Mecánico: {it.mecanico || '---'} - Monto: ${it.monto}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportesForm;
