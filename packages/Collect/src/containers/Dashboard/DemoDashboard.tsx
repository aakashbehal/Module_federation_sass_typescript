import React, { createRef, useEffect, useRef, useState, useCallback } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import Styles from "./Dashboard.module.sass"
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai'

import ChartDataLabels from 'chartjs-plugin-datalabels';
import CustomGridItemComponent from "./GridItems"

import {
    chartBar,
    chartPie,
    chartScatter,
    chartRadar,
    chartBubble,
    chartLine,
    commissionsDefault,
    chartDoughnut,
    rpcYtc,
    chartScatter1,
    dataSet,
    chartBarStacked
} from "../../helpers/chart"

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ChartType,
    defaults,
    registerables as registerablesJS
} from 'chart.js';

ChartJS.register(...registerablesJS);
ChartJS.register(
    ChartDataLabels,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
defaults.font.family = "'VisbyCF-Regular', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
defaults.animation = false
defaults.layout = {
    padding: {
        left: 5,
        right: 5,
        top: 0,
        bottom: 0
    }
}

type Props = {
    children: JSX.Element
}

const DemoDashboard = ({ children }: Props) => {
    let barChart = chartBar()
    let pieChart = chartPie()
    let chartStacked = chartBarStacked()
    let scatteredChart = chartScatter()
    let scatteredChart1 = chartScatter1()
    let radarChart = chartRadar()
    let bubbleChart = chartBubble()
    let lineChart = chartLine()
    let polarChart = commissionsDefault()
    let doughnutChart = chartDoughnut()
    let rpc = rpcYtc()

    const ResponsiveReactGridLayout = WidthProvider(Responsive);

    const dataSetPercentage = (mtd: any, flag: any) => {
        return (
            <div className={Styles.numberWidget}>
                <div className={Styles.percentage}>
                    <h1>{mtd} %</h1>
                    {
                        flag && <p><AiOutlineCaretDown color="red" /> 2%</p>
                    }
                    {
                        !flag && <p><AiOutlineCaretUp color="green" /> 2%</p>
                    }

                </div>
            </div>
        )
    }

    const dataPlan = (mtd: any) => {
        return (
            <div className={Styles.numberWidget}>
                <div className={Styles.percentage}>
                    <h1>{mtd}</h1>
                </div>
            </div>
        )
    }

    const handleResize = useCallback(
        (l: any, oldLayoutItem: any, layoutItem: any, placeholder: any) => {
            const heightDiff = layoutItem.h - oldLayoutItem.h;
            const widthDiff = layoutItem.w - oldLayoutItem.w;
            const changeCoef = oldLayoutItem.w / oldLayoutItem.h;
            if (Math.abs(heightDiff) < Math.abs(widthDiff)) {
                layoutItem.h = layoutItem.w / changeCoef;
                placeholder.h = layoutItem.w / changeCoef;
            } else {
                layoutItem.w = layoutItem.h * changeCoef;
                placeholder.w = layoutItem.h * changeCoef;
            }
        },
        []
    )

    const [gridItems, setGridItems] = useState<any>([])

    useEffect(() => {
        setGridItems([
            {
                showInfo: false,
                info: `Total collections received MTD and YTD`,
                id: "DW0001",
                name: "Collections",
                chartType: 'SIMPLE_NUMBER',
                chart: {
                    data: dataSet("MTD", "YTD", 1000000, 2000000, Styles),
                }
            },
            {
                showInfo: false,
                info: `Total promises-to-pay (count and value), established month-to-date.`,
                id: 2,
                name: "Promises MTD",
                chartType: 'SIMPLE_NUMBER',
                chart: {
                    data: dataSet("#", "$", 5000, 500000, Styles),
                }
            },
            {
                showInfo: false,
                info: `Total promises that paid by the scheduled payment date within the month.`,
                id: 3,
                name: "Kept MTD",
                chartType: 'SIMPLE_NUMBER',
                chart: {
                    data: dataSet("#", "$", 3000, 350000, Styles),
                }
            },
            {
                showInfo: false,
                info: `Total promises-to-pay (count and value) month-to-date that were broken/ not received by scheduled payment date.`,
                id: 4,
                name: "Broken MTD",
                chartType: 'SIMPLE_NUMBER',
                chart: {
                    data: dataSet("#", "$", 2000, 150000, Styles),
                }
            },
            {
                showInfo: false,
                info: `The average settlement % applied to the portfolio YTD - calculated as the aggregate settlement amounts divided by the aggregate placed balances.`,
                id: 5,
                name: "Average Settlement YTD",
                chartType: 'SIMPLE_NUMBER',
                chart: {
                    data: dataSetPercentage(85, true),
                }
            },
            {
                showInfo: false,
                info: `The average payment plan term accepted on the portfolio YTD - calculated as the average term of all payment plans established YTD.`,
                id: 6,
                name: "Average Payment Plan YTD",
                chartType: 'SIMPLE_NUMBER',
                chart: {
                    data: dataPlan("6 months"),
                }
            },
            // {
            //     showInfo: false,
            //     info: `Total promises that paid by the scheduled payment date within the month.`,
            //     id: 7,
            //     name: "Pending MTD",
            //     chartType: 'SIMPLE_NUMBER',
            //     chart: {
            //         data: dataSet("#", "$", 3000, 500000, Styles),
            //     }
            // },
            {
                showInfo: false,
                openChangeChartType: false,
                info: `Allocation of accounts and dollar value YTD across collections channels.`,
                id: 8,
                name: "Placed by Channel YTD",
                chartType: 'chart',
                chart: {
                    data: barChart.data,
                    options: barChart.options,
                    type: 'bar'
                }
            },
            {
                showInfo: false,
                openChangeChartType: false,
                info: `Allocation of accounts and dollar value not placed to an active collections channel YTD by reason.`,
                id: 9,
                name: "Not Placed YTD",
                chartType: 'chart',
                chart: {
                    data: pieChart.data,
                    options: pieChart.options,
                    type: 'bar'
                }
            },
            {
                showInfo: false,
                openChangeChartType: false,
                info: `Allocation and placement of accounts and dollar value to each partner YTD.`,
                id: 10,
                name: "Partner Placement YTD",
                chartType: 'chart',
                chart: {
                    data: chartStacked.data,
                    options: chartStacked.options,
                    type: 'bar'
                }
            },
            {
                showInfo: false,
                openChangeChartType: false,
                info: `Composition of overall portfolio by product type YTD.`,
                id: 11,
                name: "Product YTD ($)",
                chartType: 'chart',
                chart: {
                    data: scatteredChart.data,
                    options: scatteredChart.options,
                    type: 'SIMPLE_PIE'
                }
            },
            {
                showInfo: false,
                openChangeChartType: false,
                info: `Composition of overall portfolio by product type YTD.`,
                id: 12,
                name: "Product YTD (# of Accounts)",
                chartType: 'chart',
                chart: {
                    data: scatteredChart1.data,
                    options: scatteredChart1.options,
                    type: 'SIMPLE_PIE'
                }
            },
            {
                showInfo: false,
                openChangeChartType: false,
                info: `Placed portfolio YTD by ranked by expected value decile (1 = high; 10 = low).`,
                id: 13,
                name: "EqV YTD",
                chartType: 'chart',
                chart: {
                    data: radarChart.data,
                    options: radarChart.options,
                    type: 'bar'
                }
            },
            {
                showInfo: false,
                openChangeChartType: false,
                info: `Total number of disputes and complaints received YTD, and total number resolved YTD.`,
                id: 14,
                name: "Disputes & Complaints YTD",
                chartType: 'chart',
                chart: {
                    data: bubbleChart.data,
                    options: bubbleChart.options,
                    type: 'bar'
                }
            },
            {
                showInfo: false,
                openChangeChartType: false,
                info: `Total number of Right Party Contacts YTD by outreach method.`,
                id: 15,
                name: "RPC YTD",
                chartType: 'chart',
                chart: {
                    data: rpc.data,
                    options: rpc.options,
                    type: 'bar'
                }
            },
            {
                showInfo: false,
                openChangeChartType: false,
                info: `Total number of attempts to reach a consumer YTD by outreach method.`,
                id: 16,
                name: "Attempts YTD",
                chartType: 'chart',
                chart: {
                    data: doughnutChart.data,
                    options: doughnutChart.options,
                    type: 'bar'
                }
            },
            {
                showInfo: false,
                openChangeChartType: false,
                info: `Total collections received YTD by channel.`,
                id: 17,
                name: "Collections by Channel YTD",
                chartType: 'chart',
                chart: {
                    data: lineChart.data,
                    options: lineChart.options,
                    type: 'bar'
                }
            },
            {
                showInfo: false,
                openChangeChartType: false,
                info: `Total commissions paid YTD by partner and Equabli.`,
                id: 18,
                name: "Commissions",
                chartType: 'chart',
                chart: {
                    data: polarChart.data,
                    options: polarChart.options,
                    type: 'bar'
                }
            },

        ])
    }, [])

    const layout = [
        { isBounded: true, i: 'DW0001', x: 0, y: 0, w: 2, h: 4, static: true },
        { isBounded: true, i: '2', x: 2, y: 0, w: 2, h: 4, static: true },
        { isBounded: true, i: '3', x: 4, y: 0, w: 2, h: 4, static: true },
        { isBounded: true, i: '4', x: 6, y: 0, w: 2, h: 4, static: true },
        { isBounded: true, i: '5', x: 8, y: 0, w: 2, h: 4, static: true },
        { isBounded: true, i: '6', x: 10, y: 0, w: 2, h: 4, static: true },
        // { isBounded: true, i: '7', x: 8, y: 0, w: 2, h: 4, static: true },
        { isBounded: true, i: '8', x: 0, y: 5, w: 4, h: 9, minW: 4, minH: 9 },
        { isBounded: true, i: '9', x: 4, y: 5, w: 4, h: 9, minW: 4, minH: 9 },
        { isBounded: true, i: '10', x: 8, y: 5, w: 4, h: 9, minW: 4, minH: 9 },
        { isBounded: true, i: '11', x: 0, y: 9, w: 4, h: 9, minW: 4, minH: 9 },
        { isBounded: true, i: '12', x: 4, y: 9, w: 4, h: 9, minW: 4, minH: 9 },
        { isBounded: true, i: '13', x: 8, y: 9, w: 4, h: 9, minW: 4, minH: 9 },
        { isBounded: true, i: '14', x: 0, y: 12, w: 4, h: 9, minW: 4, minH: 9 },
        { isBounded: true, i: '15', x: 4, y: 12, w: 4, h: 9, minW: 4, minH: 9 },
        { isBounded: true, i: '16', x: 8, y: 12, w: 4, h: 9, minW: 4, minH: 9 },
        { isBounded: true, i: '17', x: 0, y: 15, w: 4, h: 9, minW: 4, minH: 9 },
        { isBounded: true, i: '18', x: 4, y: 15, w: 4, h: 9, minW: 4, minH: 9 }
    ];

    const contentRef = useRef(gridItems.map(() => createRef()));

    return (
        <div className="layout">
            <ResponsiveReactGridLayout
                layouts={{ lg: layout }}
                measureBeforeMount={false}
                className={Styles.gridLayout}
                rowHeight={30}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                useCSSTransforms={true}
                isDraggable={true}
                isResizable={true}
                isBounded={false}
                onResize={handleResize}
                margin={[10, 10]}
            >
                {
                    gridItems.map((item: any, i: any) => {
                        return (
                            <CustomGridItemComponent
                                ref={contentRef.current[i]}
                                key={item.id}
                                index={i}
                                item={item}
                                style
                                className={Styles.gridItem} />
                        );
                    })
                }
            </ResponsiveReactGridLayout >
        </div >
    )
}



export default DemoDashboard;