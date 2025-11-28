import express from 'express'
import Thread from "../models/Thread.js"
import getOpenAiAPIResponse from "../utils/openai.js"


const router = express.Router();

//test route
router.post("/test", async(req, res)=>{
    try{
        const thread = new Thread({
            threadId: "my chat",
            title: "how are you"
        });
        const response = await thread.save()
        res.send(response)
    }catch(err){
        res.status(500).json({err: "Failed to save in DB"})
    }
});


//get all of threads 

router.get("/thread", async (req, res)=>{
    try {
        
        const threads = await Thread.find({}).sort({updatedAt: -1})
        res.json(threads)

    } catch (err) {
        console.log(err)
        res.status(500).json({err: "Failed to fetch thread"})
    }
});

//perticular thread 

router.get("/thread/:threadId", async (req, res)=>{
    const {threadId} = req.params;

    try {
        const thread = await Thread.findOne({threadId});
        if(!thread){
            return res.status(404).json({error: "Thread not found"})
        }
        return res.json(thread.message)
        // console.log(thread.message)
    } catch (err) {
        console.log(err)
        res.status(500).json({err: "Failed to fetch chat"})
    }
});

//delete thread 

router.delete("/thread/:threadId", async (req, res)=>{
    const {threadId} = req.params;

    try {
        const deletedThread = await Thread.findOneAndDelete({threadId})
        if(!deletedThread){
            return res.status(404).json({error: "Thread not found to delete"})
        }

        return res.status(200).json({success: "Thread was deleted successfully"})

    } catch (err) {
        res.status(500).json({err: "Thread failed to delete chat"})
    }
});

// chat route

router.post("/chat", async (req, res)=>{
    const {threadId, message} = req.body;
    
    if(!threadId || !message){
        return res.status(400).json({error: "missing required fields"})
    }

    try {
        let thread = await Thread.findOne({threadId})

        if(!thread){
            //create new thread
            thread =  new Thread({
                threadId,
                title: message,
                message: [{role: "user", content: message}]
            })
        }else{
            //add user message
             thread.message.push({role: "user", content: message})
        }

        //call api and reply
        const assistantReply = await getOpenAiAPIResponse(message)

        //add assistant message

        thread.message.push({role: "assistant", content: assistantReply})
        thread.updatedAt = new Date();
        
        //save thread
        await thread.save();

        //send to frontend
        res.json({reply: assistantReply})
    } catch (err) {
        console.log(err)
        res.status(500).json({err: "something went wrong"})
    }
})


export default router;