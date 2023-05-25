-- CreateTable
CREATE TABLE "Buses" (
    "id" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "anio" INTEGER NOT NULL,
    "id_chofer" TEXT,

    CONSTRAINT "Buses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gasto" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" MONEY NOT NULL,
    "id_bus" TEXT,

    CONSTRAINT "Gasto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingreso" (
    "id" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" MONEY NOT NULL,
    "id_bus" TEXT,

    CONSTRAINT "Ingreso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chofer" (
    "dni" VARCHAR(10) NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "telefono" VARCHAR(10) NOT NULL,
    "dirrecion" TEXT NOT NULL,
    "correo" TEXT NOT NULL,

    CONSTRAINT "Chofer_pkey" PRIMARY KEY ("dni")
);

-- CreateIndex
CREATE UNIQUE INDEX "Buses_placa_key" ON "Buses"("placa");

-- AddForeignKey
ALTER TABLE "Buses" ADD CONSTRAINT "Buses_id_chofer_fkey" FOREIGN KEY ("id_chofer") REFERENCES "Chofer"("dni") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gasto" ADD CONSTRAINT "Gasto_id_bus_fkey" FOREIGN KEY ("id_bus") REFERENCES "Buses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ingreso" ADD CONSTRAINT "Ingreso_id_bus_fkey" FOREIGN KEY ("id_bus") REFERENCES "Buses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
