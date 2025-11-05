import { Router } from "express";


const routes=Router();
routes.get('/',(req,res)=>{
    res.json({messages:'Hello, World!'});
});

export default routes;