import {providerRegistry} from "../lib/provider-registry.js";

const SAFE_PROMPT="Reply with exactly FREE_ONLY_SMOKE_OK.";
const ALLOWED_MODELS=new Set([
 "nvidia/nemotron-3-ultra-550b-a55b:free",
 "google/gemma-4-31b-it:free",
 "openrouter/free"
]);

export default async function handler(req,res){
 if(req.method!=="POST"){
  res.setHeader("Allow","POST");
  return res.status(405).json({ok:false,error:"POST required"});
 }

 const providers=providerRegistry();
 const provider=providers[0];

 if(provider.costClass!=="free" || !ALLOWED_MODELS.has(provider.model)){
  return res.status(500).json({ok:false,mode:"FREE_ONLY",error:"Fail-closed: provider is not allowlisted as free"});
 }

 if(!process.env.OPENROUTER_API_KEY){
  return res.status(503).json({ok:false,mode:"FREE_ONLY",secretConfigured:false,error:"OPENROUTER_API_KEY missing"});
 }

 const started=Date.now();
 try{
  const out=await provider.invoke({prompt:SAFE_PROMPT});
  const actual=out.actualModel||null;
  // Never return prompt text, model output, authorization headers, or secret material.
  return res.status(200).json({
   ok:true,
   mode:"FREE_ONLY",
   paidAuthorized:false,
   secretConfigured:true,
   provider:provider.id,
   requestedModel:provider.model,
   actualModel:actual,
   latencyMs:Date.now()-started
  });
 }catch(error){
  return res.status(502).json({
   ok:false,
   mode:"FREE_ONLY",
   paidAuthorized:false,
   secretConfigured:true,
   provider:provider.id,
   requestedModel:provider.model,
   latencyMs:Date.now()-started,
   error:String(error?.message||error).slice(0,500)
  });
 }
}
