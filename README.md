## Catálogo RUAC – BLAM_catalogo

### Descripción General

El presente catálogo forma parte del **Sistema RUAC (Registro Único de Animales de Compañía)**.
Contiene la información base para poblar las tablas del modelo de datos que gestionan la información de cada animal registrado, sus características, salud, coloración y tipo de identificación.

Los archivos `.csv` están organizados según las entidades principales del modelo relacional mostrado en el diagrama:

* **Animal:** Datos generales de cada animal (nombre, especie, sexo, color, tipo, etc.).
* **IdentificadorAnimal:** Información del tipo y valor del identificador oficial.
* **SaludAnimal:** Registra esterilización, vacunas y fechas relacionadas.
* **ColorCombination:** Relación entre colores del animal.
* **Fotografía:** Enlace a archivos multimedia asociados.

Cada archivo CSV corresponde a un subconjunto de los campos de las tablas del modelo relacional.


### Archivos Incluidos

| Archivo                        | Descripción                                        |
| ------------------------------ | -------------------------------------------------- |
| `animal_colorojos.csv`         | Colores de ojos del animal                         |
| `animal_colorprincipal.csv`    | Color principal del animal                         |
| `animal_especie.csv`           | Especie del animal                                 |
| `animal_funcion.csv`           | Función o rol del animal (compañía, guardia, etc.) |
| `animal_llegomediante.csv`     | Medio por el cual llegó el animal                  |
| `animal_patronpelaje.csv`      | Patrón del pelaje del animal                       |
| `animal_rgato.csv`             | Registro de animales tipo gato                     |
| `animal_rperro.csv`            | Registro de animales tipo perro                    |
| `animal_sexo.csv`              | Catálogo de sexos                                  |
| `animal_tipo.csv`              | Tipos de animales (gato, perro, etc.)              |
| `colorcombination_color.csv`   | Combinaciones de colores                           |
| `identificadoranimal_tipo.csv` | Tipos de identificadores (chip, tatuaje, etc.)     |
| `saludanimal_vacuna.csv`       | Catálogo de vacunas aplicadas o por aplicar        |


### Estructura del Modelo de Datos

El modelo relacional incluye las siguientes tablas principales:

* `Animal`
* `IdentificadorAnimal`
* `SaludAnimal`
* `ColorCombination`
* `Fotografia`

Cada tabla está relacionada mediante la clave primaria `id_Animal`.


### Instrucciones para Importar el Catálogo en PostgreSQL (Linux)

> **Requisitos previos:**
>
> * Tener instalado PostgreSQL
> * Contar con un usuario con permisos para crear bases y tablas
> * Ubicar los archivos `.csv` en la carpeta `/home/usuario/BLAM_catalogo/`


#### Crear la base de datos

```bash
sudo -u postgres psql
CREATE DATABASE ruac_db;
\q
```

#### Conectarse a la base de datos

```bash
psql -U postgres -d ruac_db
```

#### Crear las tablas

```sql

-- Tabla Animal
CREATE TABLE Animal (
  id_Animal SERIAL PRIMARY KEY,
  nombre_Animal VARCHAR(120),
  especie_Animal VARCHAR(10),
  tipo_Animal VARCHAR(120),
  raza_Animal VARCHAR(120),
  sexo_Animal VARCHAR(15),
  edad_anios_Animal INTEGER,
  edad_meses_Animal INTEGER,
  domicilio_anios_Animal INTEGER,
  domicilio_meses_Animal INTEGER,
  llego_mediante_Animal VARCHAR(255),
  funcion_Animal VARCHAR(50),
  color_principal_Animal VARCHAR(50),
  patron_pelaje_Animal VARCHAR(50),
  color_ojos_Animal VARCHAR(50),
  ruac_clave_Animal VARCHAR(50)
);

-- Tabla IdentificadorAnimal
CREATE TABLE IdentificadorAnimal (
  id_IdentificadorAnimal SERIAL PRIMARY KEY,
  tipo_IdentificadorAnimal VARCHAR(50),
  valor_IdentificadorAnimal VARCHAR(255),
  id_Animal INTEGER REFERENCES Animal(id_Animal)
);

-- Tabla SaludAnimal
CREATE TABLE SaludAnimal (
  id_SaludAnimal SERIAL PRIMARY KEY,
  esterilizado_SaludAnimal BOOLEAN,
  antirrabica_SaludAnimal BOOLEAN,
  otra_vacunacion_SaludAnimal BOOLEAN,
  fecha_aprox_esterilizacion_SaludAnimal DATE,
  fecha_aprox_antirrabica_SaludAnimal DATE,
  fecha_aprox_otra_vacunacion_SaludAnimal DATE,
  id_Animal INTEGER REFERENCES Animal(id_Animal)
);

-- Tabla ColorCombination
CREATE TABLE ColorCombination (
  id_ColorCombinacion SERIAL PRIMARY KEY,
  color_Combinacion VARCHAR(50),
  id_Animal INTEGER REFERENCES Animal(id_Animal)
);

-- Tabla Fotografia
CREATE TABLE Fotografia (
  id_Fotografia SERIAL PRIMARY KEY,
  tipo_Fotografia VARCHAR(50),
  ruta_archivo_Fotografia VARCHAR(500),
  id_Animal INTEGER REFERENCES Animal(id_Animal)
);
```

#### Importar los datos desde los archivos CSV

Asumiendo que tus archivos `.csv` están en `/home/usuario/BLAM_catalogo/`, usa los siguientes comandos en **psql**:

```sql

-- Importar catálogos
\copy Animal(color_ojos_Animal) FROM '/home/usuario/BLAM_catalogo/animal_colorojos.csv' CSV HEADER;
\copy Animal(color_principal_Animal) FROM '/home/usuario/BLAM_catalogo/animal_colorprincipal.csv' CSV HEADER;
\copy Animal(especie_Animal) FROM '/home/usuario/BLAM_catalogo/animal_especie.csv' CSV HEADER;
\copy Animal(funcion_Animal) FROM '/home/usuario/BLAM_catalogo/animal_funcion.csv' CSV HEADER;
\copy Animal(llego_mediante_Animal) FROM '/home/usuario/BLAM_catalogo/animal_llegomediante.csv' CSV HEADER;
\copy Animal(patron_pelaje_Animal) FROM '/home/usuario/BLAM_catalogo/animal_patronpelaje.csv' CSV HEADER;
\copy Animal(sexo_Animal) FROM '/home/usuario/BLAM_catalogo/animal_sexo.csv' CSV HEADER;
\copy Animal(tipo_Animal) FROM '/home/usuario/BLAM_catalogo/animal_tipo.csv' CSV HEADER;

-- Importar relaciones
\copy ColorCombination(color_Combinacion) FROM '/home/usuario/BLAM_catalogo/colorcombination_color.csv' CSV HEADER;
\copy IdentificadorAnimal(tipo_IdentificadorAnimal) FROM '/home/usuario/BLAM_catalogo/identificadoranimal_tipo.csv' CSV HEADER;
\copy SaludAnimal(antirrabica_SaludAnimal) FROM '/home/usuario/BLAM_catalogo/saludanimal_vacuna.csv' CSV HEADER;

-- Razas de perros
\copy Animal(raza_Animal) FROM '/home/usuario/BLAM_catalogo/animal_rperro.csv' CSV HEADER;
-- Razas de gatos
\copy Animal(raza_Animal) FROM '/home/usuario/BLAM_catalogo/animal_rgato.csv' CSV HEADER;

```

#### Verificar la carga de datos

```sql
SELECT COUNT(*) FROM Animal;
SELECT COUNT(*) FROM SaludAnimal;
```