import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { SERVER_ADRESS } from "@/config.json";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies?.token;

  if (req.method === "POST") {
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    try {
      const response = await axios.post(`${SERVER_ADRESS}/tweet`, req.body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.status(response.status).json(response.data);
    } catch (err: any) {
      const status = err.response?.status ?? 500;
      const data = err.response?.data ?? { message: "Internal server error" };
      return res.status(status).json(data);
    }
  }

  if (req.method === "GET") {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ message: "Missing user_id" });
    }
    try {
      const response = await axios.get(`${SERVER_ADRESS}/tweets`, {
        params: { user_id },
      });
      return res.status(response.status).json(response.data);
    } catch (err: any) {
      const status = err.response?.status ?? 500;
      const data = err.response?.data ?? { message: "Internal server error" };
      return res.status(status).json(data);
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
