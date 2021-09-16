import { DateTime, Interval } from "luxon";

export function commonChartOptions(ohlcv) {
    return {
        chart: {
            type: "area",
            stacked: false,
            height: 350,
            zoom: {
                zoom: {
                    type: "x",
                    enabled: true,
                    autoScaleYaxis: true,
                },
                toolbar: {
                    autoSelected: "zoom",
                },
            },
        },
        xaxis: {
            labels: {
                formatter: function (val) {
                    return DateTime.fromMillis(val)
                        .toFormat("MMM d ha")
                        .toLowerCase();
                },
            },
            type: "datetime",
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 90, 100],
            },
        },
        legend: {
            horizontalAlign: "left",
            labels: {
                color: ["#fff"],
            },
            show: false,
        },
        theme: {
            palette: "palette1",
        },
        background: "transparent",
        grid: {
            show: false,
        },
    }
}

export function commonChartSeries(ohlcv, { timeUnit, timeSize, numCandles, onEmpty, onData }) {
    if (ohlcv.length === 0) return [];

    timeUnit = timeUnit || "hour";
    timeSize = timeSize || 1;
    numCandles = numCandles || 24;

    const rightBound = Interval.fromISO(
        ohlcv[ohlcv.length - 1].interval
    ).start;

    const leftBound = DateTime.max(
        rightBound.minus({ [timeUnit]: numCandles }),
        Interval.fromISO(ohlcv[0].interval).start
    );

    let data = [];
    let step = leftBound;
    let candleIndex = 0;
    let lastCandle;

    while (step <= rightBound && candleIndex < ohlcv.length) {
        const candle = ohlcv[candleIndex];
        const candleStart = Interval.fromISO(candle.interval).start;

        let skip = false;

        if (step.valueOf() < candleStart.valueOf()) {
            if (lastCandle) {
                const d = onEmpty(step, lastCandle)
                data.push(d);
            }

            step = step.plus({ [timeUnit]: timeSize });
            skip = true;
        }

        if (step.valueOf() > candleStart.valueOf()) {
            candleIndex++;
            skip = true;
        }

        if (skip) continue;

        const d = onData(step, candle)
        data.push(d);
        lastCandle = candle;

        step = step.plus({ [timeUnit]: timeSize });
        candleIndex++;
    }

    return data
}