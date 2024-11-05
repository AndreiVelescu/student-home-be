


import 'reflect-metadata';
import { disconnectDataLayer } from "../db";
import { getGraphqlSchema } from "../prisma/graphQlSchema";
import { startServer } from "./server";



async function main() {
    const schema = await getGraphqlSchema();
    await startServer(schema);
}



main().catch(async (e) => {
    console.error(e);
}).finally(async () => {
    await disconnectDataLayer();
})
