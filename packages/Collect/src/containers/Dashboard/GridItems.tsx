import React, { useEffect, useState } from 'react'
import Styles from "./Dashboard.module.sass"
import { RiDonutChartFill, RiLineChartFill, RiPieChart2Fill, RiBarChart2Fill } from 'react-icons/ri'
import { AiOutlineClose } from 'react-icons/ai'
import { FaInfoCircle } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Chart } from 'react-chartjs-2';

import {
    chartBar,
    chartPie,
    chartBarStacked,
    chartScatter,
    chartRadar,
    chartBubble,
    chartLine,
    commissionsDefault,
    chartDoughnut,
} from "../../helpers/chart"

const CustomGridItemComponent = React.forwardRef(({ style, className, item, index, children, deleteItem, isReport, ...props }: any, ref: any) => {
    const [itemData, setItemData] = useState(item)
    let barChart = chartBar()
    let pieChart = chartPie()
    let stackedChart = chartBarStacked()
    let scatteredChart = chartScatter()
    let radarChart = chartRadar()
    let bubbleChart = chartBubble()
    let lineChart = chartLine()
    let polarChart = commissionsDefault()
    let doughnutChart = chartDoughnut()

    const map: any = {
        'pie': pieChart,
        'bar': barChart,
        'radar': radarChart,
        'bubble': bubbleChart,
        'line': lineChart,
        'doughnut': doughnutChart,
        'stack': stackedChart,
        'polar': polarChart,
        'scatter': scatteredChart
    }

    const toggle = () => {
        let itemDataCopy = Object.assign({}, itemData)
        itemDataCopy.showInfo = !itemDataCopy.showInfo
        itemDataCopy.openChangeChartType = false
        setItemData(itemDataCopy)
    }

    const openChartChange = () => {
        let itemDataCopy = Object.assign({}, itemData)
        itemDataCopy.showInfo = false
        itemDataCopy.openChangeChartType = !itemDataCopy.openChangeChartType
        setItemData(itemDataCopy)
    }

    const changeChartType = (type: any) => {
        let itemDataCopy = Object.assign({}, itemData)
        itemDataCopy.openChangeChartType = false
        itemDataCopy.chart.type = type
        itemDataCopy.chart.optionsPieChart = map[type].options
        itemDataCopy.date = new Date()
        setItemData(itemDataCopy)
    }

    return (
        <div style={{ ...style }} className={className} ref={ref} {...props}>
            <div className={Styles.chart_container}>
                <header>
                    <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 250, hide: 400 }}
                        overlay={
                            <Tooltip id={`tooltip-error`}>
                                {itemData.name} {itemData.id}
                            </Tooltip>
                        }
                    >
                        <p>{itemData.name}</p>
                    </OverlayTrigger>
                    <div className={Styles.actions}>
                        <FaInfoCircle style={{ cursor: 'pointer' }} onClick={() => toggle()} size={20} /> &nbsp;
                        <Dropdown className="gridItemToggle">
                            <Dropdown.Toggle>
                                <FiMoreVertical style={{ cursor: 'pointer' }} size={20} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {(itemData.chartType !== 'SIMPLE_NUMBER'
                                    || itemData.chartType !== 'SIMPLE_NUMBER_PERCENTAGE'
                                    || itemData.chartType !== 'SIMPLE_NUMBER_TENURE') && <Dropdown.Item onClick={() => openChartChange()}>Change Chart view</Dropdown.Item>}
                                <Dropdown.Item onClick={() => deleteItem(item)}>Delete Chart</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </header>
                <div className={Styles.chart}>
                    {
                        (itemData.chartType === 'SIMPLE_NUMBER'
                            || itemData.chartType === 'SIMPLE_NUMBER_PERCENTAGE'
                            || itemData.chartType === 'SIMPLE_NUMBER_TENURE')
                        && <div style={{ height: '100%' }}>
                            {itemData.chart.data}
                        </div>
                    }
                    {
                        itemData.chartType !== 'SIMPLE_NUMBER'
                        && itemData.chartType !== 'SIMPLE_NUMBER_PERCENTAGE'
                        && itemData.chartType !== 'SIMPLE_NUMBER_TENURE'
                        && itemData.chart !== undefined
                        && itemData.chart.type !== undefined
                        &&
                        <div className={Styles.chartWidget}>
                            <Chart key={itemData?.date} type={itemData.chart.type} data={itemData.chart.data} options={itemData.chart.options} />
                        </div>
                    }
                    <div className={`${Styles.info} ${itemData.showInfo ? `${Styles.info_on}` : `${Styles.info_off}`}`}>
                        <p style={{ fontSize: '12px' }}>
                            {itemData.info}
                        </p>
                    </div>
                    <div className={`${Styles.chart_type} ${itemData.openChangeChartType ? `${Styles.chart_type_on}` : `${Styles.chart_type_off}`}`}>
                        <div className={Styles.chart_type_header}>
                            <p>
                                Change chart type
                            </p>
                            <p onClick={() => openChartChange()}>
                                <AiOutlineClose />
                            </p>
                        </div>
                        <div className={Styles.chart_type_container}>
                            <div>
                                {
                                    (itemData.chart.type === 'pie' ||
                                        itemData.chart.type === 'doughnut')
                                    && <>
                                        <div onClick={() => changeChartType('doughnut')}>
                                            <RiDonutChartFill size={30} />
                                            <p>Doughnut chart</p>
                                        </div>
                                        <div onClick={() => changeChartType('pie')}>
                                            <RiPieChart2Fill size={30} />
                                            <p>Pie chart</p>
                                        </div>
                                    </>
                                }
                                {
                                    (itemData.chart.type === 'bar' ||
                                        itemData.chart.type === 'line')
                                    && <>
                                        <div onClick={() => changeChartType('line')}>
                                            <RiLineChartFill size={30} />
                                            <p>Line chart</p>
                                        </div>

                                        <div onClick={() => changeChartType('bar')}>
                                            <RiBarChart2Fill size={30} />
                                            <p>Bar chart</p>
                                        </div>
                                    </>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {children}
        </div >
    );
})

export default CustomGridItemComponent