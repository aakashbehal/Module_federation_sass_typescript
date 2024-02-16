import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { DashboardActionCreator } from "../../store/actions/dashboard.actions"

import { Responsive, WidthProvider } from "react-grid-layout";
import { AiOutlineCaretDown, AiOutlineCaretUp } from 'react-icons/ai'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    // Tooltip,
    Legend,
    PointElement,
    LineElement,
    ChartType,
    defaults,
    registerables as registerablesJS
} from 'chart.js';
import CustomGridItemComponent from "./GridItems";
import { CgSpinnerAlt } from "react-icons/cg";
import { BsGearFill } from "react-icons/bs";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { dashboardService } from "../../services";
import MoveWidgets from "./MoveWidgets";
import Styles from "./Dashboard.module.sass"
import ChartDataLabels from 'chartjs-plugin-datalabels';

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
    createBackgroundColor,
    numberFormatter,
    numberFormatter_number_chart_without_prefix,
    chartBarStacked,
    chartLineStacked
} from "../../helpers/chart"


ChartJS.register(...registerablesJS);

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    // Tooltip,
    Legend,
    // ChartDataLabels,
);

interface widgetLayout {
    i: string,
    x: number,
    y: number,
    w: number,
    h: number,
    static?: boolean,
    minW?: number,
    minH?: number
}

type Props = {
    children: JSX.Element
}

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

const SECONDARY_COLOR = {
    BITTER_SWEET: 'rgba(255, 144, 129, 0.9)',
    BLUE_TINT: 'rgba(148, 222, 252, 0.9)',
    PINK_TINT: 'rgba(255, 237, 255, 0.9)',
    GREEN_TINT: 'rgba(153, 247, 219, 0.9)',
    YELLOW_TINT: 'rgba(255, 224, 153, 0.9)',
    PURPLE_TINT: 'rgba(219, 199, 255, 0.9)'
}

const Dashboard = ({ isReport, reportName }: any) => {
    const dispatch = useDispatch()
    let barChart = chartBar()
    let pieChart = chartPie()
    // let stackedChart = chartStacked()
    let scatteredChart = chartScatter()
    let radarChart = chartRadar()
    let bubbleChart = chartBubble()
    let lineChart = chartLine()
    let polarChart = commissionsDefault()
    let doughnutChart = chartDoughnut()
    let StackedBarChart = chartBarStacked()
    let LineStackedChart = chartLineStacked()

    const map: any = {
        'simple_pie': scatteredChart,
        'simple_bar': barChart,
        'simple_bar_horizontal': bubbleChart,
        'complex_bar_line_chart': barChart,
        'bar_double': barChart,
        'radar': radarChart,
        'bubble': bubbleChart,
        'line': lineChart,
        'line_fill': lineChart,
        'line_stacked': LineStackedChart,
        'doughnut': scatteredChart,
        // 'stack': stackedChart,
        'polar': polarChart,
        'scatter': scatteredChart,
        'simple_stacked_bar': StackedBarChart
    }

    const chartMap: any = {
        "SIMPLE_PIE": 'pie',
        "SIMPLE_BAR": 'bar',
        "SIMPLE_BAR_HORIZONTAL": 'bar',
        "COMPLEX_BAR_LINE_CHART": 'bar',
        "Bar_Double": 'bar',
        "Radar": 'bar',
        "Doughnut": 'doughnut',
        "SIMPLE_NUMBER": 'number',
        "SIMPLE_NUMBER_PERCENTAGE": 'number',
        "SIMPLE_NUMBER_TENURE": 'number',
        "SIMPLE_STACKED_BAR": 'bar',
        "Line_fill": 'line',
        "Line": 'line',
        "Line_stacked": 'line'
    }

    const ResponsiveReactGridLayout = WidthProvider(Responsive);
    const [gridItems, setGridItems] = useState<any>([])
    const [loadingWidgets, setLoadingWidgets] = useState<any>(false)
    // const [innerWidth, setInnerWidth] = useState<number>(0)
    const [isDemo, setIsDemo] = useState(false)
    const { widgets, loading, error, theme, successPreference } = useSelector((state: any) => ({
        widgets: state?.collect?.dashboard?.data,
        loading: state?.collect?.dashboard?.loading,
        error: state?.collect?.dashboard?.error,
        theme: state?.collect?.dashboard?.theme,
        successPreference: state?.collect?.dashboard?.successPreference
    }))
    const [layout, setLayout] = useState<widgetLayout[]>([])
    const [widgetDemo, setWidgetsDemo] = useState<any>([]);
    const [showMove, setShowMove] = useState(false)

    useEffect(() => {
        const isDemo = localStorage.getItem('isDemo')
        if (isReport) {
            getDummyReport(reportName)
        } else {
            if (isDemo && isDemo === 'true') {
                setIsDemo(true)
                getDemoDashboard()
            } else {
                setIsDemo(false)
                dispatch(DashboardActionCreator.getUserWidget())
            }
            // setInnerWidth(window.innerWidth)
            setLoadingWidgets(true)
        }
        return () => {
            dispatch(DashboardActionCreator.resetGetUserWidget())
        }
    }, [])

    useEffect(() => {
        if (isReport) {
            getDummyReport(reportName)
        }
    }, [reportName])

    useEffect(() => {
        if (isDemo || isReport) {
            if (widgetDemo && widgetDemo.length > 0) {
                createDynamicLayout(widgetDemo)
            }
        } else {
            if (widgets && widgets.length > 0) {
                createDynamicLayout(widgets)
            }
        }
    }, [widgets, widgetDemo])

    useEffect(() => {
        if (successPreference) {
            dispatch(DashboardActionCreator.getUserWidget())
            setShowMove(false)
        }
    }, [successPreference])

    const getDummyReport = async (type: any) => {
        const widgets = await dashboardService.getDummyReports(type)
        setWidgetsDemo(widgets.preference)
    }

    const getDemoDashboard = async () => {
        const widgets = await dashboardService.getDemoWidgets()
        setWidgetsDemo(widgets.preference.reverse())
    }

    const dataSetPercentage = (mtd: any, flag: any) => {
        return (
            <div className={Styles.numberWidget}>
                <div className={Styles.percentage}>
                    <h1>{mtd} %</h1>
                    {
                        flag <= 0 && <p><AiOutlineCaretDown color="red" />{flag}%</p>
                    }
                    {
                        flag >= 0 && <p><AiOutlineCaretUp color="green" />{flag}%</p>
                    }

                </div>
            </div>
        )
    }

    const dataPlan = (tenure: any, label: any, Styles: any) => {
        return (
            <div className={Styles.numberWidget}>
                <div className={Styles.percentage}>
                    <h1>{tenure} {label}</h1>
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

    const [widgetMap, setWidgetMap] = useState<any>({})

    const createDynamicLayout = (widgets: any) => {
        const dynamicLayout: widgetLayout[] = []
        let numberWidgets: any = [];
        let chartWidget: any = [];
        let isDashboardNew = true
        let widgetMap: any = {}
        widgets.map((widget: any) => {
            // check if dashboard has layout
            if (widget.top) {
                isDashboardNew = false
            }

            widgetMap[widget.widgetCode] = widget.widgetId

            if (
                chartMap[widget.chartType] !== 'SIMPLE_NUMBER'
                || chartMap[widget.chartType] !== 'SIMPLE_NUMBER_PERCENTAGE'
                || chartMap[widget.chartType] !== 'SIMPLE_NUMBER_TENURE'
            ) {
                chartWidget.push(widget)
            } else {
                numberWidgets.push(widget)
            }
            return widget
        })
        setWidgetMap(widgetMap)
        const NUMBER_WIDGET_MIN_WIDTH = 2;
        const NUMBER_WIDGET_MIN_HEIGHT = 4;
        numberWidgets = numberWidgets.sort((a: any, b: any) => (a.widgetCode > b.widgetCode) ? 1 : ((b.widgetCode > a.widgetCode) ? -1 : 0))
        chartWidget = chartWidget.sort((a: any, b: any) => (a.widgetCode > b.widgetCode) ? 1 : ((b.widgetCode > a.widgetCode) ? -1 : 0))
        const formattedWidgets = [...numberWidgets, ...chartWidget]
        if (!isDashboardNew) {
            // get layout from the chart
            formattedWidgets.map((widget) => {
                const widgetObj: any = {
                    i: widget.widgetCode,
                    x: widget.left,
                    y: widget.top,
                    w: widget.width,
                    h: widget.height
                }
                if (widget.chartType === 'SIMPLE_NUMBER' || widget.chartType === 'SIMPLE_NUMBER_PERCENTAGE' || widget.chartType === 'SIMPLE_NUMBER_TENURE') {
                    widgetObj.static = false
                    if (widgetObj.w < NUMBER_WIDGET_MIN_WIDTH) {
                        widgetObj.w = NUMBER_WIDGET_MIN_WIDTH
                    }
                    if (widgetObj.h < NUMBER_WIDGET_MIN_HEIGHT) {
                        widgetObj.h = NUMBER_WIDGET_MIN_HEIGHT
                    }
                } else {
                    widgetObj.static = false
                }
                dynamicLayout.push(widgetObj)
                return formattedWidgets
            })
        } else {
            let numberXIndex = 0;
            let numberYIndex = 0;
            let chartXIndex: any = null;
            let chartYIndex = 4;
            let row: number = 0;
            // create layout if dashboard is new
            formattedWidgets.map((widget, index) => {
                if (widget.chartType === 'SIMPLE_NUMBER' || widget.chartType === 'SIMPLE_NUMBER_PERCENTAGE' || widget.chartType === 'SIMPLE_NUMBER_TENURE') {
                    numberXIndex = index * 2
                    if (numberXIndex >= 12) {
                        numberYIndex = 4
                        numberXIndex = (index * 2) % 12 === 0 ? 0 : (Math.ceil((index * 2) / 12)) * 2
                    }
                    let widgetLayout: widgetLayout = {
                        i: widget.widgetCode,
                        x: numberXIndex,
                        y: numberYIndex,
                        w: 2,
                        h: 4
                    }
                    widgetLayout.static = false
                    widgetLayout.minW = 4
                    widgetLayout.minH = 2
                    dynamicLayout.push(widgetLayout)
                    if (numberXIndex >= 10) {
                        row += 1
                    }
                } else {
                    if (row > 1) {
                        chartYIndex = ((row - 1) * 9) + 4
                    }
                    chartXIndex = (index * 4) % 12 === 0 ? 0 : (index * 4) % 12
                    if (chartXIndex >= 8) {
                        row += 1
                    }
                    let widgetLayout: widgetLayout = {
                        i: widget.widgetCode,
                        x: chartXIndex,
                        y: chartYIndex,
                        w: 4,
                        h: 9
                    }
                    widgetLayout.minW = 4
                    widgetLayout.minH = 9
                    dynamicLayout.push(widgetLayout)
                }
                return widget
            })
        }
        setLayout(dynamicLayout)
        formatWidgets(formattedWidgets)
    }

    const formatWidgets = (widgets: any) => {
        if (widgets && widgets.length > 0) {
            let copyWidgets = widgets.map((widget: any) => {
                widget.id = widget.widgetCode
                widget.name = widget.fullName
                widget.info = widget.description
                widget.showInfo = false
                if (
                    widget.datasets
                    && (
                        widget.chartType === 'SIMPLE_NUMBER'
                        || widget.chartType === 'SIMPLE_NUMBER_PERCENTAGE'
                        || widget.chartType === 'SIMPLE_NUMBER_TENURE'
                    )
                    && widget.datasets.length > 0
                ) {
                    if (widget.chartType === 'SIMPLE_NUMBER_TENURE' || widget.datasets.length === 1) {
                        widget.chart = {
                            data: dataPlan(widget.datasets[0].data, widget.datasets[0].label, Styles)
                        }
                    } else if (widget.chartType === 'SIMPLE_NUMBER_PERCENTAGE') {
                        widget.chart = {
                            data: dataSetPercentage(widget.datasets[0].data, widget.datasets[1].data)
                        }
                    } else {
                        widget.chart = {
                            data: dataSet(widget.datasets[0].label, widget.datasets[1].label, widget.datasets[0].data || 0, widget.datasets[1].data || 0, Styles)
                        }
                    }
                } else if (
                    (!widget.datasets || widget.datasets.length === 0)
                    && (
                        widget.chartType !== 'SIMPLE_NUMBER'
                        || widget.chartType !== 'SIMPLE_NUMBER_PERCENTAGE'
                        || widget.chartType !== 'SIMPLE_NUMBER_TENURE'
                    )
                ) {
                    widget.chartType = 'SIMPLE_NUMBER'
                    widget.chart = {
                        data: <div style={{
                            height: "100%",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <p style={{ textAlign: 'center' }}>No Data to Display</p>
                        </div>
                    }
                } else {
                    const defaultOption = JSON.parse(JSON.stringify(map[widget.chartType.toLowerCase()].options))
                    const data = JSON.parse(JSON.stringify({
                        labels: widget.labels,
                        datasets: createBackgroundColor(widget.datasets, widget.chartType),
                    }))
                    if (defaultOption?.scales?.y1 && widget.chartType !== 'COMPLEX_BAR_LINE_CHART') {
                        delete defaultOption.scales.y1
                        defaultOption.scales.y.ticks.callback = numberFormatter
                        delete defaultOption.scales.y.ticks.stepSize
                        delete defaultOption.scales.y.suggestedMax
                    } else if (defaultOption?.scales?.y1) {
                        defaultOption.scales.y1.ticks.stepSize = 10
                        defaultOption.scales.y1.suggestedMax = 100
                    }
                    if (defaultOption?.scales?.y?.suggestedMax) {
                        let maxPoint = 0
                        widget.datasets.map((dataset: any) => {
                            dataset.data.map((d: any, index: any) => {
                                if (d > maxPoint) {
                                    maxPoint = d
                                }
                                return d
                            })
                        })
                        if (isDemo) {
                            //remove this code
                            if (widget.widgetCode === 'DW0007') {
                                defaultOption.scales.y.ticks.stepSize = 10000000
                                defaultOption.scales.y1.ticks.stepSize = 1000
                                defaultOption.scales.y.suggestedMax = 80000000
                                defaultOption.scales.y1.suggestedMax = 8000
                                defaultOption.scales.y.ticks.callback = numberFormatter
                            }
                            if (widget.widgetCode === 'DW0008') {
                                defaultOption.scales.y.ticks.stepSize = 250000
                                defaultOption.scales.y1.ticks.stepSize = 200
                                defaultOption.scales.y.suggestedMax = 1500000
                                defaultOption.scales.y1.suggestedMax = 1600
                                defaultOption.scales.y.ticks.callback = numberFormatter
                                defaultOption.scales.y.title.text = "Face Value ($)"
                            }

                            if (widget.widgetCode === 'DW0009') {
                                defaultOption.scales.y.ticks.stepSize = 1000000
                                defaultOption.scales.y1.ticks.stepSize = 1000
                                defaultOption.scales.y.suggestedMax = 4000000
                                defaultOption.scales.y1.suggestedMax = 4000
                                defaultOption.scales.y.ticks.callback = numberFormatter
                                defaultOption.scales.y.title.text = "Face Value ($)"
                            }
                            if (widget.widgetCode === 'DW0012') {
                                defaultOption.scales.y.ticks.stepSize = 1000000
                                defaultOption.scales.y1.ticks.stepSize = 500
                                defaultOption.scales.y.suggestedMax = 6000000
                                defaultOption.scales.y1.suggestedMax = 3500
                                defaultOption.scales.y.ticks.callback = numberFormatter
                            }
                            if (widget.widgetCode === 'DW0011') {
                                defaultOption.plugins.datalabels.formatter = numberFormatter
                            }
                            if (widget.widgetCode === 'DW0010') {
                                defaultOption.plugins.datalabels.formatter = numberFormatter
                            }
                        } else {
                            if (maxPoint <= 100) {
                                defaultOption.scales.y.ticks.stepSize = 10
                            } else if (maxPoint > 100 && maxPoint <= 1000) {
                                defaultOption.scales.y.ticks.stepSize = 100
                            } else if (maxPoint > 1000 && maxPoint <= 10000) {
                                defaultOption.scales.y.ticks.stepSize = 1000
                            } else if (maxPoint > 10000 && maxPoint <= 100000) {
                                defaultOption.scales.y.ticks.stepSize = 10000
                            } else if (maxPoint > 100000 && maxPoint <= 1000000) {
                                defaultOption.scales.y.ticks.stepSize = 100000
                            } else if (maxPoint > 1000000 && maxPoint <= 10000000) {
                                defaultOption.scales.y.ticks.stepSize = 1000000
                            }
                            defaultOption.scales.y.suggestedMax = maxPoint + ((maxPoint / 2) / 2)
                        }
                    }
                    if (!isDemo) {
                        if (widget.widgetCode === 'DW0010' || widget.widgetCode === "DW0009") {
                            defaultOption.scales.y.title.text = "Face Value ($)"
                        }
                    }

                    if (isReport) {
                        if (defaultOption?.scales?.y) {
                            defaultOption.scales.y.ticks.callback = function (value: any) {
                                return value
                            }
                            delete defaultOption.scales.y.title
                        }
                        if (reportName === 'Compliance_Dashboard' || reportName === 'Compliance_Dashboard_alfa') {
                            if (widget.widgetCode === 'DW005') {
                                defaultOption.scales.y.ticks.stepSize = 5
                                defaultOption.scales.y1.ticks.stepSize = 2
                                defaultOption.scales.y.suggestedMax = 40
                                defaultOption.scales.y1.suggestedMax = 16
                                delete defaultOption.scales.y1.title
                                defaultOption.scales.y1.ticks.callback = function (value: any) {
                                    return value + '%'
                                }
                            }
                        }
                        if (reportName === 'Inventory_Management_Dashboard') {
                            if (widget.widgetCode === 'DW005') {
                                defaultOption.scales.y.ticks.callback = function (value: any) {
                                    return "$" + value.toLocaleString('en');
                                }
                            }
                            if (widget.widgetCode === 'DW003' || widget.widgetCode === 'DW006' || widget.widgetCode === 'DW007') {
                                defaultOption.plugins.legend.display = false
                            }
                        }
                        if (reportName === 'Partner_Performance_Dashboard') {
                            if (widget.widgetCode === 'DW001' || widget.widgetCode === 'DW002') {
                                defaultOption.scales.y.ticks.callback = function (value: any) {
                                    return '$' + value.toLocaleString('en');
                                }
                            }
                            if (widget.widgetCode === 'DW009'
                                || widget.widgetCode === 'DW004'
                                || widget.widgetCode === 'DW005'
                                || widget.widgetCode === 'DW006'
                                || widget.widgetCode === 'DW007'
                                || widget.widgetCode === 'DW008') {
                                defaultOption.scales.y.ticks.stepSize = 5;
                                defaultOption.scales.y.ticks.callback = function (value: any) {
                                    return value + '%'
                                }
                            }
                            if (widget.widgetCode === 'DW003') {
                                defaultOption.scales.y.ticks.stepSize = 1000
                                defaultOption.scales.y.ticks.callback = function (value: any) {
                                    return '$' + value.toLocaleString('en');
                                }
                            }
                            if (widget.widgetCode === 'DW017'
                                || widget.widgetCode === 'DW016') {
                                defaultOption.scales.y.ticks.stepSize = 1
                                defaultOption.scales.y.ticks.callback = function (value: any) {
                                    return value + '%'
                                }
                            }
                            if (widget.widgetCode === 'DW014'
                                || widget.widgetCode === 'DW015') {
                                defaultOption.scales.y.ticks.stepSize = 10
                                defaultOption.scales.y.ticks.callback = function (value: any) {
                                    return value + '%'
                                }
                            }
                            if (widget.widgetCode === 'DW014') {
                                defaultOption.scales.y.min = 40
                                defaultOption.scales.y.suggestedMax = 85
                            }
                            if (widget.widgetCode === 'DW010'
                                || widget.widgetCode === 'DW011'
                                || widget.widgetCode === 'DW012'
                                || widget.widgetCode === 'DW013'
                                || widget.widgetCode === 'DW018'
                                || widget.widgetCode === 'DW019'
                            ) {
                                defaultOption.scales.y.ticks.stepSize = 2
                            }

                        }
                        if (reportName === 'Portfolio_Performance_Dashboard') {
                            if (widget.widgetCode === 'DW001'
                                || widget.widgetCode === 'DW002'
                                || widget.widgetCode === 'DW005'
                                || widget.widgetCode === 'DW004'
                                || widget.widgetCode === 'DW007') {
                                defaultOption.scales.y.ticks.callback = function (value: any) {
                                    return '$' + value.toLocaleString('en');
                                }
                            }
                            if (widget.widgetCode === 'DW003'
                                || widget.widgetCode === 'DW006'
                                || widget.widgetCode === 'DW008'
                                || widget.widgetCode === 'DW009'
                                || widget.widgetCode === 'DW011'
                                || widget.widgetCode === 'DW012') {
                                defaultOption.scales.y.ticks.stepSize = 1
                                defaultOption.scales.y.ticks.callback = function (value: any) {
                                    return value + '%'
                                }
                            }
                            if (widget.widgetCode === 'DW007' || widget.widgetCode === 'DW008' || widget.widgetCode === 'DW009') {
                                defaultOption.plugins.legend.display = false
                            }
                        }
                    }

                    widget.chart = {
                        data: data,
                        options: defaultOption,
                        type: chartMap[widget.chartType]
                    }
                    if (widget.chartType === 'SIMPLE_PIE') {
                        defaultOption.plugins.datalabels.formatter = numberFormatter_number_chart_without_prefix
                    }
                }

                return widget
            })
            setLoadingWidgets(false)
            setGridItems(copyWidgets)
        }
    }

    // ====================================
    // layout save
    // ====================================
    let isChanging = false
    const onLayoutChange = (currentLayout: any) => {
        if (isChanging) {
            currentLayout = currentLayout.map((widget: any) => {
                return {
                    "widgetId": widgetMap[widget.i],
                    "leftPoint": widget.x,
                    "topPoint": widget.y,
                    "height": widget.h,
                    "width": widget.w
                }
            })
            if (!isDemo && !isReport) {
                dashboardService.savePreference(currentLayout)
            }
        }
        isChanging = false
    }

    const onDragStart = () => {
        isChanging = true
    }

    const onResizeStart = () => {
        isChanging = true
    }

    const deleteItem = (item: any) => {
        let widgetsCopy = Object.assign([], widgets)
        widgetsCopy = widgetsCopy.filter((widget: any) => {
            if (widget.widgetId !== item.widgetId) {
                return {
                    "widgetId": widgetMap[widget.i],
                    "leftPoint": widget.x,
                    "topPoint": widget.y,
                    "height": widget.h,
                    "width": widget.w
                }
            } else {
                return false
            }

        })
        dispatch(DashboardActionCreator.savePreference(widgetsCopy))
    }

    const contentRef: any = useRef([]);

    const memoWidgets = useMemo(() => {
        if (gridItems.length === 0) return gridItems
        return gridItems.map((item: any, i: any) => {
            return (
                <CustomGridItemComponent
                    ref={(el) => (contentRef.current[i] = el)}
                    key={item.id}
                    index={i}
                    item={item}
                    deleteItem={(item: any) => deleteItem(item)}
                    style
                    isReport={isReport}
                    className={Styles.gridItem} />
            )
        })
    }, [gridItems])

    const memoReactGrid = useMemo(() => {
        return <ResponsiveReactGridLayout
            layouts={{ lg: layout }}
            measureBeforeMount={true}
            className={Styles.gridLayout}
            rowHeight={30}
            breakpoints={{ lg: 1366, md: 1200, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
            useCSSTransforms={false}
            isDraggable={true}
            isResizable={true}
            isBounded={false}
            onLayoutChange={onLayoutChange}
            // compactType={"horizontal"}
            onResize={handleResize}
            margin={[10, 10]}
            onDragStart={onDragStart}
            onResizeStart={onResizeStart}
        >
            {
                memoWidgets
            }
        </ResponsiveReactGridLayout >
    }, [layout])

    return (
        <>
            <div className="layout">
                {
                    !isDemo && !isReport
                    && <header style={{ textAlign: 'right', padding: '0 1rem' }}>
                        <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 250, hide: 400 }}
                            overlay={
                                <Tooltip id={`tooltip-error`}>
                                    Edit Dashboard
                                </Tooltip>
                            }
                        >
                            <BsGearFill onClick={() => setShowMove(true)} size={20} style={{ cursor: 'pointer' }} />
                        </OverlayTrigger>
                    </header>
                }
                {
                    (loading || loadingWidgets) &&
                    <div style={{ width: '100%', textAlign: 'center' }} >
                        <CgSpinnerAlt size={40} className="spinner" />
                    </div>
                }
                {
                    (!loading && !loadingWidgets) &&
                    memoReactGrid
                }
            </div >
            {showMove && <MoveWidgets show={showMove} onHide={() => setShowMove(false)} />}
        </>
    )
}

export default Dashboard

// padding: 0.3rem
// 	border-radius: 0.2rem
// 	height: 25px !important
// 	width: 25px !important
// 	transition: all ease .3s