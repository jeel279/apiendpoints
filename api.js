const express = require('express')
const router = express.Router()
const auth = require('./auth')
const db = require('./db')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const encrypt = require('bcrypt')

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended:false}))

router.get('/',(req,res)=>{
    res.send("Hello")
})

const [users,posts,comments] = (process.env.NODE_ENV=="test") ? ['test.users','test.posts','test.comments'] : ['public.users','public.posts','public.comment'];

router.post('/authenticate',async(req,res)=>{
    try{
        const rw = await db(`SELECT * FROM ${users} WHERE email='${req.body.email}'`)
        if(rw.length==0){
            res.sendStatus(401)
            return;
        }
        encrypt.compare(req.body.password,rw[0].password).then(rs=>{
            if(!rs){
                res.sendStatus(401)
            }else{
        const token = jwt.sign(
            { user_id: rw[0]["user_id"], email : rw[0]["email"] },
            "VALUE",
            {
            expiresIn: "2h",
            }
        );
            ////console.log(token)
            res.send({token : token})
        }
        }).catch(err=>{
            res.sendStatus(500)
        }) 

    }catch(err){
        res.sendStatus(500)
    }
    
})





router.post('/follow/:id',auth,async(req,res)=>{
    
    try{
    const rw = await db(`SELECT following FROM ${users} WHERE user_id='${req.user.user_id}'`)
    // ////console.log(rw)

    if(req.params.id == req.user.user_id){
        res.sendStatus(200)
        return;
    }
    
    if(Object.keys(rw[0].following).includes(req.params.id)){
        res.sendStatus(200)
        return
    }
        const reqQ = await db(`SELECT count(user_id) FROM ${users} WHERE user_id=${req.params.id}`)
        
        if(reqQ[0].count==0){
            res.sendStatus(404)
            return;
        }
        await db(`UPDATE ${users} SET followers=followers::jsonb || '{"${req.user.user_id}":null}' WHERE user_id=${req.params.id}`)
        await db(`UPDATE ${users} SET following=following::jsonb || '{"${req.params.id}":null}' WHERE user_id=${req.user.user_id}`)
        res.sendStatus(200)
    
    }catch(err){
        ////console.log(err)
        res.sendStatus(500)
    }
    
})

router.post('/unfollow/:id',auth,async(req,res)=>{
    
    try{
    const rw = await db(`SELECT following FROM ${users} WHERE user_id='${req.user.user_id}'`)
    // ////console.log(rw)

    if(req.params.id == req.user.user_id){
        res.sendStatus(200)
        return;
    }
    const reqQ = await db(`SELECT count(user_id) FROM ${users} WHERE user_id=${req.params.id}`)
        
        if(reqQ[0].count==0){
            res.sendStatus(404)
            return;
        }
    if(!Object.keys(rw[0].following).includes(req.params.id)){
        res.sendStatus(200)
        return
    }
        
        await db(`UPDATE ${users} SET followers=followers - '${parseInt(req.user.user_id)}' WHERE user_id=${req.params.id}`)
        await db(`UPDATE ${users} SET following=following - '${parseInt(req.params.id)}' WHERE user_id=${req.user.user_id}`)
        res.sendStatus(200)
    
    }catch(err){
        ////console.log(err)
        res.sendStatus(500)
    }
    
})


router.get('/user/',auth,async(req,res)=>{
    const rw = await db(`SELECT * from ${users} where user_id=${req.user.user_id}`)
    delete rw[0].password;
    rw[0].following = Object.keys(rw[0].following).length
    rw[0].followers = Object.keys(rw[0].followers).length
    res.json(rw[0])
})

router.post('/posts',auth,async(req,res)=>{
    try{
        const [title,description] = [req.body.title,req.body.description];
        if(title!=null && title.trim()==""){
            res.sendStatus(400);
            return;
        }
        const uid = req.user.user_id
        const addQ = await db(`INSERT INTO ${posts} (title,description,created_at,posted_by,likes) VALUES ('${title}','${description}',${(new Date()).getTime()},${uid},'{}');SELECT * FROM ${posts} WHERE posted_by=${uid} ORDER BY created_at DESC LIMIT 1;`)
        //console.log(addQ)
        addQ[0].likes = Object.keys(addQ[0].likes).length
        res.send(addQ[0]);
        return;
    }catch(err){
        //console.log(err);
        res.sendStatus(500)
    }
})

router.delete('/posts/:id',auth,async(req,res)=>{
    ////console.log(req.body)
    try{
        await db(`DELETE FROM ${comments} WHERE post_id=${req.params.id};`);
        await db(`DELETE FROM ${posts} WHERE posted_by=${req.user.user_id} AND id=${req.params.id};`);
        res.sendStatus(200)
    }catch(err){
        ////console.log(err)
        res.sendStatus(404)
    }
})

router.post('/like/:id',auth,async(req,res)=>{
    try{
        await db(`UPDATE ${posts} SET likes=likes::jsonb || '{"${req.user.user_id}":null}' WHERE id=${req.params.id};`);
        res.sendStatus(200)
    }catch(err){
        ////console.log(err)
        res.sendStatus(500)
    }
})

router.post('/unlike/:id',auth,async(req,res)=>{
    try{
        await db(`UPDATE ${posts} SET likes=likes - '${parseInt(req.user.user_id)}' WHERE id=${req.params.id};`);
        res.sendStatus(200)
    }catch(err){
        ////console.log(err)
        res.sendStatus(500)
    }
})

router.post('/comment/:id',auth,async(req,res)=>{
    try{
        const comment = req.body.comment;
        if(comment!=null && comment.trim()==""){
            res.sendStatus(400);
            return;
        }
        const reqQ = await db(`SELECT count(id) FROM ${posts} WHERE id=${req.params.id}`)
        
        if(reqQ[0].count==0){
            res.sendStatus(400)
            return;
        }

        const uid = req.user.user_id
        const addQ = await db(`INSERT INTO ${comments} (content,post_id,user_id) VALUES ('${comment}',${req.params.id},${uid});SELECT * FROM ${comments} WHERE user_id=${uid} AND post_id=${req.params.id} ORDER BY comment_id DESC LIMIT 1;`)
        ////console.log(addQ)
        delete addQ[0]["user_id"]
        delete addQ[0]["post_id"]
        delete addQ[0]["content"]
        res.send(addQ[0]);
        return;
    }catch(err){
        ////console.log(err);
        res.sendStatus(500)
    }
})

router.get('/posts/:id',async(req,res)=>{
    try{
        const resp = await db(`SELECT * from ${posts} WHERE id=${req.params.id};`);
        resp[0].likes = Object.keys(resp[0].likes).length
        const resp2 = await db(`SELECT count(comment_id) from ${comments} WHERE post_id=${req.params.id};`)
        res.send({likes : resp[0].likes,comments : resp2[0].count})
    }catch(err){
        ////console.log(err)
        res.sendStatus(500)
    }
})

router.get('/all_posts',auth,async(req,res)=>{
    try{
        const resp = await db(`SELECT * from ${posts} WHERE posted_by=${req.user.user_id};`);
        ////console.log(`SELECT * from posts WHERE posted_by=${req.user.user_id};`)
        // resp[0].likes = Object.keys(resp[0].likes).length
        // const resp2 = await db(`SELECT count(comment_id) from comments WHERE post_id=${req.params.id};`)
        const rresp = resp;
        // //console.log(resp)
        for(let v of rresp){
            v["likes"] = Object.keys(v.likes).length;
            v["created_at"] = new Date(parseInt(v.created_at)).toLocaleString()
            v["comments"] = await db(`SELECT comment_id,content AS comment FROM ${comments} WHERE post_id=${v.id} ORDER BY comment_id ASC;`)
            delete v["posted_by"]
            // delete v[]
        }
        //console.log(rresp)
        res.send(rresp)
    }catch(err){
        //console.log(err)
        res.sendStatus(500)
    }
})

module.exports = router