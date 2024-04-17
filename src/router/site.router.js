import express from "express";
import SiteControllers from "../app/controllers/SiteControllers.js";

const router = express.Router();

router.use('/', SiteControllers.showhome);


export default router;
