# Architectural Performance Profile

## Latency vs Load (ms)

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'background': '#ffffff', 'xyChartBackground': '#ffffff', 'plotColorPalette': '#4CAF50, #81C784, #A5D6A7, #2196F3, #64B5F6, #90CAF9' } } }%%
xychart-beta
    title "Latency vs Load (ms)"
    x-axis [5, 10, 15, 20, 25, 30, 60, 70, 80]
    y-axis "Latency (ms)"
    line "Mono P50" [4, 4, 4, 4, 81, 0, 4, 2, 432]
    line "Mono P95" [8, 9, 9, 8, 761, 0, 8, 5, 3652]
    line "Mono P99" [9, 10, 12, 14, 778, 0, 12, 6, 3771]
    line "Hyb P50" [0, 19, 0, 6, 8, 400, 198, 0, 777]
    line "Hyb P95" [0, 114, 0, 120, 83, 9999, 1790, 0, 9834]
    line "Hyb P99" [0, 192, 0, 286, 254, 9999, 3012, 0, 9917]
```

## Throughput vs Load (RPS)

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'background': '#ffffff', 'plotColorPalette': '#4CAF50, #2196F3' } } }%%
xychart-beta
    title "Throughput vs Load (RPS)"
    x-axis [5, 10, 15, 20, 25, 30, 60, 70, 80]
    y-axis "Throughput (RPS)"
    line "MONOLITH" [3.0, 5.6, 8.3, 12.5, 15.2, 0.0, 61.2, 17.7, 35.3]
    line "HYBRID" [0.0, 9.9, 0.0, 19.6, 24.9, 15.7, 40.0, 0.0, 29.8]
```

## Success Rate vs Load

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': { 'background': '#ffffff', 'plotColorPalette': '#4CAF50, #2196F3' } } }%%
xychart-beta
    title "Success Rate vs Load"
    x-axis [5, 10, 15, 20, 25, 30, 60, 70, 80]
    y-axis "Rate (0-1)"
    line "MONOLITH" [0.500, 0.455, 0.500, 0.500, 0.530, 0.000, 1.000, 0.000, 0.374]
    line "HYBRID" [0.000, 0.807, 0.000, 0.560, 0.823, 0.274, 0.412, 0.000, 0.207]
```

## Performance Metrics Detail

| Load | Arch | Throughput | P50 | P95 | P99 | Success | Status |
|------|------|------------|-----|-----|-----|---------|--------|
| 5 | MONOLITH | 3.0 | 4.3 | 7.7 | 9.3 | 50.0% | critical |
| 10 | MONOLITH | 5.6 | 4.3 | 8.9 | 9.9 | 45.5% | critical |
| 10 | HYBRID | 9.9 | 18.8 | 113.6 | 191.8 | 80.7% | critical |
| 15 | MONOLITH | 8.3 | 3.5 | 9.0 | 12.4 | 50.0% | critical |
| 20 | MONOLITH | 12.5 | 3.5 | 7.6 | 13.8 | 50.0% | critical |
| 20 | HYBRID | 19.6 | 6.3 | 120.3 | 286.3 | 56.0% | critical |
| 25 | MONOLITH | 15.2 | 80.9 | 761.2 | 777.9 | 53.0% | critical |
| 25 | HYBRID | 24.9 | 7.9 | 83.0 | 254.2 | 82.3% | critical |
| 30 | HYBRID | 15.7 | 399.5 | 9999.2 | 9999.2 | 27.4% | critical |
| 60 | MONOLITH | 61.2 | 4.0 | 7.9 | 12.1 | 100.0% | healthy |
| 60 | HYBRID | 40.0 | 198.4 | 1790.4 | 3011.6 | 41.3% | critical |
| 70 | MONOLITH | 17.7 | 2.0 | 5.0 | 6.0 | 0.0% | critical |
| 80 | MONOLITH | 35.3 | 431.8 | 3651.5 | 3771.5 | 37.4% | critical |
| 80 | HYBRID | 29.8 | 776.7 | 9833.5 | 9917.5 | 20.7% | critical |

## Degradation Analysis

### MONOLITH Observations
- **Non-linear Latency Increase**: Jump at load 25 (P95: 7.6ms -> 761.2ms).
- **Throughput Degradation**: Dropped at load 70 despite higher target.
- **Reliability Threshold**: Success rate fell below 99% at load 70.
- **Non-linear Latency Increase**: Jump at load 80 (P95: 5.0ms -> 3651.5ms).
### HYBRID Observations
- **Non-linear Latency Increase**: Jump at load 30 (P95: 83.0ms -> 9999.2ms).
- **Throughput Degradation**: Dropped at load 30 despite higher target.
- **Non-linear Latency Increase**: Jump at load 80 (P95: 1790.4ms -> 9833.5ms).
- **Throughput Degradation**: Dropped at load 80 despite higher target.
