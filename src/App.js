import { useState } from "react";
import "./App.css";
function App() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [renderId, setRenderId] = useState(null);
  const [renderState, setRenderState] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const [parameters, setParameters] = useState({
    editAfluencia: "90%",
    editIngresosTotales: "1000000",
    editTasaDeConversion: "80%",
    editVolumenDeVentas: "100000",
    edit10: "2",
    editNombreDeLaSucursal: "Suc 2",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setParameters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const checkRenderStatus = async (id) => {
    setCheckingStatus(true);

    try {
      const res = await fetch("https://itoffzyhxyixvrnbdqpi.supabase.co/functions/v1/checkStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setRenderState(data.state);

        if (data.state === "DONE" && data.output) {
          setVideoUrl(data.output);
          setCheckingStatus(false);
        } else if (
          data.state === "PENDING" ||
          data.state === "IN_PROGRESS" ||
          data.state === "RENDERING"
        ) {
          // Volver a verificar después de 5 segundos
          setTimeout(() => checkRenderStatus(id), 5000);
        } else if (data.state === "FAILED") {
          setError("El render falló: " + (data.error || "Error desconocido"));
          setCheckingStatus(false);
        } else {
          setCheckingStatus(false);
        }
      } else {
        setError("Error al verificar el estado del render");
        setCheckingStatus(false);
      }
    } catch (err) {
      setError("Error al verificar el estado: " + err.message);
      setCheckingStatus(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    setLoading(true);
    setError(null);
    setResponse(null);
    setVideoUrl(null);
    setRenderState(null);

    try {
      const res = await fetch("https://itoffzyhxyixvrnbdqpi.supabase.co/functions/v1/createRender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parameters: parameters,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data);

        // Guardar el ID del render
        if (data.id) {
          setRenderId(data.id);
        }

        // Guardar el estado inicial
        if (data.state) {
          setRenderState(data.state);

          // Si está PENDING, comenzar a verificar el estado
          if (data.state === "PENDING" || data.state === "RENDERING") {
            checkRenderStatus(data.id);
          } else if (data.state === "DONE" && data.output) {
            setVideoUrl(data.output);
          }
        }
      } else {
        setError(data.message || "Error al crear el render");
      }
    } catch (err) {
      setError("Error de conexión: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Plainly Videos</h1>

      <form onSubmit={handleSubmit}>
        <h2>Parámetros del Template</h2>

        <div className="form-group">
          <label htmlFor="editAfluencia">Afluencia:</label>
          <input
            type="text"
            id="editAfluencia"
            name="editAfluencia"
            value={parameters.editAfluencia}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="editIngresosTotales">Ingresos Totales:</label>
          <input
            type="text"
            id="editIngresosTotales"
            name="editIngresosTotales"
            value={parameters.editIngresosTotales}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="editTasaDeConversion">Tasa de Conversión:</label>
          <input
            type="text"
            id="editTasaDeConversion"
            name="editTasaDeConversion"
            value={parameters.editTasaDeConversion}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="editVolumenDeVentas">Volumen de Ventas:</label>
          <input
            type="text"
            id="editVolumenDeVentas"
            name="editVolumenDeVentas"
            value={parameters.editVolumenDeVentas}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="edit10">Edit 10:</label>
          <input
            type="text"
            id="edit10"
            name="edit10"
            value={parameters.edit10}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="editNombreDeLaSucursal">Nombre de la Sucursal:</label>
          <input
            type="text"
            id="editNombreDeLaSucursal"
            name="editNombreDeLaSucursal"
            value={parameters.editNombreDeLaSucursal}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Generando Render..." : "Generar Render"}
        </button>
      </form>

      {error && (
        <div className="error">
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="success">
          <h3>✓ Render Creado Exitosamente</h3>
          {renderId && (
            <p>
              <strong>ID del Render:</strong> {renderId}
            </p>
          )}
          {renderState && (
            <p>
              <strong>Estado:</strong>{" "}
              <span className={`state ${renderState.toLowerCase()}`}>
                {renderState}
              </span>
            </p>
          )}
          {checkingStatus && (
            <p className="checking">⏳ Verificando estado del render...</p>
          )}
        </div>
      )}

      {videoUrl && (
        <div className="video-container">
          <h3>🎬 Video Listo!</h3>
          <p>
            <strong>URL del video:</strong>
          </p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="video-link"
          >
            {videoUrl}
          </a>
          <video
            controls
            width="100%"
            style={{ marginTop: "1rem", borderRadius: "8px" }}
          >
            <source src={videoUrl} type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
        </div>
      )}
    </div>
  );
}

export default App;
