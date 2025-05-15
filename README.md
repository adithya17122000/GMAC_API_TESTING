This project uses [k6](https://k6.io/) to load test the API.

## Prerequisites

- Install k6 by following the official instructions:  
  👉 [https://grafana.com/docs/k6/latest/set-up/install-k6/](https://grafana.com/docs/k6/latest/set-up/install-k6/)

## Setup

1. Clone the repository and navigate to the project folder.
2. In `config.json`, update the cookie (Authorization header) with a token from an **active session**.

## Running the Test

Run your k6 test with:

```bash
k6 run script.js
