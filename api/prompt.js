import {boardPrompt,CONSTITUTION,ROLES} from "../lib/vinf.js";
export default function handler(req,res){
 if(req.method!=="POST") return res.status(405).json({error:"POST required"});
 try{
  const {decision,context="",evidence=""}=req.body||{};
  return res.status(200).json({architecture:"V∞",roles:Object.keys(ROLES),constitution:CONSTITUTION,prompt:boardPrompt({decision,context,evidence})});
 }catch(e){return res.status(400).json({error:e.message});}
}
