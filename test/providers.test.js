import test from "node:test";
import assert from "node:assert/strict";
import {providerRegistry} from "../lib/provider-registry.js";

test("registry contains only zero-cost candidates",()=>{
 const ps=providerRegistry();
 assert.ok(ps.length>=2);
 assert.ok(ps.every(p=>p.costClass==="free"));
});

test("adapter fails closed without secret",async()=>{
 const p=providerRegistry()[0];
 await assert.rejects(()=>p.invoke({prompt:"x",apiKey:""}),/OPENROUTER_API_KEY missing/);
});

test("adapter records actual routed model for audit",async()=>{
 const p=providerRegistry()[2];
 const fetchImpl=async()=>({ok:true,status:200,json:async()=>({model:"example/free-model",choices:[{message:{content:"ok"}}]})});
 const x=await p.invoke({prompt:"x",apiKey:"test",fetchImpl});
 assert.equal(x.actualModel,"example/free-model");
 assert.equal(x.text,"ok");
});
