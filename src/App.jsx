import { useState } from 'react'
import './App.css'

function App() {
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  
  const [parameters, setParameters] = useState({
    editAfluencia: '90%',
    editIngresosTotales: '1000000',
    editTasaDeConversion: '80%',
    editVolumenDeVentas: '100000',
    edit10: '2',
    editNombreDeLaSucursal: 'Suc 2'
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setParameters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!apiKey) {
      setError('Por favor ingresa tu API Key')
      return
    }

    setLoading(true)
    setError(null)
    setResponse(null)

    const payload = {
      projectId: "b7f99e5e-94d2-4cc4-a02d-8d9661edc2e4",
      templateId: "c440e92d-b3dd-417e-a16a-cd949648a972",
      parameters: parameters,
      outputFormat: {
        attachment: false,
        outputModule: "HQ",
        settingsTemplate: "BEST_SETTINGS",
        postEncoding: {
          type: "custom",
          encodingFormat: "MP4_OFR",
          encodingParamsLine: "-b:v 15M -minrate 15M -maxrate 15M -bufsize 30M -x264-params nal-hrd=cbr:force-cfr=1 -b:a 192k"
        }
      },
      options: {
        integrations: {
          skipAll: false,
          passthrough: "2"
        },
        thumbnails: null,
        watermark: null,
        projectFiles: null,
        captions: null,
        uploads: null
      }
    }

    try {
      const res = await fetch('https://api.plainlyvideos.com/api/v2/renders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(apiKey + ':')
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      
      if (res.ok) {
        setResponse(data)
      } else {
        setError(data.message || 'Error al crear el render')
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Plainly Videos - Generador de Renders</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="apiKey">API Key:</label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Ingresa tu API Key"
            required
          />
        </div>

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
          {loading ? 'Generando Render...' : 'Generar Render'}
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
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default App
