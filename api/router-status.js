import {DEFAULT_MODE,assignRoles} from "../lib/router.js";
import {providerRegistry} from "../lib/provider-registry.js";
import {ROLES} from "../lib/vinf.js";
export default function handler(req,res){
 const providers=providerRegistry();
 const routing=assignRoles(Object.keys(ROLES),providers,{mode:DEFAULT_MODE});
 res.status(200).json({ok:true,mode:DEFAULT_MODE,paidAuthorized:false,configuredProviders:providers.map(({id,model,costClass})=>({id,model,costClass})),routing});
}
