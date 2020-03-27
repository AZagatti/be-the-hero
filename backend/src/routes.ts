import { Router } from "express";

import OngController from "./controllers/OngController";
import IncidentController from "./controllers/IncidentController";
import ProfileController from "./controllers/ProfileController";
import SessionController from "./controllers/SessionController";

import OngValidator from "./validators/OngValidator";
import ProfileValidator from "./validators/ProfileValidator";
import IncidentValidator from "./validators/IncidentValidator";

const routes = Router();

routes.post("/sessions", SessionController.store);

routes.get("/ongs", OngController.index);

routes.post("/ongs", OngValidator.store, OngController.store);

routes.get("/incidents", IncidentValidator.index, IncidentController.index);
routes.post("/incidents", IncidentValidator.store, IncidentController.store);

routes.delete(
  "/incidents/:id",
  IncidentValidator.delete,
  IncidentController.delete
);

routes.get("/profile", ProfileValidator.index, ProfileController.index);

export default routes;
