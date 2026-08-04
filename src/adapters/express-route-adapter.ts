import { Request, Response } from "express";
import { Controller, HttpRequest } from "../protocols";
const adaptRoute=(controller:Controller)=>async(req:Request,res:Response)=>{
 const httpRequest:HttpRequest={body:req.body,params:req.params,pathParams:req.params,query:req.query,headers:req.headers};
 try{const r=await controller.handle(httpRequest);if(r.statusCode===204)return res.status(204).end();return res.status(r.statusCode).json(r.body);}catch(error){console.error(error);return res.status(500).json({message:"Erro interno do servidor"});}
};
export default adaptRoute;
