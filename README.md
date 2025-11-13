# Catálogo RUAC - Registro Único de Animales de Compañía

Este catálogo implementa el **Modelo Relacional** del proyecto RUAC, que incluye las 5 tablas de datos transaccionales y 8 tablas auxiliares (catálogos) para estandarizar las opciones de los campos. En total, se crean **13 tablas**.

## Contenido del Catálogo

El archivo comprimido (`catalogos_RUAC.zip`) contiene los **13 archivos CSV** necesarios para poblar todas las tablas del modelo:

### 5 Archivos de Datos Transaccionales (Tablas principales):
1.  `Animal.csv`
2.  `SaludAnimal.csv`
3.  `ColorCombinacion.csv`
4.  `Fotografia.csv`
5.  `IdentificadorAnimal.csv`

### 8 Archivos de Listas de Catálogo (Tablas de soporte):
* `animal_especie.csv`
* `animal_sexo.csv`
* `animal_tipo.csv`
* `animal_funcion.csv`
* `animal_llegomediante.csv`
* `animal_patronpelaje.csv`
* `animal_rperro.csv`
* `animal_rgato.csv`
* `animal_colorojos.csv`
* `animal_colorprincipal.csv`
* `colorcombination_color.csv`
* `identificadoranimal_tipo.csv`
* `saludanimal_vacuna.csv`


## Comandos en Linux para Importación a PostgreSQL

### Paso 1: Conexión a la Base de Datos

Conéctate a la base de datos de destino (reemplaza `mi_usuario` y `mi_base`):

```bash
psql -U mi_usuario -d mi_base

-- TABLAS DE CATÁLOGO (Deben crearse primero para las referencias)

CREATE TABLE IdentificadorTipo (
    id_IdentificadorTipo INT PRIMARY KEY,
    nombre_IdentificadorTipo VARCHAR(50) NOT NULL
);

CREATE TABLE AnimalEspecie (
    id_AnimalEspecie INT PRIMARY KEY,
    nombre_AnimalEspecie VARCHAR(50) NOT NULL
);

CREATE TABLE AnimalSexo (
    id_AnimalSexo INT PRIMARY KEY,
    nombre_AnimalSexo VARCHAR(15) NOT NULL
);

CREATE TABLE AnimalTipo (
    id_AnimalTipo INT PRIMARY KEY,
    nombre_AnimalTipo VARCHAR(50) NOT NULL
);

CREATE TABLE AnimalFuncion (
    id_AnimalFuncion INT PRIMARY KEY,
    nombre_AnimalFuncion VARCHAR(50) NOT NULL
);

CREATE TABLE MedioLlegada (
    id_MedioLlegada INT PRIMARY KEY,
    nombre_MedioLlegada VARCHAR(50) NOT NULL
);

CREATE TABLE PatronPelaje (
    id_PatronPelaje INT PRIMARY KEY,
    nombre_PatronPelaje VARCHAR(50) NOT NULL
);

CREATE TABLE ColorOjos (
    id_ColorOjos INT PRIMARY KEY,
    nombre_ColorOjos VARCHAR(50) NOT NULL
);

CREATE TABLE ColorPrincipal (
    id_ColorPrincipal INT PRIMARY KEY,
    nombre_ColorPrincipal VARCHAR(50) NOT NULL
);

CREATE TABLE Raza (
    id_Raza INT PRIMARY KEY,
    nombre_Raza VARCHAR(120) NOT NULL
);


-- TABLAS TRANSACCIONALES (Las 5 principales)

CREATE TABLE Animal (
    id_Animal INT PRIMARY KEY,
    nombre_Animal VARCHAR(120),
    id_AnimalEspecie INT NOT NULL,
    id_AnimalTipo INT,
    id_Raza INT,
    id_AnimalSexo INT,
    edad_anios_Animal SMALLINT,
    edad_meses_Animal SMALLINT,
    domicilio_anios_Animal SMALLINT,
    domicilio_meses_Animal SMALLINT,
    id_MedioLlegada INT,
    id_AnimalFuncion INT,
    id_ColorPrincipal INT,
    id_PatronPelaje INT,
    id_ColorOjos INT,
    fecha_registro_Animal DATE NOT NULL,
    FOREIGN KEY (id_AnimalEspecie) REFERENCES AnimalEspecie(id_AnimalEspecie),
    FOREIGN KEY (id_AnimalTipo) REFERENCES AnimalTipo(id_AnimalTipo),
    FOREIGN KEY (id_Raza) REFERENCES Raza(id_Raza),
    FOREIGN KEY (id_AnimalSexo) REFERENCES AnimalSexo(id_AnimalSexo),
    FOREIGN KEY (id_MedioLlegada) REFERENCES MedioLlegada(id_MedioLlegada),
    FOREIGN KEY (id_AnimalFuncion) REFERENCES AnimalFuncion(id_AnimalFuncion),
    FOREIGN KEY (id_ColorPrincipal) REFERENCES ColorPrincipal(id_ColorPrincipal),
    FOREIGN KEY (id_PatronPelaje) REFERENCES PatronPelaje(id_PatronPelaje),
    FOREIGN KEY (id_ColorOjos) REFERENCES ColorOjos(id_ColorOjos)
);

CREATE TABLE SaludAnimal (
    id_SaludAnimal INT PRIMARY KEY,
    id_Animal INT NOT NULL,
    esterilizado_SaludAnimal BOOLEAN,
    antirrabica_SaludAnimal BOOLEAN,
    otra_vacunacion_SaludAnimal BOOLEAN,
    fecha_aprox_esterilizacion_SaludAnimal DATE,
    fecha_aprox_antirrabica_SaludAnimal DATE,
    fecha_aprox_otra_vacunacion_SaludAnimal DATE,
    FOREIGN KEY (id_Animal) REFERENCES Animal(id_Animal)
);

CREATE TABLE ColorCombinacion (
    id_ColorCombinacion INT PRIMARY KEY,
    id_ColorPrincipal INT NOT NULL,
    id_Animal INT NOT NULL,
    FOREIGN KEY (id_ColorPrincipal) REFERENCES ColorPrincipal(id_ColorPrincipal),
    FOREIGN KEY (id_Animal) REFERENCES Animal(id_Animal)
);

CREATE TABLE Fotografia (
    id_Fotografia INT PRIMARY KEY,
    id_Animal INT NOT NULL,
    tipo_Fotografia VARCHAR(50),
    ruta_archivo_Fotografia VARCHAR(500) NOT NULL,
    FOREIGN KEY (id_Animal) REFERENCES Animal(id_Animal)
);

CREATE TABLE IdentificadorAnimal (
    id_IdentificadorAnimal INT PRIMARY KEY,
    id_Animal INT NOT NULL,
    id_IdentificadorTipo INT NOT NULL,
    valor_IdentificadorAnimal VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_Animal) REFERENCES Animal(id_Animal),
    FOREIGN KEY (id_IdentificadorTipo) REFERENCES IdentificadorTipo(id_IdentificadorTipo)
);

-- 1. Cargar las tablas de Catálogo
\copy IdentificadorTipo FROM 'identificadoranimal_tipo.csv' DELIMITER ',' CSV HEADER;
\copy AnimalEspecie FROM 'animal_especie.csv' DELIMITER ',' CSV HEADER;
\copy AnimalSexo FROM 'animal_sexo.csv' DELIMITER ',' CSV HEADER;
\copy AnimalTipo FROM 'animal_tipo.csv' DELIMITER ',' CSV HEADER;
\copy AnimalFuncion FROM 'animal_funcion.csv' DELIMITER ',' CSV HEADER;
\copy MedioLlegada FROM 'animal_llegomediante.csv' DELIMITER ',' CSV HEADER;
\copy PatronPelaje FROM 'animal_patronpelaje.csv' DELIMITER ',' CSV HEADER;
\copy ColorOjos FROM 'animal_colorojos.csv' DELIMITER ',' CSV HEADER;
\copy ColorPrincipal FROM 'animal_colorprincipal.csv' DELIMITER ',' CSV HEADER;
-- Las razas se cargan a la tabla Raza (asumiendo que los CSV tienen las columnas id_Raza, nombre_Raza)
\copy Raza FROM 'animal_rperro.csv' DELIMITER ',' CSV HEADER;
\copy Raza FROM 'animal_rgato.csv' DELIMITER ',' CSV HEADER;


-- 2. Cargar las 5 tablas Transaccionales (Animal debe ser la primera de este grupo)
\copy Animal FROM 'Animal.csv' DELIMITER ',' CSV HEADER;
\copy SaludAnimal FROM 'SaludAnimal.csv' DELIMITER ',' CSV HEADER;
\copy ColorCombinacion FROM 'colorcombination_color.csv' DELIMITER ',' CSV HEADER;
\copy Fotografia FROM 'Fotografia.csv' DELIMITER ',' CSV HEADER;
\copy IdentificadorAnimal FROM 'IdentificadorAnimal.csv' DELIMITER ',' CSV HEADER;
