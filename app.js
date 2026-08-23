import express from "express"
import cors from "cors"
import Partisepants from "./routs/Allrouts.js"
const app =express()

app.use(
  cors({
    origin: [
      "https://from-bay-zeta.vercel.app",
      "http://localhost:3000",
    ],
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);
app.use(express.json())

app.use("/api/Partisepents",Partisepants)
app.use("/api/getTshrt",Partisepants)
app.use("/api/admin",Partisepants)











export default app