//The script below is a load testing script for a users/me API 
import http from 'k6/http';
import { check } from 'k6';
import { Trend, Rate } from 'k6/metrics';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
const config = JSON.parse(open('./config.json'));

// === Custom Metrics ===
const connectionTime = new Trend('connection_time');              // Time to establish connection
const scenarioCompletionRate = new Rate('scenario_completion');  // Tracks successful scenario completion
const successRate = new Rate('success_rate');                     // Tracks 200 status codes
const errorRate = new Rate('error_rate');                         // Tracks non-200 codes

// === Load Options and Thresholds ===
export let options = {
    stages: [

        //  { duration: '50s', target: 30 },
        // { duration: '1m', target: 500 },
        // { duration: '1m', target: 500 },
        // { duration: '1m', target: 0 },
    ],
    // vus:1,
    // duration: '1s',
    thresholds: {
        'http_req_duration': ['p(95)<500'],             // Response Time P90 ≤ 500ms
        'http_reqs': ['rate>=10'],                      // Throughput ≥ 10 RPS
        'success_rate': ['rate>=0.95'],                 // 200-only Success Rate ≥ 95%
        'error_rate': ['rate<=0.01'],                   // Error Rate ≤ 1%
        'scenario_completion': ['rate>=0.98'],          // Scenario Completion Rate ≥ 98%
        'connection_time': ['p(95)<100'],               // Connection Time < 100ms
    },
};

// === Main Function ===
export default function () {
    let res = http.get(config.url, {
        headers: config.headers,
    });

    // === Connection Time ===
    connectionTime.add(res.timings.connecting);

    // === Response Checks ===
    const isSuccess = check(res, {
        'status is 200': (r) => r.status === 200,
    });

    // === Track Result Metrics ===
    successRate.add(isSuccess);
    errorRate.add(!isSuccess);
    scenarioCompletionRate.add(isSuccess);
}

// === HTML + Terminal Summary ===
export function handleSummary(data) {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    return {
        stdout: textSummary(data, { indent: ' ', enableColors: true }),
        [`report/test-report-${timestamp}.html`]: htmlReport(data),
    };
}

function pad(n) {
    return n.toString().padStart(2, '0');
}



