import test from "node:test";
import assert from "node:assert/strict";
import {boardPrompt,CONSTITUTION,ROLES} from "../lib/vinf.js";

test("V∞ constitution and adversarial board are complete",()=>{
 assert.equal(CONSTITUTION.length,15);
 assert.deepEqual(Object.keys(ROLES),["bull","bear","operator","customer","investor","disruptor","risk"]);
});

test("prompt requires a decision",()=>{
 assert.throws(()=>boardPrompt({decision:""}),/decision is required/);
});

test("prompt enforces independent evidence-first arbitration",()=>{
 const p=boardPrompt({decision:"Choose next B02 validation",context:"near-zero capital",evidence:"no replies yet"});
 for(const token of ["INDEPENDENCE RULE","correlated opinion","falsify","ASYMMETRY","OPPORTUNITY_COST","BOTTLENECK","AUTHORIZATION NEEDED"]) assert.match(p,new RegExp(token,"i"));
});

test("B01/B02 contexts remain data, not hidden policy",()=>{
 const a=boardPrompt({decision:"B01 voice choice",context:"faceless documentary",evidence:"voice 2 selected"});
 const b=boardPrompt({decision:"B02 pivot decision",context:"minimal customer contact",evidence:"no replies"});
 assert.match(a,/B01 voice choice/);
 assert.match(b,/B02 pivot decision/);
});
