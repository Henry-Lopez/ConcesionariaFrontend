import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditarModeloPage() {
    const { id }       = useParams();
    const navigate      = useNavigate();

    /* ---------- estado ---------- */
    const [form,   setForm]   = useState(null);   // modelo que se edita
    const [marcas, setMarcas] = useState([]);     // catálogo de marcas
    const [equipos,setEquipos]= useState([]);     // catálogo de equipos

    /* ---------- carga inicial ---------- */
    useEffect(() => {

        // 1) modelo a editar (lo obtenemos desde el endpoint /listar)
        axios.get('http://localhost:8080/api/modelos/listar')
            .then(res => {
                const modelo = res.data.find(m => m.idModelo === Number(id));
                if (!modelo) {
                    alert('Modelo no encontrado');
                    return navigate('/registro-modelo');
                }

                /*  ✨ Normalizamos los nombres de campo para los selects.
                    En el backend se llaman idEquiposSerie / idEquiposExtra. */
                setForm({
                    ...modelo,
                    equiposSerie : modelo.idEquiposSerie  ?? [],
                    equiposExtra : modelo.idEquiposExtra  ?? []
                });
            })
            .catch(() => alert('Error al cargar modelo'));

        // 2) catálogo de marcas
        axios.get('http://localhost:8080/api/marcas/listar')
            .then(res => setMarcas(res.data));

        // 3) catálogo de equipos
        axios.get('http://localhost:8080/api/equipos/listar')
            .then(res => setEquipos(res.data));

    }, [id, navigate]);

    /* ---------- helpers de formulario ---------- */
    const handleChange = e =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleListChange = (e, campo) => {
        const valores = Array.from(e.target.selectedOptions, opt => Number(opt.value));
        setForm({ ...form, [campo]: valores });
    };

    /* ---------- submit ---------- */
    const handleSubmit = async e => {
        e.preventDefault();

        try {
            /*  Mapeamos → DTO:
                - convertimos numéricos
                - pasamos arrays con nombres que el backend espera            */
            const payload = {
                ...form,
                idMarca            : Number(form.idMarca),
                cilindrada         : parseFloat(form.cilindrada),
                nroPuertas         : Number(form.nroPuertas),
                nroRuedas          : Number(form.nroRuedas),
                capacidadPasajeros : Number(form.capacidadPasajeros),
                precioBase         : parseFloat(form.precioBase),
                descuento          : parseFloat(form.descuento),
                idEquiposSerie     : form.equiposSerie,
                idEquiposExtra     : form.equiposExtra
            };

            await axios.put(`http://localhost:8080/api/modelos/actualizar/${id}`, payload);
            alert('Modelo actualizado');
            navigate('/registro-modelo');

        } catch (err) {
            console.error(err);
            alert('Error al actualizar modelo');
        }
    };

    if (!form) return <p>Cargando...</p>;

    /* ---------- JSX ---------- */
    return (
        <form onSubmit={handleSubmit}>
            <h2>Editar Modelo</h2>

            <input
                name="nombreModelo"
                value={form.nombreModelo}
                onChange={handleChange}
                placeholder="Nombre"
                required
            />

            <select name="idMarca" value={form.idMarca} onChange={handleChange} required>
                <option value="">Seleccionar marca</option>
                {marcas.map(m => (
                    <option key={m.idMarca} value={m.idMarca}>{m.nombre}</option>
                ))}
            </select>

            <input name="potenciaFiscal" type="text"  value={form.potenciaFiscal}   onChange={handleChange} placeholder="Potencia fiscal"/>
            <input name="cilindrada"     type="number"value={form.cilindrada}       onChange={handleChange} placeholder="Cilindrada"/>
            <input name="nroPuertas"     type="number"value={form.nroPuertas}       onChange={handleChange} placeholder="Puertas"/>
            <input name="nroRuedas"      type="number"value={form.nroRuedas}        onChange={handleChange} placeholder="Ruedas"/>
            <input name="capacidadPasajeros" type="number" value={form.capacidadPasajeros} onChange={handleChange} placeholder="Capacidad"/>
            <input name="precioBase"     type="number"value={form.precioBase}       onChange={handleChange} placeholder="Precio base"/>
            <input name="descuento"      type="number"value={form.descuento}        onChange={handleChange} placeholder="Descuento"/>

            <label>Equipos de Serie:</label>
            <select multiple value={form.equiposSerie} onChange={e => handleListChange(e,'equiposSerie')}>
                {equipos.map(eq => (
                    <option key={eq.idEquipo} value={eq.idEquipo}>{eq.descripcion}</option>
                ))}
            </select>

            <label>Equipos Extra:</label>
            <select multiple value={form.equiposExtra} onChange={e => handleListChange(e,'equiposExtra')}>
                {equipos.map(eq => (
                    <option key={eq.idEquipo} value={eq.idEquipo}>{eq.descripcion}</option>
                ))}
            </select>

            <button type="submit">Guardar Cambios</button>
        </form>
    );
}
