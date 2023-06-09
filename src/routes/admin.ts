import express from "express";

import { main } from "../handlers/adminHandler";
const AdminRouter = express.Router();

AdminRouter.get("/", main);
export default AdminRouter;
