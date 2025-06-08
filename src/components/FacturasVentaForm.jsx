import React, { useEffect, useState } from 'react';
import { listarFacturasVenta } from '../api/facturaService';

const FacturasVentaForm = () => {
    const [facturas, setFacturas] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await listarFacturasVenta();
            setFacturas(data);
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>Facturas de Venta</h2>
            <table border="1" cellPadding="5" style={{ marginTop: '1rem' }}>
                <thead>
                <tr>
                    <th>ID Factura</th>
                    <th>ID Venta</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>IVA</th>
                    <th>Precio Final</th>
                </tr>
                </thead>
                <tbody>
                {facturas.map((f, i) => (
                    <tr key={i}>
                        <td>{f.idFactura}</td>
                        <td>{f.idVenta}</td>
                        <td>{f.cliente}</td>
                        <td>{f.total}</td>
                        <td>{f.iva}</td>
                        <td>{f.precioFinal}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default FacturasVentaForm;
