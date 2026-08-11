import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { Chart, ArcElement, Tooltip, Legend, ChartOptions, ChartData, ChartDataset, DoughnutControllerDatasetOptions, } from 'chart.js';
type DoughnutDataset = ChartDataset<'doughnut', number[]> & DoughnutControllerDatasetOptions;

var animatedNeedlePlugin = {
  id: 'animatedGaugeNeedle',

  afterDatasetsDraw(chart: any) {
    const opts = (chart.options?.plugins as any)?.needle;
    if (!opts) return;

    const { fleet = 0, benchmark = 0, speed = 0.01, hubRadius = 4 } = opts;
    const meta = chart.getDatasetMeta(0);
    if (!meta?.data?.length) return;

    const firstArc = meta.data[0];
    const lastArc = meta.data[meta.data.length - 1];

    const cx = firstArc.x;
    const cy = firstArc.y;
    const startAngle = firstArc.startAngle;
    const endAngle = lastArc.endAngle;
    const len = firstArc.outerRadius * 0.85;

    chart.$needleState ??= { fleet: 0, benchmark: 0 };
    const st = chart.$needleState;
    st.fleet += (fleet - st.fleet) * speed;
    st.benchmark += (benchmark - st.benchmark) * speed;

    const { ctx } = chart;

    function angleFor(score: number) {
      const t = Math.max(0, Math.min(1, score / 100));
      return startAngle + t * (endAngle - startAngle);
    }

    function drawNeedle(score: number, color: string) {
      const a = angleFor(score);
      const x = cx + len * Math.cos(a);
      const y = cy + len * Math.sin(a);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.restore();
    }

    // --- Draw needles ---
    drawNeedle(st.fleet, '#000000');   // black needle
    drawNeedle(st.benchmark, '#0000ff'); // blue needle

    // --- Draw hub circle ---
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, hubRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    let labelSpacingX = 70;
    let labelStartX = cx - (labelSpacingX / 2);
    ctx.restore();
    ctx.save();
    ctx.restore();

    // --- Keep animation alive ---
    if (Math.abs(st.fleet - fleet) > 0.3 || Math.abs(st.benchmark - benchmark) > 0.3) {
      requestAnimationFrame(() => chart?.draw());
    }
  },
};

Chart.register(animatedNeedlePlugin);




@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: 'dashboard-component.html',
  styleUrl: 'dashboard-component.css',
})
export class DashboardComponent implements OnInit {
  // line chart
  data: any;
  options: any;
  selViewDates: any;
  // gauge chart
  gaugeData1: ChartData<'doughnut'>;
  gaugeOptions1: ChartOptions<'doughnut'>;

  gaugeData2: ChartData<'doughnut'>;
  gaugeOptions2: ChartOptions<'doughnut'>;

  yourFleetScore: number = 0;
  benchmarkFleetScore: number = 0;
  yourDirverScore: number = 0;
  benchmarkDirverScore: number = 0;
  isBenchmarkAvailable: boolean = true;

  // constants for ranges
  private MIN_VALUE = 5000;
  private MAX_VALUE = 15000;

  fleetScoreSelectedMonth: string;
  dirverScoreSelectedMonth: string;
  monthOptions: { label: string; value: string }[] = [];
  customerType: string = 'Business';
  constructor() { }

  ngOnInit(): void {
    this.bindFleetScoreMonth();
    this.setupExpensesOptions();
    this.onGenerateExpensesChartData();
    this.initActivitiesWeekDates();

    let storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      this.customerType = parsed?.Customer?.CustomerType ? parsed.Customer.CustomerType : 'Business';
    }

    // two separate gauges (Fleet vs Driver)
    this.onGaugeMonthChange('');
    // this.yourFleetScore = this.randomInRange(50, 80);
    // if (!this.isBenchmarkAvailable) {
    //   this.yourFleetScore = 0;
    // }

    // this.benchmarkFleetScore = this.randomInRange(10, 20);
    // this.setupFleetScoreGaugeChart(this.yourFleetScore, this.benchmarkFleetScore);

    // this.yourDirverScore = this.randomInRange(50, 75);
    // if (!this.isBenchmarkAvailable) {
    //   this.yourDirverScore = 0;
    // }

    // this.benchmarkDirverScore = this.randomInRange(60, 90);
    // this.setupDirverScoreGaugeChart(this.yourDirverScore, this.benchmarkDirverScore);

  }

  bindFleetScoreMonth() {
    // Generate month options for dropdown
    const today = new Date();
    for (let i = 0; i <= 11; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);

      const label = date.toLocaleString('en-US', {
        month: 'short',
        year: 'numeric'
      }); // "Jan 26"

      const year = date.getFullYear().toString().slice(-2); // "26"
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // "01"
      const value = `${year}${month}`; // "2601"

      this.monthOptions.push({ label, value });

      if (this.monthOptions.length > 0) {

        this.fleetScoreSelectedMonth = this.monthOptions[0].value;
        this.dirverScoreSelectedMonth = this.monthOptions[0].value;
      }
    }
  }

  // -----------------------------
  // ExpensesChart
  // -----------------------------
  setupExpensesOptions() {

    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        title: { display: true, text: 'Expenses' }
      },
      scales: {
        x: {
          title: { display: true, text: 'Months' }
        },
        y: {
          title: { display: true, text: 'Cost' },
          ticks: {
            callback: (value) => '£ ' + value.toLocaleString()
          }
        }
      }
    };
  }


  onGenerateExpensesChartData() {
    // Initialize values
    if (!this.isBenchmarkAvailable) {
      this.MIN_VALUE = 0;
      this.MAX_VALUE = 0;
    }

    // Generate month labels for the last 12 months
    const months: string[] = [];
    const monthDates: Date[] = [];
    const today = new Date();

    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      monthDates.push(date);
      const label = date.toLocaleString('en-US', {
        month: 'short',
        year: '2-digit'
      });
      months.push(label);
    }

    // Generate benchmark data (all 12 months)
    //const benchmark: number[] = [7050, 7120, 7180, 7230, 7280, 7320, 7360, 7400, 7430, 7460, 7485, 7500];
    ///let bValue = this.MAX_VALUE * 0.6;
    // for (let i = 0; i < months.length; i++) {
    //   const growth = this.MAX_VALUE * (0.001 + this.randomInRange(0, 2) / 1000);
    //   bValue += growth;
    //   benchmark.push(Math.round(bValue));
    // }

    // Generate projected data (11 months, last month is null)
    //const projected: (number | null)[] = [11000, 10950, 10620, 10580, 10440, 10310, 10180, 7400, 7430, 7460, 7785, 7600];
    // const startOffsetPercent = 0.01;
    // const growthOffsetPercent = 0.001;

    // for (let i = 0; i < months.length; i++) {
    //   if (!this.isBenchmarkAvailable) {
    //     projected.push(0);
    //     continue;
    //   }

    //   if (i > 10) {
    //     projected.push(null);
    //     continue;
    //   }

    //   const gap = this.MAX_VALUE * (startOffsetPercent + i * growthOffsetPercent);
    //   const pValue = benchmark[i] + gap;
    //   projected.push(Math.round(pValue));
    // }

    // Generate actual data (only for past and current months)
    //const actual: (number | null)[] =  [11500, 10850, 10720, 10580, 10440, 10310, 10180, 9950, 9720, 9480, 9150, 8800];
    // const deviationPercent = 0.01;

    // for (let i = 0; i < months.length; i++) {
    //   if (!this.isBenchmarkAvailable) {
    //     actual.push(0);
    //     continue;
    //   }

    //   // Check if this month is in the future
    //   if (monthDates[i] > today) {
    //     actual.push(null);
    //     continue;
    //   }

    //   const projectedValue = projected[i];
    //   if (projectedValue === null) {
    //     actual.push(null);
    //     continue;
    //   }

    //   // Add deviation around the projected value
    //   const deviation = projectedValue * deviationPercent * (Math.random() * 2 - 1);
    //   let value = projectedValue + deviation;

    //   // Ensure actual >= benchmark
    //   value = Math.max(value, benchmark[i]);

    //   actual.push(Math.round(value));
    // }
    const benchmark: number[] = [6500,  6550, 6600, 6650, 6700, 6750, 6800, 6850, 6900, 6950, 6980, 7000];
    const projected: number[] = [9000, 9500, 9800, 9700, 9800, 9200, 8800, 8500, 8200, 7900, 7750, 7500];
    const actual: number[] =    [12000, 11200, 11850, 10300, 11050, 9400, 8900, 8600, 8000, 8000, 7600, 7400];

    // Calculate Y-axis range
    const allValues = [
      ...benchmark,
      ...projected.filter(v => v !== null),
      ...actual.filter(v => v !== null)
    ] as number[];


    // Build chart data
    this.data = {
      labels: months,
      datasets: [
        {
          label: 'Actual Expenses',
          data: actual,
          borderColor: '#cc9329',           // Emerald green
          backgroundColor: 'rgba(204, 159, 76, 0.1)',
          pointBackgroundColor: '#c9a25a',
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,

          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          label: 'Projected Expenses',
          data: projected,
          borderColor: '#8b5cf6', // Purple
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          pointBackgroundColor: '#8b5cf6',
          borderWidth: 2,
          borderDash: [8, 4],
          fill: false,
          tension: 0.4,

          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        },
        {
          label: 'Industry Benchmark',
          data: benchmark,
          borderColor: '#1f2f46',
          backgroundColor: 'rgba(100, 116, 139, 0.2)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          pointBackgroundColor: '#64748b',
          pointBorderColor: '#ffffff'
        }
      ]
    };
  }

  private randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }



  // -----------------------------
  // Gauge Chart 1
  // -----------------------------
  setupFleetScoreGaugeChart(fleetScore: number, benchmarkScore: number) {
    this.gaugeData1 = {
      labels: ['Bad', 'Average', 'Good'],
      datasets: [
        {
          data: [50, 20, 30],
          backgroundColor: ['#e74c3c', '#f1c40f', '#2ecc71'],
          borderWidth: 1,
        },
      ],
    };

    this.gaugeOptions1 = {
      responsive: false,
      maintainAspectRatio: false,
      cutout: '50%',
      circumference: 180,
      rotation: 270,
      animation: { duration: 0 },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            boxWidth: 15,
            padding: 5   // << tighten legend spacing
          }
        },
        tooltip: { enabled: false },
        ...({ needle: { fleet: fleetScore, benchmark: benchmarkScore } } as any),
      },
    };

  }

  // -----------------------------
  // Gauge Chart 2
  // -----------------------------
  setupDirverScoreGaugeChart(fleetScore: number, benchmarkScore: number) {
    this.gaugeData2 = {
      labels: ['Bad', 'Average', 'Good'],
      datasets: [
        {
          data: [50, 25, 25],
          backgroundColor: ['#e74c3c', '#f1c40f', '#2ecc71'],
          borderWidth: 0,
          circumference: 180,
          rotation: 270,
          cutout: '70%',
        } as any,
      ],
    };

    this.gaugeOptions2 = {
      responsive: true,
      cutout: '70%',
      circumference: 180,
      rotation: 270,
      animation: { duration: 0 },
      plugins: {
        legend: { display: true },
        tooltip: { enabled: true },
        ...({ needle: { fleet: fleetScore, benchmark: benchmarkScore } } as any),
      },
    };
  }


  weekrange: string;
  initActivitiesWeekDates(): void {

    var start = this.getStartOfWeek(new Date());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    this.weekrange = `${start.getDate()} ${start.toLocaleString('en-US', { month: 'short' })} - ${end.getDate()} ${end.toLocaleString('en-US', { month: 'short' })}`;
    this.selViewDates = { fromDate: start, endDate: end };
  }

  getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay(); // Sunday = 0
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    return new Date(d.setDate(diff));
  }

  onGaugeMonthChange(scoreFor: string) {


    //if (scoreFor == 'driver') {
    let monthValue = parseInt(this.dirverScoreSelectedMonth);
    // Generate consistent but varied scores (40-70 range)
    let variation = (monthValue * 13) % 26; // 0-25 variation
    let baseScore = 45 + (monthValue % 10); // 45-49 base


    this.yourDirverScore = Math.min(baseScore + variation, 70);
    this.benchmarkDirverScore = this.randomInRange(60, 90);

    this.setupFleetScoreGaugeChart(this.yourDirverScore, this.benchmarkDirverScore);
    //} else {
    //const monthValue = parseInt(this.fleetScoreSelectedMonth);

    // const baseScore = 45;
    variation = (monthValue * 13) % 20; // 0-25 variation
    baseScore = 45 + (monthValue % 8); // 45-49 base

    this.yourFleetScore = Math.min(baseScore + variation, 70);
    this.benchmarkFleetScore =  this.randomInRange(60, 90);

    this.setupFleetScoreGaugeChart(this.yourFleetScore, this.benchmarkFleetScore);
    //}


  }
}

