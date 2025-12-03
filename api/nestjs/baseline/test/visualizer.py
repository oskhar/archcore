import json
import matplotlib.pyplot as plt
import pandas as pd
import sys

def load_report(path):
    with open(path, 'r') as f:
        return json.load(f)

def extract_time_series(data):
    rows = []
    for entry in data.get("intermediate", []):
        ts = entry.get("period")
        rate = entry.get("rates", {}).get("http.request_rate", None)
        rt = entry.get("summaries", {}).get("http.response_time", {}).get("mean", None)
        rows.append({"timestamp": ts, "request_rate": rate, "mean_response_time": rt})
    return pd.DataFrame(rows)

def extract_distribution(report):
    summary = report["aggregate"]["summaries"]["http.response_time"]
    return {
        "labels": ["min", "p50", "p75", "p90", "p95", "p99", "max"],
        "values": [
            summary.get("min"),
            summary.get("p50"),
            summary.get("p75"),
            summary.get("p90"),
            summary.get("p95"),
            summary.get("p99"),
            summary.get("max"),
        ]
    }

def plot_time_series(df):
    fig, ax1 = plt.subplots()

    ax1.set_title("Latency & Request Rate Over Time")
    ax1.set_xlabel("Timestamp")

    ax1.plot(df["timestamp"], df["mean_response_time"], label="Mean Response Time (ms)")
    ax1.set_ylabel("Response Time (ms)")

    ax2 = ax1.twinx()
    ax2.plot(df["timestamp"], df["request_rate"], color="orange", label="Request Rate (req/s)")
    ax2.set_ylabel("Requests/s")

    ax1.legend(loc="upper left")
    ax2.legend(loc="upper right")

def plot_latency_distribution(dist):
    plt.figure()
    plt.bar(dist["labels"], dist["values"])
    plt.title("Latency Percentile Breakdown")
    plt.ylabel("Milliseconds")

def plot_histogram_aggregate(report):
    hist = report["aggregate"]["histograms"]["http.response_time"]
    plt.figure()
    values = [hist.get(k) for k in ["min", "mean", "p50", "p75", "p90", "p99", "max"]]
    labels = ["Min", "Mean", "P50", "P75", "P90", "P99", "Max"]

    plt.plot(labels, values, marker="o")
    plt.title("Aggregate Response Time Shape")
    plt.ylabel("ms")

def main():
    if len(sys.argv) < 2:
        print("Usage: python artillery_report_viz.py report.json")
        return

    report_path = sys.argv[1]
    report = load_report(report_path)

    df = extract_time_series(report)
    dist = extract_distribution(report)

    plot_time_series(df)
    plot_latency_distribution(dist)
    plot_histogram_aggregate(report)

    plt.show()

if __name__ == "__main__":
    main()
