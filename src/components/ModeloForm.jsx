import React, { useEffect, useState } from 'react';
import {
    registrarModelo,
    listarModelos,
    eliminarModelo,
} from '../api/ModeloService';
import { listarMarcas } from '../api/marcaService';
import { listarEquipos } from '../api/equipoService';
import { useNavigate } from 'react-router-dom';

const ModeloForm = () => {
    /* ---------------- state ---------------- */
    const [formData, setFormData] = useState({
        nombreModelo: '',
        idMarca: '',
        potenciaFiscal: '',
        cilindrada: '',
        nroPuertas: '',
        nroRuedas: '',
        capacidadPasajeros: '',
        precioBase: '',
        descuento: '',
        equiposSerie: [],
        equiposExtra: [],
    });

    const [modelos, setModelos] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    /* -------------- handlers --------------- */
    const handleChange = (e) =>
        setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleListChange = (e, campo) => {
        const valores = Array.from(e.target.selectedOptions, (o) => Number(o.value));
        setFormData((p) => ({ ...p, [campo]: valores }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje('');
        setError('');

        try {
            const dto = {
                ...formData,
                idMarca: Number(formData.idMarca),
                cilindrada: parseFloat(formData.cilindrada || 0),
                nroPuertas: Number(formData.nroPuertas || 0),
                nroRuedas: Number(formData.nroRuedas || 0),
                capacidadPasajeros: Number(formData.capacidadPasajeros || 0),
                precioBase: parseFloat(formData.precioBase || 0),
                descuento: parseFloat(formData.descuento || 0),
            };

            const resp = await registrarModelo(dto);
            setMensaje(resp);

            /* limpia formulario */
            setFormData({
                nombreModelo: '',
                idMarca: '',
                potenciaFiscal: '',
                cilindrada: '',
                nroPuertas: '',
                nroRuedas: '',
                capacidadPasajeros: '',
                precioBase: '',
                descuento: '',
                equiposSerie: [],
                equiposExtra: [],
            });
            cargarModelos();
        } catch (err) {
            console.error(err);
            setError('⛔ Error al procesar el modelo');
        }
    };

    /* -------------- loaders --------------- */
    const cargarModelos = async () => setModelos(await listarModelos());

    const cargarDatosIniciales = async () => {
        setMarcas(await listarMarcas());
        setEquipos(await listarEquipos());
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Eliminar este modelo?')) {
            await eliminarModelo(id);
            cargarModelos();
        }
    };

    useEffect(() => {
        cargarModelos();
        cargarDatosIniciales();
    }, []);

    /* -------------- helpers --------------- */
    /* mapea IDs → descripciones; devuelve [] si ids es undefined */
    const obtenerNombresEquipos = (ids = []) =>
        equipos.filter((e) => ids.includes(e.idEquipo)).map((e) => e.descripcion);

    /* --------------- render --------------- */
    return (
        <div>
            <h2>Registrar Modelo</h2>

            {/* -------- FORM -------- */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nombreModelo"
                    value={formData.nombreModelo}
                    onChange={handleChange}
                    placeholder="Nombre modelo"
                    required
                />

                <select
                    name="idMarca"
                    value={formData.idMarca}
                    onChange={handleChange}
                    required
                >
                    <option value="">Seleccionar marca</option>
                    {marcas.map((m) => (
                        <option key={m.idMarca} value={m.idMarca}>
                            {m.nombre}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    name="potenciaFiscal"
                    value={formData.potenciaFiscal}
                    onChange={handleChange}
                    placeholder="Potencia fiscal"
                />
                <input
                    type="number"
                    name="cilindrada"
                    value={formData.cilindrada}
                    onChange={handleChange}
                    placeholder="Cilindrada"
                />
                <input
                    type="number"
                    name="nroPuertas"
                    value={formData.nroPuertas}
                    onChange={handleChange}
                    placeholder="Número de puertas"
                />
                <input
                    type="number"
                    name="nroRuedas"
                    value={formData.nroRuedas}
                    onChange={handleChange}
                    placeholder="Número de ruedas"
                />
                <input
                    type="number"
                    name="capacidadPasajeros"
                    value={formData.capacidadPasajeros}
                    onChange={handleChange}
                    placeholder="Capacidad de pasajeros"
                />
                <input
                    type="number"
                    name="precioBase"
                    value={formData.precioBase}
                    onChange={handleChange}
                    placeholder="Precio base"
                />
                <input
                    type="number"
                    name="descuento"
                    value={formData.descuento}
                    onChange={handleChange}
                    placeholder="Descuento"
                />

                <label>Equipos de Serie:</label>
                <select
                    multiple
                    value={formData.equiposSerie}
                    onChange={(e) => handleListChange(e, 'equiposSerie')}
                >
                    {equipos.map((e) => (
                        <option key={e.idEquipo} value={e.idEquipo}>
                            {e.descripcion}
                        </option>
                    ))}
                </select>

                <label>Equipos Extra:</label>
                <select
                    multiple
                    value={formData.equiposExtra}
                    onChange={(e) => handleListChange(e, 'equiposExtra')}
                >
                    {equipos.map((e) => (
                        <option key={e.idEquipo} value={e.idEquipo}>
                            {e.descripcion}
                        </option>
                    ))}
                </select>

                <button type="submit">Registrar</button>
            </form>

            {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* -------- TABLE -------- */}
            <h3>Modelos Registrados</h3>
            <table border="1" cellPadding="5" style={{ marginTop: '1rem' }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Marca ID</th>
                    <th>Potencia</th>
                    <th>Cilindrada</th>
                    <th>Puertas</th>
                    <th>Ruedas</th>
                    <th>Capacidad</th>
                    <th>Precio Base</th>
                    <th>Descuento</th>
                    <th>Equipos Serie</th>
                    <th>Equipos Extra</th>
                    <th>Acciones</th>
                </tr>
                </thead>

                <tbody>
                {modelos.map((m) => (
                    <tr key={m.idModelo}>
                        <td>{m.idModelo}</td>
                        <td>{m.nombreModelo}</td>
                        <td>{m.idMarca}</td>
                        <td>{m.potenciaFiscal}</td>
                        <td>{m.cilindrada}</td>
                        <td>{m.nroPuertas}</td>
                        <td>{m.nroRuedas}</td>
                        <td>{m.capacidadPasajeros}</td>
                        <td>{m.precioBase}</td>
                        <td>{m.descuento}</td>

                        {/* se usan las claves equiposSerie / equiposExtra que envía el backend */}
                        <td>{obtenerNombresEquipos(m.equiposSerie).join(', ') || '—'}</td>
                        <td>{obtenerNombresEquipos(m.equiposExtra).join(', ') || '—'}</td>

                        <td>
                            <button onClick={() => navigate(`/editar-modelo/${m.idModelo}`)}>
                                Editar
                            </button>
                            <button onClick={() => handleEliminar(m.idModelo)}>
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ModeloForm;
