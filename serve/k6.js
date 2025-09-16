import http from 'k6/http';
import { check, sleep, group } from 'k6';

export const options = {
  
  stages: [
    { duration: '30s', target: 20 },  
    { duration: '1m', target: 20 },   
    { duration: '10s', target: 0 },  
  ],

  // Thresholds set the pass/fail criteria for the test.
  thresholds: {
    'http_req_failed': ['rate<0.01'],   // HTTP errors should be less than 1%
    'http_req_duration': ['p(95)<200'], // 95% of requests should be below 200ms
  },
};

// This is the main function for the virtual user.
export default function () {
  // group helps organize requests in the results output.
  group('Main Page', function () {
    const res = http.get('http://localhost:5000/properties');

    // check is used to assert that a condition is true.
    check(res, {
      'status was 200': (r) => r.status === 200,
      'body size is correct': (r) => r.body.length > 10000,
    });
  });

  // Wait before the next user iteration.
  sleep(1);
}