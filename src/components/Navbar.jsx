// Navbar.jsx
import { NavLink } from 'react-router-dom';
import '../styles/navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            {/* Datos independientes */}
            <div className="dropdown">
                <button className="dropbtn">📄 Datos Básicos</button>
                <div className="dropdown-content">
                    <NavLink to="/registro-cliente">Cliente</NavLink>
                    <NavLink to="/registro-empleado">Empleado</NavLink>
                    <NavLink to="/registro-mecanico">Mecánico</NavLink>
                    <NavLink to="/registro-banco">Banco</NavLink>
                    <NavLink to="/registro-equipo">Equipo</NavLink>
                </div>
            </div>

            {/* Entidades relacionadas */}
            <div className="dropdown">
                <button className="dropbtn">🚗 Datos Relacionados</button>
                <div className="dropdown-content">
                    <NavLink to="/registro-marca">Marca</NavLink>
                    <NavLink to="/registro-modelo">Modelo</NavLink>
                    <NavLink to="/registro-vehiculo">Vehículo</NavLink>
                    <NavLink to="/registro-repuesto">Repuesto</NavLink>
                    <NavLink to="/registro-servicio">Servicio Oficial</NavLink>
                    <NavLink to="/registro-concesionario">Concesionario</NavLink>
                </div>
            </div>

            {/* Gestión de procesos */}
            <div className="dropdown">
                <button className="dropbtn">🛠️ Procesos</button>
                <div className="dropdown-content">
                    <NavLink to="/registro-reparacion">Reparación</NavLink>
                    <NavLink to="/registro-venta">Venta</NavLink>
                    <NavLink to="/financiamiento/A1B2C3">Financiamiento</NavLink>
                    <NavLink to="/registro-pedido">Pedido de Importación</NavLink>
                </div>
            </div>

            {/* Reportes y facturación */}
            <div className="dropdown">
                <button className="dropbtn">📊 Reportes</button>
                <div className="dropdown-content">
                    <NavLink to="/reportes">Reportes</NavLink>
                    <NavLink to="/facturas/venta">Factura Venta</NavLink>
                    <NavLink to="/facturas/reparacion">Factura Reparación</NavLink>
                    <NavLink to="/reporte-pedidos">Pedidos Importación</NavLink>
                    <NavLink to="/reporte-resumen">Resumen de Pedidos</NavLink> {/* ✅ NUEVO */}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
