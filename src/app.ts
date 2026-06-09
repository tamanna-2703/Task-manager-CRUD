import { OpenAPIHono } from "@hono/zod-openapi";
import {cors} from 'hono/cors';
import { prettyJSON } from "hono/pretty-json";
import {logger as honologger} from 'hono/logger';

export function createApp(){
const app = new OpenAPIHono();

app.use('*', honologger())
app.use('*', prettyJSON())
app.use (
  '*',
  cors({
    origin:['http://localhost:3300'],
    credentials:true,
  })
)

return app

}