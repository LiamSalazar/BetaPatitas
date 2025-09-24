document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('animalForm');

  const especieSelect = document.getElementById('especie');
  const razaSelect = document.getElementById('raza');
  const infoIcon = document.getElementById('raza-info');

  const tamano = document.getElementById('tamano');
  const tipo_pelo = document.getElementById('tipo_pelo');
  const color_pelo = document.getElementById('color_pelo');
  const patron_color = document.getElementById('patron_color');

  const tiene_chip = document.getElementById('tiene_chip');
  const chip_tipo = document.getElementById('chip_tipo');
  const chip_numero = document.getElementById('chip_numero');

  const esterilizado = document.getElementById('esterilizado');
  const fecha_esterilizacion = document.getElementById('fecha_esterilizacion');

  const resultsContainer = document.getElementById('results');

  //Datos directamente en el script
  const razasData = {
    "Perro": {
      "Labrador": {
        tamano: "Grande",
        tipo_pelo: ["Corto","Medio"],
        color_pelo: ["Negro","Amarillo","Chocolate"],
        patron_color: ["Sólido","Atigrado"],
        info: "Perro muy amigable y familiar."
      },
      "Chihuahua": {
        tamano: "Pequeño",
        tipo_pelo: ["Corto","Largo"],
        color_pelo: ["Blanco","Marrón","Negro"],
        patron_color: ["Sólido"],
        info: "Muy pequeño, ideal para departamentos."
      }
    },
    "Gato": {
      "Siamés": {
        tamano: "Mediano",
        tipo_pelo: ["Corto"],
        color_pelo: ["Beige","Marrón"],
        patron_color: ["Sólido"],
        info: "Sociable y vocal."
      },
      "Mestizo": {
        tamano: "Mediano",
        tipo_pelo: ["Corto","Medio"],
        color_pelo: ["Negro","Blanco","Atigrado"],
        patron_color: ["Atigrado","Bicolor"],
        info: ""
      }
    }
  };

  // 📌 Mapas de sub-tamaños por categoría
  const tamanosPequenos = ["Extra Pequeño (0-3 kg)", "Pequeño (3-6 kg)", "Mini (6-9 kg)"];
  const tamanosMedianos = ["Mediano (10-20 kg)"];
  const tamanosGrandes = ["Grande (25-40 kg)", "Gigante (40+ kg)"];

  function llenarOpciones(selectElement, opciones) {
    if (!selectElement) return;
    selectElement.innerHTML = "<option value=''>Seleccione</option>";
    opciones.forEach(op => {
      const option = document.createElement('option');
      option.value = op;
      option.textContent = op;
      selectElement.appendChild(option);
    });
  }

  function poblarRazas(especie) {
    razaSelect.innerHTML = "<option value=''>Seleccione</option>";
    if (razasData[especie]) {
      Object.keys(razasData[especie]).forEach(r => {
        const o = document.createElement('option');
        o.value = r; 
        o.textContent = r;
        razaSelect.appendChild(o);
      });
    }
  }

  especieSelect.addEventListener('change', function() {
    poblarRazas(this.value);
    tamano.value = "";
    llenarOpciones(tipo_pelo, []);
    llenarOpciones(color_pelo, []);
    llenarOpciones(patron_color, []);
    infoIcon.onclick = () => alert('Selecciona una raza para ver información.');
  });

  razaSelect.addEventListener('change', function() {
    const especie = especieSelect.value;
    const raza = this.value;

    // Limpiar campos
    tamano.value = "";
    llenarOpciones(tipo_pelo, []);
    llenarOpciones(color_pelo, []);
    llenarOpciones(patron_color, []);
    infoIcon.onclick = () => alert('Sin información disponible.');

    if (razasData[especie] && razasData[especie][raza]) {
      const datos = razasData[especie][raza];

      // 🌟 Sub-tamaños automáticos según categoría
      if (datos.tamano) {
        let opcionesTamanos = [];
        switch (datos.tamano.toLowerCase()) {
          case "pequeño":
            opcionesTamanos = tamanosPequenos;
            break;
          case "mediano":
            opcionesTamanos = tamanosMedianos;
            break;
          case "grande":
            opcionesTamanos = tamanosGrandes;
            break;
          default:
            opcionesTamanos = [datos.tamano];
        }
        llenarOpciones(tamano, opcionesTamanos);
        tamano.value = opcionesTamanos[0]; // Por defecto seleccionamos el primero
      }

      if (datos.tipo_pelo) Array.isArray(datos.tipo_pelo) ? llenarOpciones(tipo_pelo, datos.tipo_pelo) : llenarOpciones(tipo_pelo, [datos.tipo_pelo]);
      if (datos.color_pelo) Array.isArray(datos.color_pelo) ? llenarOpciones(color_pelo, datos.color_pelo) : llenarOpciones(color_pelo, [datos.color_pelo]);
      if (datos.patron_color) Array.isArray(datos.patron_color) ? llenarOpciones(patron_color, datos.patron_color) : llenarOpciones(patron_color, [datos.patron_color]);
      
      infoIcon.onclick = () => alert(datos.info || 'Sin información adicional');
    }
  });

  tiene_chip.addEventListener('change', () => {
    if (tiene_chip.value === 'Si') {
      chip_tipo.disabled = false; chip_numero.disabled = false;
      chip_tipo.required = true; chip_numero.required = true;
    } else {
      chip_tipo.disabled = true; chip_numero.disabled = true;
      chip_tipo.required = false; chip_numero.required = false;
      chip_tipo.value = ""; chip_numero.value = "";
    }
  });

  esterilizado.addEventListener('change', () => {
    if (esterilizado.value === 'Si') {
      fecha_esterilizacion.disabled = false; fecha_esterilizacion.required = true;
    } else {
      fecha_esterilizacion.disabled = true; fecha_esterilizacion.required = false;
      fecha_esterilizacion.value = "";
    }
  });

  if (tiene_chip.value !== 'Si') { chip_tipo.disabled = true; chip_numero.disabled = true; }
  if (esterilizado.value !== 'Si') { fecha_esterilizacion.disabled = true; }

  const labelMap = {
    nombre:'Nombre', especie:'Especie', raza:'Raza', tamano:'Tamaño', tipo_pelo:'Tipo de pelo', color_pelo:'Color de pelo', patron_color:'Patrón de color',
    sexo:'Sexo', fecha_nacimiento:'Fecha nacimiento', senas:'Señas', ruac:'RUAC', tiene_chip:'Tiene chip', chip_tipo:'Tipo chip', chip_numero:'Número chip',
    esterilizado:'Esterilizado', fecha_esterilizacion:'Fecha esterilización', ultima_desparasitacion_fecha:'Última desparasitación (fecha)',
    ultima_desparasitacion_tipo:'Tipo desparasitación', peso_kg:'Peso (kg)', condicion_corporal_bcs:'Condición corporal', estado_salud:'Estado salud',
    alergias:'Alergias', dieta:'Dieta', temperamento:'Temperamento', compat_ninos:'Compatible con niños', compat_perros:'Compatible con perros',
    compat_gatos:'Compatible con gatos', entrenamiento:'Entrenamiento', estado_adopcion:'Estado adopción', fecha_ingreso:'Fecha ingreso',
    origen:'Origen', apto_adopcion_desde:'Apto adopción desde', cartilla_salud_pdf:'Cartilla salud (PDF)', foto:'Foto'
  };

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const fd = new FormData(form);
    const datos = {};
    for (const [k,v] of fd.entries()) {
      datos[k] = v instanceof File ? v.name || "" : v;
    }
    mostrarResultado(datos);
    form.reset();
    tamano.value = "";
    llenarOpciones(tipo_pelo, []);
    llenarOpciones(color_pelo, []);
    llenarOpciones(patron_color, []);
    chip_tipo.disabled = true; chip_numero.disabled = true;
    fecha_esterilizacion.disabled = true;
  });

  function mostrarResultado(data) {
    const card = document.createElement('div');
    card.className = 'submission-card';
    const title = document.createElement('h4');
    title.textContent = data.nombre ? `Registro: ${data.nombre}` : 'Registro nuevo';
    card.appendChild(title);

    const table = document.createElement('table');
    table.className = 'submission-table';
    Object.keys(data).forEach(k => {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      td1.textContent = labelMap[k] || k.replace(/_/g,' ');
      const td2 = document.createElement('td');
      td2.textContent = data[k] || '—';
      tr.appendChild(td1); tr.appendChild(td2);
      table.appendChild(tr);
    });
    card.appendChild(table);
    resultsContainer.prepend(card);
    card.scrollIntoView({behavior:'smooth', block:'center'});
  }
});

function mostrarTiposAlergia(valor) {
  document.getElementById('tiposAlergia').style.display = valor === 'Si' ? 'block' : 'none';
}

function mostrarDesparasitacion(valor) {
  document.getElementById('desparasitacionContainer').style.display = valor === 'Si' ? 'block' : 'none';
}

function agregarDesparasitacion() {
  const container = document.getElementById('desparasitacionContainer');
  const newItem = document.createElement('div');
  newItem.classList.add('desparasitacion-item', 'form-group-inline');
  newItem.innerHTML = `
    <div class="form-group">
      <label>Tipo de desparasitación</label>
      <select name="tipo_desparasitacion[]">
        <option value="">Seleccione</option>
        <option>Interna</option>
        <option>Externa</option>
        <option>Mixta</option>
      </select>
    </div>
    <div class="form-group">
      <label>Fecha</label>
      <input type="date" name="fecha_desparasitacion[]">
    </div>
  `;
  container.insertBefore(newItem, container.lastElementChild);
}

function mostrarAlergias(valor) {
  document.getElementById('alergiasContainer').style.display = valor === 'Si' ? 'block' : 'none';
}

function agregarAlergia() {
  const container = document.getElementById('alergiasContainer');
  const newItem = document.createElement('div');
  const index = container.querySelectorAll('.alergia-item').length + 1;
  newItem.classList.add('alergia-item', 'form-group');
  newItem.innerHTML = `
    <label>Tipo de alergia</label>
    <select name="tipo_alergia[]" id="alergia${index}" onchange="mostrarOtro(this, 'otroAlergia${index}')">
      <option value="">Seleccione</option>
      <option>Alimentaria</option>
      <option>Ambiental</option>
      <option>Picaduras</option>
      <option>Medicamentos</option>
      <option>Otro</option>
    </select>
    <div id="otroAlergia${index}" style="display:none;">
      <label>Especifique otra alergia</label>
      <input type="text" name="otro_alergia[]" maxlength="50">
    </div>
  `;
  container.insertBefore(newItem, container.lastElementChild);
}


function mostrarOtro(select, idCampo) {
  const campo = document.getElementById(idCampo);
  campo.style.display = select.value === 'Otro' ? 'block' : 'none';
}
