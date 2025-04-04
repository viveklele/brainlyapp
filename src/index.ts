import express from 'express';
import jwt from 'jsonwebtoken';
import { UserModel, ContentModel } from './db';
import { userMiddleware } from './middleware';
import { JWT_PASSWORD } from './config';

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    await UserModel.create({
        username: username,
        password: password
    })

    res.json({
        message: "user sign up successfully"
    })
})

app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await UserModel.findOne({
        username,
        password    
    })
    if(existingUser){
        const token = jwt.sign({
            id : existingUser._id
        }, JWT_PASSWORD)

        res.json({
            token
        }) 
    } else{
        res.status(403).json({
            message: "Invalid username or password"
        })
    }
})

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    await ContentModel.create({
        link,
        type,
        title: req.body.title,
        // @ts-ignore
        userId: req.userId,
        tags: []
    })

    res.json({
        message: "Content added"
    })
    
})
app.get("/api/v1/content",userMiddleware, async (req, res) => {
    // @ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId,
    }).populate("userId")
    res.json({
        content
    })
})

app.post("/api/v1/brain/share", (req, res) => {

})

app.post("/api/v1/brain/:shareLink", (req, res) => {

})

app.listen(3000); 