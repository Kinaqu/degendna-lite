# Scoring

All scoring is deterministic and normalized to 0-100.

## Wallet Personality

Wallet metrics include trade frequency, hold style, meme exposure, volatility exposure, liquidity preference, security risk exposure, PnL pattern, and winner/loser hold ratios.

If fewer than three meaningful interactions are available, the engine returns `Fresh Wallet`.

## Radar Scores

Momentum:

```text
priceAcceleration * 0.25
+ volumeAcceleration * 0.25
+ tradeCountGrowth * 0.20
+ buySellImbalance * 0.20
+ freshnessBonus * 0.10
```

Risk:

```text
securityRisk * 0.30
+ holderConcentration * 0.25
+ lowLiquidityRisk * 0.25
+ whaleDominance * 0.10
+ abnormalTradePattern * 0.10
```

Fit:

```text
personalityCompatibility * 0.40
+ historicalSuccessPattern * 0.25
+ riskToleranceMatch * 0.20
+ liquidityMatch * 0.15
```
