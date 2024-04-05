-- CreateTable
CREATE TABLE "sepcilities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "sepcilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctorSepcilities" (
    "specilitiesId" TEXT NOT NULL,
    "doctroId" TEXT NOT NULL,

    CONSTRAINT "doctorSepcilities_pkey" PRIMARY KEY ("specilitiesId","doctroId")
);

-- AddForeignKey
ALTER TABLE "doctorSepcilities" ADD CONSTRAINT "doctorSepcilities_specilitiesId_fkey" FOREIGN KEY ("specilitiesId") REFERENCES "sepcilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctorSepcilities" ADD CONSTRAINT "doctorSepcilities_doctroId_fkey" FOREIGN KEY ("doctroId") REFERENCES "doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
