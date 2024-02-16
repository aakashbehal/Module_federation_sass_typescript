import { userService } from "singleSignOn/UserService";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { CgSpinnerAlt } from "react-icons/cg";
export const axiosCustom = axios.create(); // export this and use it in all your components

/**
 * Method is used to format date
 * @param date 
 * @returns Date: YYYY-MM-DD
 */
export const dateFormatterForRequest = (date: any) => {
    if (!date) {
        return date;
    }
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    // return `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`;
    return `${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}-${year}`;
};

/**
 * Method used for file upload
 * @param date 
 * @returns YYYYMMDD
 */
export const dateFormatterForRequestFileUpload = (date: any) => {
    if (!date) {
        return date;
    }
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${year}${month > 9 ? month : `0${month}`}${day > 9 ? day : `0${day}`}`;
};

/**
 * Method is used to format date in date time format
 * @param date 
 * @returns Date: YYYY-MM-DD HH:MM:SS
 */
export const dateTimeFormat = (date: any) => {
    if (!date) {
        return date;
    }
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();
    const time = `${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}:${seconds > 9 ? seconds : `0${seconds}`}`;
    // const d1 = `${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`;
    const d1 = `${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}-${year}`;
    return `${d1} ${time}`;
};

/**
 * Method is used to check type of data provided
 * @param str 
 * @returns 
 */
export const checkType = (str: any, header: any) => {
    if (header === 'originalAccountNumber' || header === 'clientAccountNumber') {
        return false
    }
    if (typeof str !== 'string') {
        return true;
    }
    return !isNaN(str as any) && !isNaN(parseFloat(str));
};

export const encryptPassword: any = (password: any) => {
    // const salt = bcrypt.genSaltSync(10);
    // const hash = bcrypt.hashSync(password, salt);
    // return hash
    return password
}

export const handleResponse = (response: any) => {
    if (!response.data.validation) {
        if (response.data.message === 'Token Expired!') {
            userService.logoutAuthExpired()
        }
        throw response.data.message
    }
    return response.data;
}

export const useAxiosLoader = () => {
    const [counter, setCounter] = useState(0);

    const interceptors = useMemo(() => {
        const inc = () => setCounter(counter => counter + 1);
        const dec = () => setCounter(counter => counter - 1);

        return ({
            request: (config: any) => (inc(), config),
            response: (response: any) => (dec(), response),
            error: (error: any) => (dec(), Promise.reject(error)),
        });
    }, []); // create the interceptors

    useEffect(() => {
        // add request interceptors
        const reqInterceptor = axiosCustom.interceptors.request.use(interceptors.request, interceptors.error);
        // add response interceptors
        const resInterceptor = axiosCustom.interceptors.response.use(interceptors.response, interceptors.error);
        return () => {
            // remove all intercepts when done
            axiosCustom.interceptors.request.eject(reqInterceptor);
            axiosCustom.interceptors.response.eject(resInterceptor);
        };
    }, [interceptors]);

    return [counter > 0];
};


// export const GlobalLoader = () => {
//     const [loading] = useAxiosLoader();
//     return (
//         <div>
//             {
//                 loading ? <CgSpinnerAlt size={20} className={`spinner global_loader`} /> : ''
//             }
//         </div>
//     );
// }

export const httpInterceptor = () => {
    const noAuthRequired = [
        "login",
        // "allClients",
        "getAllStates",
        "getallstates",
        // "getAllPartners",
        "getAllAccountStatuses",
        "getAllRecordStatus",
        "getRecordStatusById",
        "getRecordStatusByShortName",
        "authenticate",
        "logout",
        "activateme",
        "record_source",
        "secret_question",
        "resetPasswordByUserDetails",
        "getSecurityQuesByUserDetails",
        "validateSecurityQuesByUserDetails",
        "resetPasswordByUserDetails",
        "setPasswordAndSecurityQues",
        "changePasswordByUserDetails",
        "registration",
        "getClientOrPartnerIdByCode",
        "insertIntoAppErrorLog"
    ]

    const connectionAllowed: any = {
        'localhost': ['service2.equabli.net', 'service1.equabli.net'],
        'dev.equabli.net': ['service2.equabli.net', 'service1.equabli.net'],
        'qa.equabli.net': ['qaservice2.equabli.net:8443', 'qaservice1.equabli.net:8443'],
        'uat.equabli.net': ['uatservice2.equabli.net:8443', 'uatservice1.equabli.net:8443'],
        'www.equabli.net': ['prodservice2.equabli.net', 'prodservice1.equabli.net'],
    }

    axiosCustom.interceptors.request.use(
        async (request: any) => {
            try {
                let user = userService.getUser();
                let token = userService.getAccessToken();
                if (request.url.includes('changePasswordByUserDetails')) {
                    user = userService.getTempUser()
                }
                const url = request.url.split('/')
                const urlString = url[url.length - 1].split('?')
                if (connectionAllowed[window.location.hostname].indexOf(url[2]) === -1) {
                    return new axios.Cancel(`Connect not allowed`)
                }
                if (token === null && urlString[0] === 'logout') {
                    localStorage.removeItem('user');
                }
                if (
                    noAuthRequired.indexOf(urlString[0]) === -1
                ) {
                    if (user.orgType === 'PT') {
                        if (request.method === 'get') {
                            if ((request.url).indexOf("?") !== -1) {
                                request.url += `&partnerId=${user.partnerId}`
                            } else {
                                request.url += `?partnerId=${user.partnerId}`
                            }
                        }
                        if (request.method === 'post' || request.method === 'put') {
                            request.data.partnerId = user.partnerId
                        }
                    }
                    if (user.orgType === 'CL') {
                        if (request.method === 'get') {
                            if ((request.url).indexOf("?") !== -1) {
                                request.url += `&clientId=${user.clientId}`
                            } else {
                                request.url += `?clientId=${user.clientId}`
                            }
                        }
                        if (request.method === 'post' || request.method === 'put') {
                            request.data.clientId = user.clientId
                        }
                    }
                    request.headers['Authorization'] = `Bearer ${token}`;
                }

                request.headers['rqsOrigin'] = 'web';
                return request
            } catch (err) {
                return Promise.reject(err)
            }
        },
        error => {
            return Promise.reject(error)
        }
    )
}

function getRange(start: any, end: any) {
    let startN = +(start.split(":")[0])
    let endN = +(end.split(":")[0])
    let range: any = []
    if (startN === 8) {
        range.push(8)
    }
    while (startN < endN - 1) {
        startN++
        range.push(startN)
    }
    if (endN === 21) {
        range.push(endN)
    }
    return range
}

function getRangeArray(jsonStr: any) {
    try {
        const data = jsonStr;
        const exclusionTime: any = [];
        const timeFrom = 8; //  start time (08:00)
        const timeTo = 21; //  end time (21:00)

        let lastInclusionTo = timeFrom;
        let time = data.time || data.excludedTime
        const sortedTime = time.sort((a: any, b: any) => {
            const aFrom = parseInt(a.timeFrom.padStart(4, '0'));
            const bFrom = parseInt(b.timeFrom.padStart(4, '0'));
            return aFrom - bFrom;
        });

        for (const item of sortedTime) {
            const inclusionFrom = parseInt(item.timeFrom.padStart(4, '0'));
            const inclusionTo = parseInt(item.timeTo.padStart(4, '0'));

            if (inclusionFrom > lastInclusionTo) {
                exclusionTime.push([lastInclusionTo, inclusionFrom]);
            }

            lastInclusionTo = inclusionTo;
        }

        if (lastInclusionTo < timeTo) {
            exclusionTime.push([lastInclusionTo, timeTo]);
        }
        jsonStr.exclusionTimeRange = exclusionTime
        return jsonStr;
    } catch (error) {
        console.error("Error parsing JSON or missing key:", error);
        return [];
    }
}

export const convertInclusionToExclusion = (inclusion: any) => {
    let excludedDays: any = [];
    for (const day of inclusion.includedWeekDays) {
        let inclusionWeekDay: any = [];
        const result = Object.assign({}, getRangeArray(day))
        for (let range of result.exclusionTimeRange) {
            if (!(range[0] === 8 && range[1] === 21)) {
                let timeTo = `${range[1] < 10 ? `0${range[1]}` : range[1]}:00`
                let timeFrom = `${range[0] < 10 ? `0${range[0]}` : range[0]}:00`
                inclusionWeekDay.push(
                    {
                        timeFrom,
                        timeTo
                    }
                )
            }
        }
        delete result.default
        delete result.exclusionTimeRange
        delete result.time
        result.excludedTime = inclusionWeekDay
        excludedDays.push(result)
    }

    inclusion.excludedWeekDay = excludedDays
    return inclusion
}

export const getBrowserTimeZone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export const convertExclusionToInclusion = (exclusions: any) => {
    const days = [
        { weekDay: 1, "day": "Sunday", "flag": true, default: true, "time": [{ timeFrom: '08:00', timeTo: "21:00" }] },
        { weekDay: 2, "day": "Monday", "flag": true, default: true, "time": [{ timeFrom: '08:00', timeTo: "21:00" }] },
        { weekDay: 3, "day": "Tuesday", "flag": true, default: true, "time": [{ timeFrom: '08:00', timeTo: "21:00" }] },
        { weekDay: 4, "day": "Wednesday", "flag": true, default: true, "time": [{ timeFrom: '08:00', timeTo: "21:00" }] },
        { weekDay: 5, "day": "Thursday", "flag": true, default: true, "time": [{ timeFrom: '08:00', timeTo: "21:00" }] },
        { weekDay: 6, "day": "Friday", "flag": true, default: true, "time": [{ timeFrom: '08:00', timeTo: "21:00" }] },
        { weekDay: 7, "day": "Saturday", "flag": true, default: true, "time": [{ timeFrom: '08:00', timeTo: "21:00" }] }
    ]
    for (const day of exclusions.excludedWeekDay) {
        let excludedWeekDay: any = [];
        const result = Object.assign({}, getRangeArray(day))
        for (let range of result.exclusionTimeRange) {
            if (!(range[0] === 8 && range[1] === 21)) {
                let timeTo = `${range[1] < 10 ? `0${range[1]}` : range[1]}:00`
                let timeFrom = `${range[0] < 10 ? `0${range[0]}` : range[0]}:00`
                excludedWeekDay.push(
                    {
                        timeFrom,
                        timeTo
                    }
                )
            }
        }
        for (let k = 0; k < days.length; k++) {
            if (days[k].weekDay === day.weekDay) {
                if (excludedWeekDay.length === 0) {
                    days[k].flag = false
                }
                days[k].default = false
                days[k].time = excludedWeekDay
            }
        }
    }
    exclusions.inclusionWeekDay = days
    return exclusions
}

export const merge = (a: any, b: any) => {
    return Object.entries(b).reduce((o, [k, v]) => {
        o[k] = v && typeof v === 'object'
            ? merge(o[k] = o[k] || (Array.isArray(v) ? [] : {}), v)
            : v;
        return o;
    }, a);
}


export const passwordRegexCheck = (password: any) => {
    const passRegex = /^((?=.*?[A-Z])(?=.*?[a-z])(?=.*[^A-Za-z0-9\s])|(?=.*?[0-9])(?=.*?[a-z])(?=.*[^A-Za-z0-9\s])|(?=.*?[0-9])(?=.*?[A-Z])(?=.*[^A-Za-z0-9\s])|(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z]))(?=.{14,})/
    return passRegex.test(password)
}

/**
 * Method is used to format amount to 2 decimals
 * @param x 
 * @returns 
 */
export const financial = (x: any) => {
    let valueToReturn
    if (x) {
        if (typeof x === 'number') {
            x = x.toFixed(2)
        }
        valueToReturn = x.toString().replace("$", '')
    } else {
        valueToReturn = x || 0
    }
    return valueToReturn ? valueToReturn.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : valueToReturn
}

export const decimalToFixed = (x: any) => {
    let valueToReturn
    if (x) {
        let number = x.toString().replace("$", '')
        valueToReturn = Number.parseFloat(number).toFixed(2);
    } else {
        valueToReturn = x
    }
    return valueToReturn
}


var a = {
    "excludedWeekDay": [
        {
            "excludedTime": [
                {
                    "timeFrom": "08:00",
                    "timeTo": "13:00"
                },
                {
                    "timeFrom": "15:00",
                    "timeTo": "21:00"
                }
            ],
            "weekDay": 1
        },
        {
            "default": true,
            "excludedTime": [
            ],
            "exclusionTimeRange": [
            ],
            "key": "Monday",
            "time": [
                {
                    "timeFrom": "08:00",
                    "timeTo": "21:00"
                }
            ],
            "weekDay": 2
        },
        {
            "default": true,
            "excludedTime": [
            ],
            "exclusionTimeRange": [
            ],
            "key": "Tuesday",
            "time": [
                {
                    "timeFrom": "08:00",
                    "timeTo": "21:00"
                }
            ],
            "weekDay": 3
        },
        {
            "default": true,
            "excludedTime": [
            ],
            "exclusionTimeRange": [
            ],
            "key": "Wednesday",
            "time": [
                {
                    "timeFrom": "08:00",
                    "timeTo": "21:00"
                }
            ],
            "weekDay": 4
        },
        {
            "default": true,
            "excludedTime": [
            ],
            "exclusionTimeRange": [
            ],
            "key": "Thursday",
            "time": [
                {
                    "timeFrom": "08:00",
                    "timeTo": "21:00"
                }
            ],
            "weekDay": 5
        },
        {
            "default": true,
            "excludedTime": [
            ],
            "exclusionTimeRange": [
            ],
            "key": "Friday",
            "time": [
                {
                    "timeFrom": "08:00",
                    "timeTo": "21:00"
                }
            ],
            "weekDay": 6
        },
        {
            "default": true,
            "excludedTime": [
            ],
            "exclusionTimeRange": [
            ],
            "key": "Saturday",
            "time": [
                {
                    "timeFrom": "08:00",
                    "timeTo": "21:00"
                }
            ],
            "weekDay": 7
        }
    ],
    "includedWeekDays": [
        {
            "default": false,
            "excludedTime": [
                {
                    "timeFrom": "08:00",
                    "timeTo": "13:00"
                },
                {
                    "timeFrom": "15:00",
                    "timeTo": "21:00"
                }
            ],
            "exclusionTimeRange": [
                [
                    8,
                    13
                ],
                [
                    15,
                    21
                ]
            ],
            "key": "Sunday",
            "time": [
                {
                    "timeFrom": "13",
                    "timeTo": "15"
                }
            ],
            "weekDay": 1
        },
        {
            "default": true,
            "excludedTime": [
            ],
            "exclusionTimeRange": [
            ],
            "key": "Monday",
            "time": [
                {
                    "timeFrom": "08:00",
                    "timeTo": "21:00"
                }
            ],
            "weekDay": 2
        },
        {
            "default": true,
            "excludedTime": [
            ],
            "exclusionTimeRange": [
            ],
            "key": "Tuesday",
            "time": [
                {
                    "timeFrom": "08:00",
                    "timeTo": "21:00"
                }
            ],
            "weekDay": 3
        },
        {
            "default": true,
            "excludedTime": [
            ],
            "exclusionTimeRange": [
            ],
            "key": "Wednesday",
            "time": [
                {
                    "timeFrom": "08:00",
                    "timeTo": "21:00"
                }
            ],
            "weekDay": 4
        },
        {
            "default": true,
            "excludedTime": [
            ],
            "exclusionTimeRange": [
            ],
            "key": "Thursday",
            "time": [
                {
                    "timeFrom": "08:00",
                    "timeTo": "21:00"
                }
            ],
            "weekDay": 5
        },
        {
            "default": true,
            "excludedTime": [
            ],
            "exclusionTimeRange": [
            ],
            "key": "Friday",
            "time": [
                {
                    "timeFrom": "08:00",
                    "timeTo": "21:00"
                }
            ],
            "weekDay": 6
        },
        {
            "default": true,
            "excludedTime": [
            ],
            "exclusionTimeRange": [
            ],
            "key": "Saturday",
            "time": [
                {
                    "timeFrom": "08:00",
                    "timeTo": "21:00"
                }
            ],
            "weekDay": 7
        }
    ]
}