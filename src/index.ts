import createInternalServer from './internalMongo';
import { createExternalServer } from './externalMongo';
require('dotenv').config({ path: ['.env.local', '.env'] })


// Main function to decide which setup to use
async function main(app?: any, mongoConnection?: any) {
  console.log('main :: process.env.IS_MONGO_CONNECTION_INTERNAL:', process.env.IS_MONGO_CONNECTION_INTERNAL)
  if (process.env.IS_MONGO_CONNECTION_INTERNAL === 'false') {
    await createExternalServer(app, mongoConnection);
  } else {
    createInternalServer();
  }
}

if (process.env.IS_MONGO_CONNECTION_INTERNAL === 'true') {
  main()
}

// Export the main function to allow passing `app` and `mongoConnection` externally
export { main };