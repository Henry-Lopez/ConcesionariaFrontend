import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/professional.css';

// Páginas de registro
import RegistroVenta from './pages/RegistroVenta';
import RegistroReparacion from './pages/RegistroReparacion';
import RegistroCliente from './pages/RegistroCliente';
import RegistroEmpleado from './pages/RegistroEmpleado';
import RegistroVehiculo from './pages/RegistroVehiculo';
import RegistroRepuesto from './pages/RegistroRepuesto';
import RegistroMecanico from './pages/RegistroMecanico';
import RegistroMarca from './pages/RegistroMarca';
import RegistroEquipo from './pages/RegistroEquipo';
import RegistroConcesionario from './pages/RegistroConcesionario';
import RegistroModelo from './pages/RegistroModelo';
import RegistroServicioOficial from './pages/RegistroServicioOficial';
import RegistroBanco from './pages/RegistroBanco';
import RegistroPedido from './pages/RegistroPedido';
import FinanciamientoPage from './pages/FinanciamientoPage';

// Páginas de edición
import EditarEmpleadoPage from './pages/EditarEmpleadoPage';
import EditarClientePage from './pages/EditarClientePage';
import EditarVehiculoPage from './pages/EditarVehiculoPage';
import EditarRepuestoPage from './pages/EditarRepuestoPage';
import EditarReparacionPage from './pages/EditarReparacionPage';
import EditarVentaPage from './pages/EditarVentaPage';
import EditarMecanicoPage from './pages/EditarMecanicoPage';
import EditarMarcaPage from './pages/EditarMarcaPage';
import EditarEquipoPage from './pages/EditarEquipoPage';
import EditarConcesionarioPage from './pages/EditarConcesionarioPage';
import EditarModeloPage from './pages/EditarModeloPage';
import EditarServicioOficialPage from './pages/EditarServicioOficialPage';
import EditarBancoPage from './pages/EditarBancoPage';
import EditarPedidoImportacionPage from './pages/EditarPedidoImportacionPage';

// Reportes y navegación
import Reportes from './pages/Reportes';
import Navbar from './components/Navbar';
import VistaPedidosReport from './components/VistaPedidosReport';
import ReporteResumenPedidos from './components/ReporteResumenPedidos'; // ✅ NUEVO

// Facturas
import FacturasVentaForm from './components/FacturasVentaForm';
import FacturasReparacionForm from './components/FacturasReparacionForm';

function App() {
    return (
        <Router>
            <Navbar />
            <div style={{ padding: '1rem' }}>
                <Routes>
                    <Route path="/" element={<Navigate to="/registro-venta" />} />
                    <Route path="/registro-venta" element={<RegistroVenta />} />
                    <Route path="/registro-reparacion" element={<RegistroReparacion />} />
                    <Route path="/registro-cliente" element={<RegistroCliente />} />
                    <Route path="/registro-empleado" element={<RegistroEmpleado />} />
                    <Route path="/registro-vehiculo" element={<RegistroVehiculo />} />
                    <Route path="/registro-repuesto" element={<RegistroRepuesto />} />
                    <Route path="/registro-mecanico" element={<RegistroMecanico />} />
                    <Route path="/registro-marca" element={<RegistroMarca />} />
                    <Route path="/registro-equipo" element={<RegistroEquipo />} />
                    <Route path="/registro-concesionario" element={<RegistroConcesionario />} />
                    <Route path="/registro-modelo" element={<RegistroModelo />} />
                    <Route path="/registro-servicio" element={<RegistroServicioOficial />} />
                    <Route path="/registro-banco" element={<RegistroBanco />} />
                    <Route path="/registro-pedido" element={<RegistroPedido />} />
                    <Route path="/reportes" element={<Reportes />} />
                    <Route path="/reporte-pedidos" element={<VistaPedidosReport />} />
                    <Route path="/reporte-resumen" element={<ReporteResumenPedidos />} /> {/* ✅ NUEVA RUTA */}

                    {/* Facturas */}
                    <Route path="/facturas/venta" element={<FacturasVentaForm />} />
                    <Route path="/facturas/reparacion" element={<FacturasReparacionForm />} />

                    {/* Financiamiento */}
                    <Route path="/financiamiento/:nroChasis" element={<FinanciamientoPage />} />

                    {/* Edición */}
                    <Route path="/editar-empleado/:id" element={<EditarEmpleadoPage />} />
                    <Route path="/editar-cliente/:id" element={<EditarClientePage />} />
                    <Route path="/editar-vehiculo/:nroChasis" element={<EditarVehiculoPage />} />
                    <Route path="/editar-repuesto/:id" element={<EditarRepuestoPage />} />
                    <Route path="/editar-reparacion/:id" element={<EditarReparacionPage />} />
                    <Route path="/editar-venta/:id" element={<EditarVentaPage />} />
                    <Route path="/editar-mecanico/:idMecanico" element={<EditarMecanicoPage />} />
                    <Route path="/editar-marca/:id" element={<EditarMarcaPage />} />
                    <Route path="/editar-equipo/:id" element={<EditarEquipoPage />} />
                    <Route path="/editar-concesionario/:id" element={<EditarConcesionarioPage />} />
                    <Route path="/editar-modelo/:id" element={<EditarModeloPage />} />
                    <Route path="/editar-servicio/:id" element={<EditarServicioOficialPage />} />
                    <Route path="/editar-banco/:id" element={<EditarBancoPage />} />
                    <Route path="/editar-pedido/:id" element={<EditarPedidoImportacionPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
