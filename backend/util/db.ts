import Knex from "knex";
import knexConfigs from "../knexfile";
import env from "./env";

export const knex = Knex(knexConfigs[env.NODE_ENV]);
