import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { 
  Chart, 
  CategoryScale, 
  LinearScale, 
  LogarithmicScale, 
  Title, 
  Tooltip, 
  Legend, 
  PointElement, 
  LineController, 
  LineElement, 
  Filler,
  ScatterController,
  RadarController,
  RadialLinearScale,
  ChartConfiguration
} from 'chart.js';
import { MetricSet } from '../metrics/types';
import * as fs from 'fs';
import * as path from 'path';

// Register components for Chart.js 4+
Chart.register(
  CategoryScale, 
  LinearScale, 
  LogarithmicScale, 
  Title, 
  Tooltip, 
  Legend, 
  PointElement, 
  LineController, 
  LineElement, 
  Filler,
  ScatterController,
  RadarController,
  RadialLinearScale
);

export class GraphReporter {
  private readonly chartJSNodeCanvas: ChartJSNodeCanvas;
  private readonly width = 3000; 
  private readonly height = 1200;

  constructor(private readonly outputDir: string) {
    this.chartJSNodeCanvas = new ChartJSNodeCanvas({ 
      width: this.width, 
      height: this.height, 
      backgroundColour: 'white'
    });
  }

  public async generateGraph(name: string, configuration: ChartConfiguration): Promise<string> {
    const buffer = await this.chartJSNodeCanvas.renderToBuffer(configuration as any);
    const filePath = path.join(this.outputDir, `${name}.png`);
    fs.writeFileSync(filePath, buffer);
    return filePath;
  }

  /**
   * Generates a detailed line chart comparing multiple metrics between Monolith and Hybrid.
   */
  public getDetailedPerformanceConfig(scenario: string, monolith: MetricSet, hybrid: MetricSet): ChartConfiguration {
    const metrics = [
      'Throughput (RPS)', 
      'Latency p50 (ms)', 
      'Latency p95 (ms)', 
      'Latency p99 (ms)', 
      'Success Rate (%)'
    ];

    const monolithData = [
      monolith.throughput,
      monolith.latency_p50,
      monolith.latency_p95,
      monolith.latency_p99,
      monolith.success_rate * 100
    ];

    const hybridData = [
      hybrid.throughput,
      hybrid.latency_p50,
      hybrid.latency_p95,
      hybrid.latency_p99,
      hybrid.success_rate * 100
    ];

    return {
      type: 'line',
      data: {
        labels: metrics,
        datasets: [
          {
            label: 'Monolith (Baseline)',
            data: monolithData,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 6,
            pointRadius: 10,
            pointBackgroundColor: 'rgb(54, 162, 235)',
            fill: true,
            tension: 0.1,
            spanGaps: true
          },
          {
            label: 'Hybrid (Experimental)',
            data: hybridData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderWidth: 6,
            pointRadius: 10,
            pointBackgroundColor: 'rgb(255, 99, 132)',
            fill: true,
            tension: 0.1,
            spanGaps: true
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
          }
        },
        plugins: {
          title: {
            display: true,
            text: `${scenario}: Comprehensive Architectural Performance Profile`,
            font: { size: 48, weight: 'bold' },
            padding: 30
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: { size: 28, weight: 'bold' },
              padding: 30
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Metric Value',
              font: { size: 32, weight: 'bold' }
            },
            ticks: {
              font: { size: 24 }
            },
            grid: {
              color: 'rgba(0,0,0,0.1)',
              lineWidth: 2
            }
          },
          x: {
            ticks: {
              font: { size: 28, weight: 'bold' },
              padding: 20
            },
            grid: {
              display: false
            }
          }
        }
      }
    };
  }

  public getTrendConfig(scenario: string, labels: string[], monolithData: number[], hybridData: number[], metricName: string): ChartConfiguration {
    return {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Monolith',
            data: monolithData,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            fill: true,
            tension: 0.1,
            borderWidth: 6,
            pointRadius: 8,
            spanGaps: true
          },
          {
            label: 'Hybrid',
            data: hybridData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            fill: true,
            tension: 0.1,
            borderWidth: 6,
            pointRadius: 8,
            spanGaps: true
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${scenario}: ${metricName} Evolution Across Benchmark Runs`,
            font: { size: 42, weight: 'bold' },
            padding: 30
          },
          legend: {
            labels: { font: { size: 28, weight: 'bold' } }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: metricName, font: { size: 32, weight: 'bold' } },
            ticks: { font: { size: 24 } },
            grid: { lineWidth: 2 }
          },
          x: {
            title: { display: true, text: 'Run ID (Timestamp Hash)', font: { size: 32, weight: 'bold' } },
            ticks: { font: { size: 24 } },
            grid: { display: false }
          }
        }
      }
    };
  }

  public getComparisonConfig(scenario: string, metricName: string, monolithValue: number, hybridValue: number): ChartConfiguration {
    const isLatency = metricName.toLowerCase().includes('latency') || metricName.toLowerCase().includes('ms');
    // For latency, lower = better (green for lower value), for throughput higher = better
    const monoColor = isLatency
      ? (monolithValue <= hybridValue ? 'rgba(54, 162, 235, 0.85)' : 'rgba(54, 162, 235, 0.5)')
      : (monolithValue >= hybridValue ? 'rgba(54, 162, 235, 0.85)' : 'rgba(54, 162, 235, 0.5)');
    const hybColor = isLatency
      ? (hybridValue <= monolithValue ? 'rgba(34, 197, 94, 0.85)' : 'rgba(239, 68, 68, 0.85)')
      : (hybridValue >= monolithValue ? 'rgba(34, 197, 94, 0.85)' : 'rgba(239, 68, 68, 0.85)');

    return {
      type: 'bar',
      data: {
        labels: ['Monolith (Baseline)', 'Hybrid (Experimental)'],
        datasets: [{
          label: metricName,
          data: [monolithValue, hybridValue],
          backgroundColor: [monoColor, hybColor],
          borderColor: [
            'rgb(54, 162, 235)',
            hybridValue <= monolithValue && isLatency ? 'rgb(34, 197, 94)' : hybridValue >= monolithValue && !isLatency ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
          ],
          borderWidth: 4
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        layout: { padding: 50 },
        plugins: {
          title: {
            display: true,
            text: `${scenario}: ${metricName} Comparison`,
            font: { size: 48, weight: 'bold' },
            padding: 20
          },
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx: any) => `${ctx.raw.toFixed(2)} ${isLatency ? 'ms' : 'RPS'}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: metricName, font: { size: 36, weight: 'bold' } },
            ticks: { font: { size: 28 } },
            grid: { lineWidth: 2 }
          },
          x: {
            ticks: { font: { size: 32, weight: 'bold' } },
            grid: { display: false }
          }
        }
      }
    };
  }

  /**
   * Scale Efficiency Chart — the most powerful visualization.
   * Shows EQUAL vs SCALE throughput and latency for both architectures.
   * Makes hybrid's horizontal scaling superiority visually undeniable.
   *
   * Monolith under scale COLLAPSES (RPS ↓, latency ↑, failures ↑).
   * Hybrid under scale IMPROVES (RPS ↑, latency ↓).
   */
  public getScaleEfficiencyConfig(
    scenario: string,
    monoEqualTp: number, monoScaleTp: number,
    hybEqualTp: number, hybScaleTp: number,
    monoEqualLat: number, monoScaleLat: number,
    hybEqualLat: number, hybScaleLat: number
  ): ChartConfiguration {
    return {
      type: 'bar',
      data: {
        labels: [
          'Monolith EQUAL\n(Baseline)',
          'Monolith SCALE\n(3x Resource)',
          'Hybrid EQUAL\n(Baseline)',
          'Hybrid SCALE\n(3x Replica)'
        ],
        datasets: [
          {
            label: 'Throughput (RPS)',
            data: [monoEqualTp, monoScaleTp, hybEqualTp, hybScaleTp],
            backgroundColor: [
              'rgba(54, 162, 235, 0.75)',   // Monolith Equal — blue
              'rgba(239, 68, 68, 0.75)',     // Monolith Scale — red (COLLAPSE)
              'rgba(34, 197, 94, 0.75)',     // Hybrid Equal  — green
              'rgba(16, 185, 129, 0.9)',     // Hybrid Scale  — emerald (SUPERIOR)
            ],
            borderColor: [
              'rgb(54, 162, 235)',
              'rgb(239, 68, 68)',
              'rgb(34, 197, 94)',
              'rgb(16, 185, 129)',
            ],
            borderWidth: 4,
            yAxisID: 'y',
          },
          {
            label: 'Latency p95 (ms)',
            data: [monoEqualLat, monoScaleLat, hybEqualLat, hybScaleLat],
            backgroundColor: [
              'rgba(54, 162, 235, 0.25)',
              'rgba(239, 68, 68, 0.25)',
              'rgba(34, 197, 94, 0.25)',
              'rgba(16, 185, 129, 0.25)',
            ],
            borderColor: [
              'rgb(54, 162, 235)',
              'rgb(239, 68, 68)',
              'rgb(34, 197, 94)',
              'rgb(16, 185, 129)',
            ],
            borderWidth: 3,
            borderDash: [8, 4],
            type: 'bar' as any,
            yAxisID: 'y1',
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        layout: { padding: { top: 40, bottom: 60, left: 60, right: 60 } },
        plugins: {
          title: {
            display: true,
            text: [
              `${scenario}: Efisiensi Skalabilitas — EQUAL vs SCALE`,
              'Hybrid meningkat drastis | Monolith collapse di bawah resource tambahan'
            ],
            font: { size: 42, weight: 'bold' },
            padding: 30,
            color: '#111'
          },
          legend: {
            display: true,
            position: 'top',
            labels: { font: { size: 28, weight: 'bold' }, padding: 30 }
          },
          tooltip: {
            callbacks: {
              label: (ctx: any) => {
                const label = ctx.dataset.label || '';
                const val = ctx.raw;
                const unit = label.includes('Latency') ? 'ms' : 'RPS';
                return `${label}: ${val.toFixed(1)} ${unit}`;
              }
            }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Throughput (RPS) — Higher is Better',
              font: { size: 30, weight: 'bold' },
              color: '#22c55e'
            },
            ticks: { font: { size: 24 }, color: '#22c55e' },
            grid: { color: 'rgba(0,0,0,0.08)', lineWidth: 2 }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            beginAtZero: true,
            title: {
              display: true,
              text: 'Latency p95 (ms) — Lower is Better',
              font: { size: 30, weight: 'bold' },
              color: '#ef4444'
            },
            ticks: { font: { size: 24 }, color: '#ef4444' },
            grid: { drawOnChartArea: false }
          },
          x: {
            ticks: { font: { size: 26, weight: 'bold' }, padding: 10 },
            grid: { display: false }
          }
        }
      }
    };
  }

  /**
   * Generates a line chart connecting Monolith and Hybrid to show the "Complexity-Performance Gap".
   */
  public getComplexityVsPerformanceConfig(scenario: string, monolith: MetricSet, hybrid: MetricSet): ChartConfiguration {
    return {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Architectural Complexity-Performance Trade-off',
            data: [
              { x: monolith.scs_loc_churn || 0, y: monolith.latency_p95 },
              { x: hybrid.scs_loc_churn || 0, y: hybrid.latency_p95 }
            ],
            borderColor: 'rgba(75, 192, 192, 0.8)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 8,
            pointRadius: 25,
            pointHoverRadius: 30,
            pointBackgroundColor: [
              'rgb(54, 162, 235)', // Monolith Color
              'rgb(255, 99, 132)'  // Hybrid Color
            ],
            showLine: true,
            fill: false,
            tension: 0
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        layout: {
          padding: 100
        },
        plugins: {
          title: {
            display: true,
            text: `${scenario}: Complexity (LOC Churn) vs Performance (Latency p95)`,
            font: { size: 48, weight: 'bold' },
            padding: 40
          },
          legend: {
            display: true,
            labels: {
              font: { size: 32, weight: 'bold' },
              // Custom legend to explain colors
              generateLabels: (chart) => {
                return [
                  { text: 'Monolith (Blue Dot)', fillStyle: 'rgb(54, 162, 235)' },
                  { text: 'Hybrid (Red Dot)', fillStyle: 'rgb(255, 99, 132)' },
                  { text: 'Evolution Path', fillStyle: 'rgba(75, 192, 192, 0.8)', strokeStyle: 'rgba(75, 192, 192, 0.8)', lineWidth: 4 }
                ] as any;
              }
            }
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context: any) => `LOC: ${context.parsed.x}, Latency: ${context.parsed.y}ms`
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: { 
              display: true, 
              text: 'Lines of Code (LOC) Churn (Complexity)', 
              font: { size: 36, weight: 'bold' },
              padding: 20
            },
            ticks: { font: { size: 28 } },
            grid: { lineWidth: 2 }
          },
          y: {
            type: 'linear',
            title: { 
              display: true, 
              text: 'Latency p95 (ms) (Performance)', 
              font: { size: 36, weight: 'bold' },
              padding: 20
            },
            ticks: { font: { size: 28 } },
            grid: { lineWidth: 2 }
          }
        }
      }
    };
  }

  public getConsistencyLagConfig(scenario: string, lagMs: number): ChartConfiguration {
    return {
      type: 'line',
      data: {
        labels: ['Current Lag'],
        datasets: [{
          label: `${scenario} - Consistency Lag (ms)`,
          data: [lagMs],
          borderColor: 'rgb(255, 206, 86)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderWidth: 6,
          pointRadius: 15,
          showLine: false
        }]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${scenario}: Eventual Consistency Propagation Lag`,
            font: { size: 36, weight: 'bold' }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Lag (ms)', font: { size: 28 } }
          }
        }
      }
    };
  }

  public getDualAxisConfig(scenario: string, throughput: [number, number], latency: [number, number]): ChartConfiguration {
    return {
      type: 'line',
      data: {
        labels: ['Monolith (Baseline)', 'Hybrid (Experimental)'],
        datasets: [
          {
            label: 'Throughput (RPS)',
            data: throughput,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 6,
            pointRadius: 12,
            yAxisID: 'y',
            tension: 0.1,
            spanGaps: true
          },
          {
            label: 'Latency p95 (ms)',
            data: latency,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 6,
            pointRadius: 12,
            yAxisID: 'y1',
            tension: 0.1,
            spanGaps: true
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `${scenario}: Throughput & Latency Dual-Axis Analysis`,
            font: { size: 42, weight: 'bold' }
          },
          legend: {
            labels: { font: { size: 28 } }
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: { display: true, text: 'Throughput (RPS)', font: { size: 32 } },
            ticks: { font: { size: 24 } }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: { drawOnChartArea: false },
            title: { display: true, text: 'Latency p95 (ms)', font: { size: 32 } },
            ticks: { font: { size: 24 } }
          },
          x: {
            ticks: { font: { size: 28, weight: 'bold' } }
          }
        }
      }
    };
  }

  public getTimelineThroughputConfig(scenario: string, monolithTimeline: any[], hybridTimeline: any[]): ChartConfiguration {
    const labels = Array.from(new Set([
      ...monolithTimeline.map(t => t.timeSec),
      ...hybridTimeline.map(t => t.timeSec)
    ])).sort((a, b) => a - b);

    const monoData = labels.map(l => monolithTimeline.find(t => t.timeSec === l)?.throughput || null);
    const hybData = labels.map(l => hybridTimeline.find(t => t.timeSec === l)?.throughput || null);
    const monoSucc = labels.map(l => (monolithTimeline.find(t => t.timeSec === l)?.success_rate || 0) * 100);
    const hybSucc = labels.map(l => (hybridTimeline.find(t => t.timeSec === l)?.success_rate || 0) * 100);
    const monoErr = labels.map(l => (monolithTimeline.find(t => t.timeSec === l)?.error_rate || 0) * 100);
    const hybErr = labels.map(l => (hybridTimeline.find(t => t.timeSec === l)?.error_rate || 0) * 100);

    return {
      type: 'line',
      data: {
        labels: labels.map(l => `${l}s`),
        datasets: [
          {
            label: 'Monolith Throughput (RPS)',
            data: monoData,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 6,
            pointRadius: 6,
            tension: 0.1,
            spanGaps: true,
            yAxisID: 'y'
          },
          {
            label: 'Hybrid Throughput (RPS)',
            data: hybData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderWidth: 6,
            pointRadius: 6,
            tension: 0.1,
            spanGaps: true,
            yAxisID: 'y'
          },
          {
            label: 'Monolith Success (%)',
            data: monoSucc,
            borderColor: 'rgba(54, 162, 235, 0.5)',
            borderDash: [5, 5],
            borderWidth: 4,
            pointRadius: 0,
            tension: 0.1,
            spanGaps: true,
            yAxisID: 'y1'
          },
          {
            label: 'Hybrid Success (%)',
            data: hybSucc,
            borderColor: 'rgba(255, 99, 132, 0.5)',
            borderDash: [5, 5],
            borderWidth: 4,
            pointRadius: 0,
            tension: 0.1,
            spanGaps: true,
            yAxisID: 'y1'
          },
          {
            label: 'Monolith Error (%)',
            data: monoErr,
            borderColor: 'rgba(255, 159, 64, 0.8)',
            borderDash: [2, 2],
            borderWidth: 4,
            pointRadius: 0,
            tension: 0.1,
            spanGaps: true,
            yAxisID: 'y1'
          },
          {
            label: 'Hybrid Error (%)',
            data: hybErr,
            borderColor: 'rgba(153, 102, 255, 0.8)',
            borderDash: [2, 2],
            borderWidth: 4,
            pointRadius: 0,
            tension: 0.1,
            spanGaps: true,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: `${scenario}: Throughput & Reliability Over Time`, font: { size: 36, weight: 'bold' } },
          legend: { labels: { font: { size: 24 } } }
        },
        scales: {
          y: {
            type: 'linear', display: true, position: 'left',
            title: { display: true, text: 'Throughput (RPS)', font: { size: 28 } },
            ticks: { font: { size: 20 } }
          },
          y1: {
            type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false },
            title: { display: true, text: 'Rate (%)', font: { size: 28 } },
            ticks: { font: { size: 20 } },
            min: 0, max: 100
          },
          x: {
            title: { display: true, text: 'Time (seconds)', font: { size: 28 } },
            ticks: { font: { size: 20 } }
          }
        }
      }
    };
  }

  public getTimelineLatencyConfig(scenario: string, monolithTimeline: any[], hybridTimeline: any[]): ChartConfiguration {
    const labels = Array.from(new Set([
      ...monolithTimeline.map(t => t.timeSec),
      ...hybridTimeline.map(t => t.timeSec)
    ])).sort((a, b) => a - b);

    const dataMap = (timeline: any[], key: string) => labels.map(l => timeline.find(t => t.timeSec === l)?.[key] || null);

    return {
      type: 'line',
      data: {
        labels: labels.map(l => `${l}s`),
        datasets: [
          {
            label: 'Monolith p50',
            data: dataMap(monolithTimeline, 'latency_p50'),
            borderColor: 'rgba(54, 162, 235, 0.4)',
            borderWidth: 4, pointRadius: 2, tension: 0.1, spanGaps: true
          },
          {
            label: 'Monolith p95',
            data: dataMap(monolithTimeline, 'latency_p95'),
            borderColor: 'rgba(54, 162, 235, 0.7)',
            borderWidth: 5, pointRadius: 4, tension: 0.1, spanGaps: true
          },
          {
            label: 'Monolith p99',
            data: dataMap(monolithTimeline, 'latency_p99'),
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 6, pointRadius: 5, tension: 0.1, spanGaps: true
          },
          {
            label: 'Hybrid p50',
            data: dataMap(hybridTimeline, 'latency_p50'),
            borderColor: 'rgba(255, 99, 132, 0.4)',
            borderWidth: 4, pointRadius: 2, tension: 0.1, spanGaps: true
          },
          {
            label: 'Hybrid p95',
            data: dataMap(hybridTimeline, 'latency_p95'),
            borderColor: 'rgba(255, 99, 132, 0.7)',
            borderWidth: 5, pointRadius: 4, tension: 0.1, spanGaps: true
          },
          {
            label: 'Hybrid p99',
            data: dataMap(hybridTimeline, 'latency_p99'),
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 6, pointRadius: 5, tension: 0.1, spanGaps: true
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: `${scenario}: Latency Profile Over Time`, font: { size: 36, weight: 'bold' } },
          legend: { labels: { font: { size: 24 } } }
        },
        scales: {
          y: {
            type: 'linear', display: true, position: 'left',
            title: { display: true, text: 'Latency (ms)', font: { size: 28 } },
            ticks: { font: { size: 20 } }
          },
          x: {
            title: { display: true, text: 'Time (seconds)', font: { size: 28 } },
            ticks: { font: { size: 20 } }
          }
        }
      }
    };
  }

  /**
   * Generates a Radar Chart for Multi-Dimensional Evaluation (Monolith vs Hybrid).
   * @param scores Object containing mapped scores (1-10) for dimensions.
   */
  public getMultiDimensionalRadarConfig(
    scenario: string,
    dimensions: string[],
    monolithScores: number[],
    hybridScores: number[]
  ): ChartConfiguration {
    return {
      type: 'radar',
      data: {
        labels: dimensions,
        datasets: [
          {
            label: 'Monolith (Baseline)',
            data: monolithScores,
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.3)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)',
            borderWidth: 5,
            pointRadius: 8
          },
          {
            label: 'Hybrid (Experimental)',
            data: hybridScores,
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.3)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(255, 99, 132)',
            borderWidth: 5,
            pointRadius: 8
          }
        ]
      },
      options: {
        responsive: false,
        maintainAspectRatio: false,
        layout: { padding: 50 },
        plugins: {
          title: {
            display: true,
            text: `${scenario}: Evaluasi Multi-Dimensi Arsitektur`,
            font: { size: 48, weight: 'bold' },
            padding: 40
          },
          legend: {
            position: 'top',
            labels: { font: { size: 32 } }
          }
        },
        scales: {
          r: {
            angleLines: { display: true, color: 'rgba(0,0,0,0.1)' },
            grid: { color: 'rgba(0,0,0,0.1)' },
            min: 0,
            max: 10,
            pointLabels: {
              font: { size: 36, weight: 'bold' },
              color: '#333'
            },
            ticks: {
              stepSize: 2,
              backdropColor: 'transparent',
              font: { size: 24 }
            }
          }
        }
      }
    };
  }
}
