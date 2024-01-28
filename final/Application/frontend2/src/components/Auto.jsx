import ReactApexChart from 'apexcharts'

export default function Gauge(props) {
    const options = {
        chart: {
            height: 350,
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    size: '70%',
                }
            },
        },
        labels: ['Cricket'],
    }
    const series = [70]
    return (
        // <ReactApexChart options={options} series={series} type="radialBar" height={350} />
        <h1>This is where the meters go</h1>
    )
}