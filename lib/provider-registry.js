const OPENROUTER_URL="https://openrouter.ai/api/v1/chat/completions";

function extractText(json){
 const c=json?.choices?.[0]?.message?.content;
 if(typeof c==="string") return c;
 if(Array.isArray(c)) return c.map(x=>x?.text||"").join("");
 return "";
}

export function openRouterProvider({id,model}){
 return {
  id,model,costClass:"free",
  async invoke({prompt,apiKey=process.env.OPENROUTER_API_KEY,fetchImpl=fetch}){
   if(!apiKey) throw new Error("OPENROUTER_API_KEY missing");
   const r=await fetchImpl(OPENROUTER_URL,{method:"POST",headers:{
    Authorization:`Bearer ${apiKey}`,
    "Content-Type":"application/json",
    "HTTP-Referer":"https://vercel.com",
    "X-Title":"Shadow AI Board V∞"
   },body:JSON.stringify({model,messages:[{role:"user",content:prompt}],temperature:0.2})});
   const json=await r.json().catch(()=>({}));
   if(!r.ok) throw new Error(`OpenRouter ${r.status}: ${json?.error?.message||"request failed"}`);
   return {provider:id,requestedModel:model,actualModel:json?.model||null,text:extractText(json)};
  }
 };
}

// Current free candidates are explicit so diversity can be measured.
// openrouter/free is retained as fallback only: its random routing is unsuitable
// for controlled independence experiments because model identity is not chosen ex ante.
export function providerRegistry(){
 return [
  openRouterProvider({id:"openrouter-nemotron-free",model:"nvidia/nemotron-3-ultra-550b-a55b:free"}),
  openRouterProvider({id:"openrouter-gemma-free",model:"google/gemma-4-31b-it:free"}),
  openRouterProvider({id:"openrouter-free-fallback",model:"openrouter/free"})
 ];
}
