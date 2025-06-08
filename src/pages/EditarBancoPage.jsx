import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { listarFinanciamientosDisponibles, obtenerFinanciamientoPorId } from '../api/financiamientoService';

export default function EditarBancoPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);
    const [financiamientos, setFinanciamientos] = useState([]);

    // Cargar banco + financiamientos disponibles
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const bancoRes = await axios.get(`http://localhost:8080/api/bancos/${id}`);
                const banco = bancoRes.data;

                const disponibles = await listarFinanciamientosDisponibles();

                // ✅ Asegurarse que el financiamiento actual también esté en la lista
                const actual = await obtenerFinanciamientoPorId(banco.idFinanciamiento);
                const yaIncluido = disponibles.some(f => f.idFinanciamiento === actual.idFinanciamiento);
                const listaFinal = yaIncluido ? disponibles : [actual, ...disponibles];

                setForm(banco);
                setFinanciamientos(listaFinal);
            } catch (err) {
                console.error(err);
                alert("Error al cargar banco o financiamientos");
            }
        };

        cargarDatos();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8080/api/bancos/actualizar`, {
                ...form,
                idFinanciamiento: parseInt(form.idFinanciamiento)
            });
            alert("✅ Banco actualizado correctamente");
            navigate('/registro-banco');
        } catch {
            alert("❌ Error al actualizar banco");
        }
    };

    if (!form) return <p>Cargando...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Editar Banco</h2>

            <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre del Banco"
                required
            />

            <input
                name="numeroCuenta"
                value={form.numeroCuenta}
                onChange={handleChange}
                placeholder="Número de Cuenta"
                required
            />

            <select
                name="idFinanciamiento"
                value={form.idFinanciamiento}
                onChange={handleChange}
                required
            >
                <option value="">Selecciona un financiamiento</option>
                {financiamientos.map(f => (
                    <option key={f.idFinanciamiento} value={f.idFinanciamiento}>
                        Financiamiento #{f.idFinanciamiento} - {f.tipoFinanciamiento || f.formaPago} - Cliente #{f.idCliente || f.idVenta}
                    </option>
                ))}
            </select>

            <button type="submit">Guardar Cambios</button>
        </form>
    );
}
