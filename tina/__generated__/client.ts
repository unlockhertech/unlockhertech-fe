import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '2c585d925306d419ad60010e2a2a898d312d8105', queries,  });
export default client;
  