import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { ChartConfiguration } from 'chart.js';
import * as fs from 'fs';
import * as path from 'path';

const width = 800;
const height = 400;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

export async function generateComparisonGraph(
  title: string,
  labels: string[],
  monolithData: number[],
  hybridData: number[],
  outputPath: string
) {
  const configuration: ChartConfiguration = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Monolith',
          data: monolithData,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1,
        },
        {
          label: 'Hybrid',
          data: hybridData,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, imageBuffer);
  console.log(`Graph generated at: ${outputPath}`);
}
