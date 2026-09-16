export const ROUTING_MODES=Object.freeze({FREE_ONLY:"FREE_ONLY",PAID_AUTHORIZED:"PAID_AUTHORIZED"});
export const DEFAULT_MODE=ROUTING_MODES.FREE_ONLY;

export function validateProvider(p){
 if(!p||!p.id||!p.model) throw new Error("provider id and model required");
 if(typeof p.invoke!=="function") throw new Error("provider invoke function required");
 return p;
}

export function eligibleProviders(providers,{mode=DEFAULT_MODE,paidAuthorized=false}={}){
 if(mode===ROUTING_MODES.PAID_AUTHORIZED && !paidAuthorized) throw new Error("explicit paid authorization required");
 return providers.map(validateProvider).filter(p=>{
   if(mode===ROUTING_MODES.FREE_ONLY) return p.costClass==="free";
   return p.costClass==="free" || (p.costClass==="paid" && paidAuthorized);
 });
}

export function assignRoles(roles,providers,opts={}){
 const eligible=eligibleProviders(providers,opts);
 if(!eligible.length) return {assignments:[],unassigned:[...roles],reason:"no eligible providers"};
 return {assignments:roles.map((role,i)=>({role,providerId:eligible[i%eligible.length].id,model:eligible[i%eligible.length].model})),unassigned:[],reason:null};
}
