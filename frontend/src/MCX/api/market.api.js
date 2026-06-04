import api from "./axios";

export const getAllCommodities = () =>
  api.get("/market/commodities");

export const getCommodityPrice = (symbol) =>
  api.get(`/market/${symbol}`);