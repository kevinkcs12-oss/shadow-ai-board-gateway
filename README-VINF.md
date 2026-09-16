# Shadow AI Board V∞

Isolated V∞ reconstruction on `vinf-native-board`. It does not replace production.

## Architecture
Seven adversarial roles: Bull, Bear, Operator, Customer, Investor, Disruptor, Risk Officer. Each uses the same V∞ constitution but a distinct mandate. Independent reasoning precedes synthesis. Consensus is not treated as empirical evidence.

## Endpoints
- `GET /api/health`
- `POST /api/prompt` with JSON `{"decision":"...","context":"...","evidence":"..."}`

This first safe layer is provider-agnostic: it generates the canonical board prompt without storing secrets or making paid model calls. Provider adapters belong behind explicit FREE_ONLY / authorization gates.

## Safety / deployment
No API keys in source. No paid calls. No production replacement until preview validation and compatibility audit against the historical gateway.
