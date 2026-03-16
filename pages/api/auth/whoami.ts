import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { SERVER_ADRESS } from "@/config.json";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const response = await axios.get(`${SERVER_ADRESS}/whoami`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.status(response.status).json(response.data);
  } catch (err: any) {
    const status = err.response?.status ?? 500;
    const data = err.response?.data ?? { message: "Internal server error" };
    return res.status(status).json(data);
  }
}
