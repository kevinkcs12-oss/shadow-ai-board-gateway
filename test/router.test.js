import test from "node:test";
import assert from "node:assert/strict";
import {assignRoles,eligibleProviders,DEFAULT_MODE} from "../lib/router.js";
const free={id:"free-a",model:"model-a",costClass:"free",invoke:async()=>({})};
const paid={id:"paid-a",model:"model-b",costClass:"paid",invoke:async()=>({})};

test("router defaults to FREE_ONLY",()=>assert.equal(DEFAULT_MODE,"FREE_ONLY"));
test("FREE_ONLY excludes paid providers",()=>assert.deepEqual(eligibleProviders([free,paid]).map(x=>x.id),["free-a"]));
test("paid mode fails closed without explicit authorization",()=>assert.throws(()=>eligibleProviders([paid],{mode:"PAID_AUTHORIZED"}),/explicit paid authorization/));
test("paid mode permits paid provider only with explicit authorization",()=>assert.deepEqual(eligibleProviders([paid],{mode:"PAID_AUTHORIZED",paidAuthorized:true}).map(x=>x.id),["paid-a"]));
test("no eligible provider returns unassigned roles rather than silently spending",()=>{const x=assignRoles(["bull","bear"],[paid]);assert.equal(x.assignments.length,0);assert.deepEqual(x.unassigned,["bull","bear"]);});
