import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { SERVER_ADRESS } from "@/config.json";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { page = "1", per_page = "20" } = req.query;

  try {
    const response = await axios.get(`${SERVER_ADRESS}/feed`, {
      params: { page, per_page },
    });
    return res.status(response.status).json(response.data);
  } catch (err: any) {
    const status = err.response?.status ?? 500;
    const data = err.response?.data ?? { message: "Internal server error" };
    return res.status(status).json(data);
  }
}
