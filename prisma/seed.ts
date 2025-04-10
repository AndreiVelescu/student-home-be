import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const caminsData = [
  {
    adress: "Camin address 1",
    name: "Camin name 1",
    description: "Camin description 1",
    capacity: 100,
  },
  {
    adress: "Camin address 2",
    name: "Camin name 2",
    description: "Camin description 2",
    capacity: 150,
  },
  {
    adress: "Camin address 3",
    name: "Camin name 3",
    description: "Camin description 3",
    capacity: 200,
  },
];

const camere = {
  "Camin name 1": [1, 2, 3, 4, 5],
  "Camin name 2": [1, 2, 3, 4, 5, 6],
  "Camin name 3": [1, 2, 3, 4, 5, 6, 7],
};

async function main() {
  // Crearea căminelor
  await prisma.camin.createMany({
    data: caminsData,
  });

  // Obținerea căminelor create
  const camins = await prisma.camin.findMany();

  // Crearea camerelor pentru fiecare cămin
  const addCameraPromises = camins.reduce((acc, cam) => {
    const cameras = camere[cam.name!]; // Obține camerele pentru acest cămin
    if (!cameras) return acc; // Dacă nu există camere pentru acest cămin, sărim peste

    // Crearea camerelor
    const cameraPromises = cameras.map((cameraId) => {
      return prisma.camera.create({
        data: {
          cameraNumber: `Camera ${cameraId}`, // Adăugăm un nume pentru cameră
          Camin: {
            connect: { id: cam.id }, // Conectăm camera la căminul respectiv
          },
          capacity: 2, // Poți adăuga și alte câmpuri aici dacă sunt necesare
        },
      });
    });

    return [...acc, ...cameraPromises];
  }, []);

  // Executarea promisiunilor de creare a camerelor
  await Promise.all(addCameraPromises);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
