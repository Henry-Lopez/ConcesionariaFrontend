import React, { useEffect, useState } from 'react';
import { listarFacturasReparacion } from '../api/facturaService';
import { listarReparaciones } from '../api/ReparacionService';
import { listarRepuestos } from '../api/RepuestoService';

const FacturasReparacionForm = () => {
    const [facturas, setFacturas] = useState([]);
    const [reparaciones, setReparaciones] = useState([]);
    const [repuestos, setRepuestos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const f = await listarFacturasReparacion();
            const r = await listarReparaciones();
            const rep = await listarRepuestos();

            setFacturas(f);
            setReparaciones(r);
            setRepuestos(rep);
        };
        fetchData();
    }, []);

    const formatCurrency = (value) =>
        new Intl.NumberFormat('es-BO', {
            style: 'currency',
            currency: 'BOB',
            minimumFractionDigits: 2,
        }).format(value || 0);

    const calcularTotalRepuestos = (idReparacion) => {
        const repIds = reparaciones.find(r => r.idReparacion === idReparacion)?.idRepuestos || [];
        return repIds.reduce((acc, id) => {
            const r = repuestos.find(x => x.idRepuesto === id);
            return acc + (r?.precioUnidad || 0);
        }, 0);
    };

    const calcularTotalManoObra = (idReparacion) => {
        const manoObra = reparaciones.find(r => r.idReparacion === idReparacion)?.manoObra || [];
        return manoObra.reduce((acc, m) => acc + m.horasTrabajadas * m.costoHora, 0);
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'Segoe UI, sans-serif' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem', color: '#333' }}>
                Facturas de Reparación
            </h2>

            <table style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: '0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                overflow: 'hidden'
            }}>
                <thead style={{ backgroundColor: '#f5f5f5' }}>
                <tr>
                    {[
                        'ID Factura',
                        'ID Reparación',
                        'Cliente',
                        'Total Repuestos',
                        'Total Mano Obra',
                        'IVA',
                        'Precio Final'
                    ].map((col) => (
                        <th key={col} style={{
                            padding: '12px',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: '#444',
                            borderBottom: '1px solid #ddd'
                        }}>
                            {col}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {facturas.map((f, i) => {
                    const totalRepuestos = calcularTotalRepuestos(f.idReparacion);
                    const totalManoObra = calcularTotalManoObra(f.idReparacion);
                    return (
                        <tr key={i} style={{
                            backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa',
                            borderBottom: '1px solid #eee'
                        }}>
                            <td style={{ padding: '10px' }}>{f.idFactura}</td>
                            <td style={{ padding: '10px' }}>{f.idReparacion}</td>
                            <td style={{ padding: '10px' }}>{f.cliente || '—'}</td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>{formatCurrency(totalRepuestos)}</td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>{formatCurrency(totalManoObra)}</td>
                            <td style={{ padding: '10px', textAlign: 'right' }}>{formatCurrency(f.iva)}</td>
                            <td style={{
                                padding: '10px',
                                textAlign: 'right',
                                fontWeight: 'bold',
                                color: '#0a572d'
                            }}>
                                {formatCurrency(f.precioFinal)}
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default FacturasReparacionForm;
