import { Request, Response } from "express";
import connection from "../database";

export default {
  async index(req: Request, res: Response) {
    const { page = 1 } = req.query;

    const [count] = await connection("incidents").count();

    const incidents = await connection("incidents")
      .join("ongs", "ongs.id", "=", "incidents.ong_id")
      .limit(5)
      .offset((page - 1) * 5)
      .select([
        "incidents.*",
        "ongs.name",
        "ongs.email",
        "ongs.whatsapp",
        "ongs.city",
        "ongs.uf"
      ]);

    res.header("X-Total-Count", count["count(*)"]);

    return res.json(incidents);
  },

  async store(req: Request, res: Response) {
    const { title, description, value } = req.body;
    const ong_id = req.headers.authorization;

    if (!title || !description || !value) {
      return res.status(400).json({ error: "Missing required body fields" });
    }

    if (!ong_id) {
      return res.status(401).json({ error: "Missing required ONG id header" });
    }

    const ong = await connection("ongs")
      .where("ongs.id", ong_id)
      .first();

    if (!ong) {
      return res.status(400).json({ error: "Invalid ONG id" });
    }

    const [id] = await connection("incidents").insert({
      title,
      description,
      value,
      ong_id
    });

    return res.json({ id });
  },

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const ong_id = req.headers.authorization;

    const incidentExists = await connection("incidents")
      .where("incidents.id", id)
      .first();

    if (!incidentExists) {
      return res.status(400).json({ error: "Invalid incident id" });
    }

    const incident = await connection("incidents")
      .where("id", id)
      .select("ong_id")
      .first();

    if (incident.ong_id !== ong_id) {
      return res.status(401).json({ error: "Operation not permitted. " });
    }

    await connection("incidents")
      .where("id", id)
      .delete();

    return res.status(204).send();
  }
};
