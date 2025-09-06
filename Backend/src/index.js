import app from "./app.js"
import dotenv from "dotenv"
import { connectDB } from "./db/index.js";

dotenv.config({ path: "src/.env", override: true })

const port = process.env.PORT || 3000

connectDB()
.then(()=>{
    app.listen(port, () => {
        console.log(`Server is listening on Port ${port}`)
    })
})
.catch(err=>{
    console.log("Connection error:",err );
})
    