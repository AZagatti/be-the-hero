import { Request, Response } from "express";
import crypto from "crypto";

import connection from "../database";

export default {
  async index(req: Request, res: Response) {
    const ongs = await connection("ongs").select("*");

    return res.json(ongs);
  },

  async store(req: Request, res: Response) {
    const { name, email, whatsapp, city, uf } = req.body;

    const id = crypto.randomBytes(4).toString("HEX");

    await connection("ongs").insert({
      id,
      name,
      email,
      whatsapp,
      city,
      uf
    });

    return res.json({ id });
  }
};
