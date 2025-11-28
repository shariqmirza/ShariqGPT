import express from "express"
import 'dotenv/config'
import cors from 'cors'
import mongoose from "mongoose"
import Router from './routes/chat.js'

const app = express()
const PORT = 8080;

app.use(express.json())

app.use(
  cors({
    origin: "*", // start me * rakh lo, baad me front-end URL put kar sakte ho
  })
);

app.use("/api",Router)

app.listen(PORT, () => {
    console.log(`server is runnin on ${PORT}`);
    connectDB();
})




const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.DATABASE_CONNECTION_ID)
        console.log("Connected to Database");
    }catch(err){
        console.log("Failed to Connect Database", err)
    }
}


// app.post("/test", async (req, res) => { // jb koi user is route ko hit krega to wo iske ander jayga

//     const options = {
//         method: "POST", // request to the server
//         headers: { // information tag - ye puchega req se kidhr ja rhi ho kya kaam h - jese clg me guard puchte hn
//             "Content-Type": "application/json", // Open AI bro, jo data me bhej rha hu wo json format me h
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}` // ye api request h, meri lo isko key ki mdd se verify kr lo
//         },
//         body: JSON.stringify({ // HTTP request me body wo data hota h jo usr srvr - OpenAI API ko bhej raha h.
//             //json.stringify - ye js object ko json string me cnvrt krta h kiuki http req string me jati h and api ko json data chahiye. js obj nhi.
//             model: "gpt-4o-mini", // ye model use kro
//             input: req.body.input // user ne ye input bheja h
//         })
//     };

//     try {
//         const response = await fetch("https://api.openai.com/v1/responses", options); // openai ko req bhejo or jb tk reply nhi aye wait kro and jb reply aa jaye use response me daal do
//         const data = await response.json(); // response me string form me data locked h usko json me convert kro and jb tk cnvert nhi hota wait kro or data me daal do.
//         // console.log(data.output[0].content[0].text)
//         res.send(data.output[0].content[0].text);
//     } catch (err) {
//         console.log(err)
//     }
// })