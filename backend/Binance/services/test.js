// const { SmartAPI, WebSocketV2 } = require("smartapi-javascript");
// const speakeasy = require("speakeasy");
// const axios = require("axios");

// const api = new SmartAPI({
//   api_key: process.env.MCX_API_KEY
// });

// async function test() {
//   try {
//     const totp = speakeasy.totp({
//       secret: process.env.MCX_TOTP_SECRET,
//       encoding: "base32"
//     });
//     const session = await api.generateSession(process.env.MCX_CLIENT_ID, process.env.MCX_PASSWORD, totp);

//     const data = await api.generateSession(process.env.MCX_CLIENT_ID, process.env.MCX_PASSWORD, totp);
//     // console.log("✅ Login success:", data);
//     // Fetch all MCX instruments
//   const instruments = await axios.get(
//     "https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json"
//   );

//   const futures = instruments.data.filter(
//   i => i.exch_seg === "MCX" && i.instrumenttype === "FUTCOM"
// );

// const ws = new WebSocketV2({
//     jwttoken: session.data.jwtToken,
//     apikey: process.env.MCX_API_KEY,
//     clientcode: process.env.MCX_CLIENT_ID,
//     feedtype: session.data.feedToken,
//   });
//   // console.log("Type:", typeof ws);
//   // console.log("Methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(ws)));
//   // console.log("Keys:", Object.keys(ws));

// // console.log(`Total MCX Futures: ${futures.length}`);
// // console.log("Sample:", futures.slice(0, 5));
//     return data;
//   } catch (err) {
//     console.error("❌ Error:", err);
//   }
// }

// test();

// module.exports = test;