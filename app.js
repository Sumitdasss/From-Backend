import express from "express"
import cors from "cors"
import Partisepants from "./routs/Allrouts.js"
const app =express()

app.use(cors())
app.use(express.json())

app.use("/api/Partisepents",Partisepants)
app.use("/api/getTshrt",Partisepants)
app.use("/api/admin",Partisepants)











export default app