    // src/pages/Reportes.jsx
    import React, { useEffect, useState } from 'react';
    import ReportesForm from '../components/ReportesForm';
    import {
        getVentasPorMes,
        getVentasPorEmpleado,
        getModelosMasVendidos,
        getIngresosTotales,
        getReparacionesPorMecanico,
        getRepuestosMasUsados,
        getHistorialCliente
    } from '../api/ReporteService';

    const Reportes = () => {
        const [ventasMes, setVentasMes] = useState([]);
        const [ventasEmpleado, setVentasEmpleado] = useState([]);
        const [modelosVendidos, setModelosVendidos] = useState([]);
        const [ingresosTotales, setIngresosTotales] = useState([]);
        const [reparacionesMecanico, setReparacionesMecanico] = useState([]);
        const [repuestosUsados, setRepuestosUsados] = useState([]);
        const [historialCliente, setHistorialCliente] = useState([]);
        const [clienteId, setClienteId] = useState('');

        useEffect(() => {
            async function fetchData() {
                const mes = 5;
                const anio = 2025;

                try {
                    setVentasMes(await getVentasPorMes(mes, anio));
                    setVentasEmpleado(await getVentasPorEmpleado());
                    setModelosVendidos(await getModelosMasVendidos());
                    setIngresosTotales(await getIngresosTotales());
                    setReparacionesMecanico(await getReparacionesPorMecanico());
                    setRepuestosUsados(await getRepuestosMasUsados());
                } catch (error) {
                    console.error('Error cargando reportes:', error);
                }
            }

            fetchData();
        }, []);

        const handleBuscarHistorial = async () => {
            if (!clienteId) return;
            try {
                const historial = await getHistorialCliente(clienteId);
                setHistorialCliente(historial);
            } catch (error) {
                console.error('Error al obtener historial del cliente:', error);
            }
        };

        return (
            <div style={{ padding: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <input
                        type="number"
                        placeholder="ID del cliente"
                        value={clienteId}
                        onChange={(e) => setClienteId(e.target.value)}
                        style={{ marginRight: '1rem' }}
                    />
                    <button onClick={handleBuscarHistorial}>Buscar Historial</button>
                </div>

                <ReportesForm
                    ventasMes={ventasMes}
                    ventasEmpleado={ventasEmpleado}
                    modelosVendidos={modelosVendidos}
                    ingresosTotales={ingresosTotales}
                    reparacionesMecanico={reparacionesMecanico}
                    repuestosUsados={repuestosUsados}
                    historialCliente={historialCliente}
                />
            </div>
        );
    };

    export default Reportes;

