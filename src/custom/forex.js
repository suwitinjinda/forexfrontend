import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import {
    Row,
    Col, CardHeader, Progress,
    UncontrolledTooltip,
    Nav, TabContent, TabPane,
    NavItem,
    Button, Form,
    Modal, Table, Card, Badge,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    CustomInput, Label, Input
} from 'reactstrap';
import { NavLink as NavLinkStrap } from 'reactstrap';
import Chart from 'react-apexcharts';
import avatar1 from '../assets/images/avatars/avatar1.jpg';
import avatar2 from '../assets/images/avatars/avatar2.jpg';
import avatar5 from '../assets/images/avatars/avatar5.jpg';
import avatar6 from '../assets/images/avatars/avatar6.jpg';
import avatar7 from '../assets/images/avatars/avatar7.jpg';

import Trend from 'react-trend';
import CountUp from 'react-countup';
export default function LivePreviewExample() {

    const [activeTab, setActiveTab] = useState('1');

    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    const [checkC, setCheckC] = useState(false)
    const checkToggle = async () => {
        // console.log(a)
        // setId(a)
        setCheckC(!checkC)
    }
    const [update, setUpdate] = useState(false)
    const toggleUpdate = async () => {
        // console.log(a)
        // setId(a)
        setUpdate(!update)
    }
    const [data, setData] = useState("")
    const [dataPair, setDataPair] = useState("")
    const [accountInfo, setAccountInfo] = useState("")

    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);
    const [addPair, setAddPair] = useState([])
    const [pairName, setPairName] = useState("")
    const [pair1Order, setPair1Order] = useState("")
    const [pair2Order, setPair2Order] = useState("")
    const [lot, setLot] = useState(0.1)

    const backendURI = "ec2-3-25-98-134.ap-southeast-2.compute.amazonaws.com";
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: response } = await axios.get('http://' + backendURI + ':3001/data');
                console.log(response)
                setData(response);
            } catch (error) {
                console.error(error.message);
            }
        }
        const fetchDataPair = async () => {
            try {
                const { data: response } = await axios.get('http://' + backendURI + ':3001/datapair');
                console.log(response)
                setDataPair(response);
            } catch (error) {
                console.error(error.message);
            }
        }
        fetchData();
        fetchDataPair();
    }, [update]);
    const handleCheckboxChange = (a) => {
        let dd = addPair;
        console.log(dd)
        if (dd.includes(a)) {
            const newArray = addPair.filter(item => item !== a);
            setAddPair(newArray)
        } else {
            if (addPair.length < 2) {
                setAddPair(prevArray => [...prevArray, a]);
            }
        }
    };

    const addPairSubmit = async (event) => {
        event.preventDefault();
        console.log(pairName)
        console.log(addPair)
        let dd = [];
        addPair.map(d => {
            let accData = (data.data).filter(data1 => {
                // console.log(data1._id)
                if ((data1._id).includes(d)) {
                    return data1
                }
            })
            console.log(accData)
            dd.push(accData)
        })
        dd.push(pairName)
        console.log(dd)
        let pair1 = dd[0]
        let pair2 = dd[1]

        axios.post('http://' + backendURI + ':3001/addData', { pairName, pair1, pair2 })
            .then(response => {
                console.log('POST request successful');
                console.log(response.data); // The response data from the server
                if (response.data.status === "ok") {
                    toggleUpdate()
                    setAddPair([])
                    // window.location.reload();
                    if (response.data.data === "no data") {
                        setAddPair([])
                    }
                }
            })
            .catch(error => {
                console.error('Error making POST request', error);
            });
    }
    const deletePairSubmit = async (id) => {
        // event.preventDefault();
        console.log(id)

        axios.post('http://' + backendURI + ':3001/datapairdelete', { id })
            .then(response => {
                // console.log('POST request successful');
                console.log(response.data); // The response data from the server
                if (response.data.status === "ok") {
                    toggleUpdate()
                    // window.location.reload();
                    if (response.data.data === "no data") {
                        setAddPair([])
                    }
                }
            })
            .catch(error => {
                console.error('Error making POST request', error);
            });
    }
    const closePositionSubmit = async (id) => {
        // event.preventDefault();
        console.log(id)

        axios.post('http://' + backendURI + ':3001/closeposition', { id })
            .then(response => {
                // console.log('POST request successful');
                console.log(response.data); // The response data from the server
                if (response.data.status === "ok") {
                    toggleUpdate()
                    // window.location.reload();
                    if (response.data.data === "no data") {
                        setAddPair([])
                    }
                }
            })
            .catch(error => {
                console.error('Error making POST request', error);
            });
    }
    const ResetStatusSubmit = async (id) => {
        // event.preventDefault();
        console.log(id)

        axios.post('http://' + backendURI + ':3001/statusreset', { id })
            .then(response => {
                // console.log('POST request successful');
                console.log(response.data); // The response data from the server
                if (response.data.status === "ok") {
                    toggleUpdate()
                    // window.location.reload();
                    if (response.data.data === "no data") {
                        setAddPair([])
                    }
                }
            })
            .catch(error => {
                console.error('Error making POST request', error);
            });
    }
    const orderSubmit = async (a) => {
        // event.preventDefault();
        console.log(a)
        let id = a._id
        console.log(pair1Order, pair2Order, lot)
        if (pair1Order === "" || pair2Order === "" || a.status === "close") {
            alert("please specific buy/sell or reset status to blank!")
        } else if (a.status !== "") {
            alert("position is running!")
        } else {

            axios.post('http://' + backendURI + ':3001/order', { id, lot, pair1Order, pair2Order })
                .then(response => {
                    // console.log('POST request successful');
                    console.log(response.data); // The response data from the server
                    if (response.data.status === "ok") {
                        toggleUpdate()
                        // window.location.reload();
                        if (response.data.data === "no data") {
                            setAddPair([])
                        }
                    }
                })
                .catch(error => {
                    console.error('Error making POST request', error);
                });

        }

        checkToggle()
    }
    const buy1Submit = async (a) => {
        console.log(a)
        setPair1Order(a)
        setPair2Order("sell")
    }
    const sell1Submit = async (a) => {
        console.log(a)
        setPair1Order(a)
        setPair2Order("buy")
    }

    const accountShow = () => {

        if (data != "") {
            let account = data;
            // console.log(account)
            let accountid = [...new Set((account.data).map(obj => obj.accountid))];
            // console.log(accountid)
            return (
                <>
                    {
                        accountid.map(acc => {
                            let accDetail = (account.data).filter(data1 => data1.accountid == acc)
                            let accountsymbol = [...new Set((accDetail).map(obj => obj.SYMBOL))];

                            return (
                                <>
                                    <div className="card-body pt-3 px-4 pb-4">
                                        <h4 className="font-weight-bold font-size-lg mb-1 text-black">
                                            Account:{acc}
                                        </h4>
                                        {accountsymbol.map(sym => {
                                            let accSymDetail = (account.data).filter(data1 => data1.SYMBOL == sym)
                                            // console.log(accDetail)

                                            const last = accSymDetail[accSymDetail.length - 1];
                                            console.log(last)
                                            console.log(dataPair.data)
                                            let pairinuse = false;
                                            if (last != undefined)
                                                if (dataPair !== "") {
                                                    (dataPair.data).map(d => {
                                                        if ((d.pair1.accountid == last.accountid && d.pair1.SYMBOL === last.SYMBOL) || (d.pair2.accountid == last.accountid && d.pair2.SYMBOL === last.SYMBOL)) {
                                                            pairinuse = true;
                                                        }

                                                    })
                                                }
                                            const checkNumber = (a) => {

                                                if (a < 0) {
                                                    return (
                                                        <span className="font-weight-bold text-danger">{a}</span>
                                                    )
                                                } else {
                                                    return (
                                                        <span className="font-weight-bold text-success">{a}</span>
                                                    )
                                                }
                                            }
                                            return (

                                                <Table className="table-alternate-spaced mb-0">
                                                    <thead>
                                                        <tr>
                                                            <th className="text-center">AddPair</th>
                                                            <th className="text-center">account</th>
                                                            <th className="text-center">Fee Swap Long</th>
                                                            <th className="text-center">Fee Swap Short</th>
                                                            <th className="text-center">Profit</th>
                                                            <th className="text-center">Swap</th>
                                                            <th className="text-left">Date</th>
                                                            <th className="text-center" style={{ width: '15%' }}>
                                                                Trends
                                                            </th>
                                                            <th className="text-right">Totals</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="text-center" >
                                                                {/* <CustomInput
                                                        type="checkbox"
                                                        id={last.accountid}
                                                        className="align-self-start"
                                                        label="&nbsp;"
                                                        onChange={handleCheckboxChange}
                                                    /> */}
                                                                <Button
                                                                    onClick={() => handleCheckboxChange(last._id)}
                                                                    size="sm"
                                                                    // color="success"
                                                                    disabled={pairinuse}
                                                                    id={last.accountid}>
                                                                    <span className="btn-wrapper--icon">
                                                                        <FontAwesomeIcon
                                                                            icon={['fas', 'bullseye']}
                                                                            className="opacity-4 font-size-xl"
                                                                        />
                                                                    </span>
                                                                </Button>
                                                                {/* <UncontrolledTooltip target={last.accountid}>
                                                                    Add Pair
                                                                </UncontrolledTooltip> */}
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    <a
                                                                        href="#/"
                                                                        onClick={(e) => e.preventDefault()}
                                                                        className="font-weight-bold text-black"
                                                                        title="...">
                                                                        {last.SYMBOL}
                                                                    </a>
                                                                    <span className="text-black-50 d-block">
                                                                        {last.company}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="text-center">
                                                                {checkNumber(last.swapLongTrade)}
                                                            </td>
                                                            <td className="text-center">
                                                                {checkNumber(last.swapShortTrade)}
                                                            </td>
                                                            <td className="text-center">
                                                                {checkNumber(last.PositionProfit)}
                                                            </td>
                                                            <td className="text-center">
                                                                {checkNumber(last.PositionSwap)}
                                                            </td>
                                                            <td >
                                                                <div>
                                                                    <a
                                                                        href="#/"
                                                                        onClick={(e) => e.preventDefault()}
                                                                        className="font-weight-bold text-black"
                                                                        title="...">
                                                                        {last.time}
                                                                    </a>
                                                                    {/* <span className="text-black-50 d-block">
                                                            {last[0].time}
                                                        </span> */}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <Trend
                                                                    data={[0, 10, 5, 22, 3.6, 11]}
                                                                    autoDraw
                                                                    autoDrawDuration={3000}
                                                                    autoDrawEasing="ease-in"
                                                                    radius={15}
                                                                    smooth
                                                                    stroke="var(--danger)"
                                                                    strokeLinecap="round"
                                                                    strokeWidth={5}
                                                                />
                                                            </td>
                                                            <td className="text-right">
                                                                <div className="d-flex align-items-center justify-content-end">
                                                                    <div className="font-weight-bold font-size-lg pr-2">
                                                                        {checkNumber(parseFloat(last.PositionProfit + last.PositionSwap).toFixed(2))}
                                                                        {/* {parseFloat(last.PositionProfit + last.PositionSwap).toFixed(2)} */}
                                                                    </div>

                                                                </div>
                                                            </td>
                                                        </tr>

                                                    </tbody>
                                                </Table>

                                            )

                                        })}
                                    </div>
                                </>
                            )
                        })
                    }
                </>
            )



        }

    }

    const addPairShow = () => {

        if (data != "") {
            const addshow = () => {
                if (addPair.length == 2)
                    return (
                        <>
                            <Form onSubmit={addPairSubmit}>
                                <Row>
                                    <Col>
                                        <Label htmlFor="pairname">your pair name</Label>
                                        <Input type="text" name="pairname" id="pairname" placeholder="pairname" onChange={e => setPairName(e.target.value)} required>

                                        </Input><br></br>
                                        <Button
                                            type="submit"
                                            className="btn-pill font-weight-bold px-4 text-uppercase font-size-sm"
                                            color="primary"
                                        // onClick={() => addStep2(companyName, buildName, sectionName)}
                                        >
                                            save
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>

                        </>
                    )
            }

            return (
                <>
                    <Row>
                        {addPair.map(data1 => {
                            let a = (data.data).filter(pl => pl._id == data1)
                            console.log(a)
                            return (
                                <>
                                    <Col xl="4">
                                        <a
                                            href="#/"
                                            onClick={(e) => e.preventDefault()}
                                            className="card btn rounded text-left mb-5 p-4">
                                            <div className="d-flex align-items-center">
                                                <div className="d-70 rounded-circle bg-success text-white mr-3 text-center">
                                                    <FontAwesomeIcon
                                                        icon={['far', 'user']}
                                                        className="font-size-lg"
                                                    />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <div className="text-black-50 pb-1">{a[0].company}</div>
                                                    <div className="text-info">{a[0].accountid}</div>
                                                    <div className="text-info">{a[0].SYMBOL}</div>
                                                </div>
                                                <div className="font-size-sm opacity-5">
                                                    <FontAwesomeIcon icon={['fas', 'arrow-right']} />
                                                </div>
                                            </div>
                                        </a>
                                    </Col>
                                </>
                            )
                        })}
                    </Row>
                    {addshow()}
                </>
            )
        }

    }
    const homeShow = () => {
        const chartsLarge3Options = {
            chart: {
                toolbar: {
                    show: false
                },
                sparkline: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            grid: {
                strokeDashArray: '5',
                borderColor: 'rgba(125, 138, 156, 0.3)'
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            fill: {
                color: '#3c44b1',
                gradient: {
                    shade: 'light',
                    type: 'vertical',
                    shadeIntensity: 0.2,
                    inverseColors: false,
                    opacityFrom: 0.8,
                    opacityTo: 0,
                    stops: [0, 100]
                }
            },
            colors: ['#3c44b1'],
            legend: {
                show: false
            },
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
        };
        const chartsLarge3Data = [
            {
                name: 'Net Profit',
                data: [3.3, 3.1, 4.0, 5.8, 2.1, 3.6, 3.2]
            },
            {
                name: 'Net Loss',
                data: [2.1, 2.1, 2.8, 2.8, 4.3, 2.7, 1.4]
            }
        ];
        if (dataPair !== "" && data !== "") {

            return (
                <>
                    <div>
                        <Row>

                            {(dataPair.data).map(pl => {
                                let acc1Detail = (data.data).filter(data1 => data1.accountid == pl.pair1.accountid && data1.SYMBOL == pl.pair1.SYMBOL)
                                let acc2Detail = (data.data).filter(data1 => data1.accountid == pl.pair2.accountid && data1.SYMBOL == pl.pair2.SYMBOL)
                                // console.log(acc1Detail)
                                const last1 = acc1Detail[acc1Detail.length - 1];
                                const last2 = acc2Detail[acc2Detail.length - 1];
                                // console.log(last1)
                                return (
                                    <>
                                        <Col xl="6">
                                            <Card className="card-box mb-5">
                                                <CardHeader>
                                                    <div className="card-header--title">
                                                        <h2 className="font-size-lg mb-0 py-2 font-weight-bold">
                                                            {pl.name}
                                                        </h2>
                                                    </div>
                                                    <div className="card-header--actions">
                                                        {/* <Button size="sm" color="neutral-primary">
                                                            <span className="btn-wrapper--label">Export</span>
                                                            <span className="btn-wrapper--icon">
                                                                <FontAwesomeIcon
                                                                    icon={['fas', 'chevron-down']}
                                                                    className="opacity-8 font-size-xs"
                                                                />
                                                            </span>
                                                        </Button> */}
                                                        <UncontrolledDropdown tag="span" className="m-2">
                                                            <DropdownToggle size="sm" color="second" caret>
                                                                ACTION
                                                            </DropdownToggle>
                                                            <DropdownMenu>
                                                                <div role="menuitem">
                                                                    <a
                                                                        className="dropdown-item"
                                                                        // href="#/"
                                                                        onClick={() => checkToggle(pl)}>
                                                                        Order
                                                                    </a>
                                                                </div>
                                                                <div role="menuitem">
                                                                    <a
                                                                        className="dropdown-item"
                                                                        // href="#/"
                                                                        onClick={() => closePositionSubmit(pl._id)}>
                                                                        Close Position
                                                                    </a>
                                                                </div>
                                                                <div role="menuitem">
                                                                    <a
                                                                        className="dropdown-item"
                                                                        // href="#/"
                                                                        onClick={() => ResetStatusSubmit(pl._id)}>
                                                                        Reset Status
                                                                    </a>
                                                                </div>
                                                                <div role="menuitem">
                                                                    <a
                                                                        className="dropdown-item"
                                                                        // href="#/"
                                                                        onClick={() => deletePairSubmit(pl._id)}>
                                                                        Delete Pair
                                                                    </a>
                                                                </div>

                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </div>
                                                </CardHeader>
                                                <div className="card-body pb-1 font-weight-bold">
                                                    <Row className="pt-3">
                                                        <Col >
                                                            <div className="pb-4 px-3">
                                                                <span className="text-dark pb-4">{pl.pair1.company}</span>
                                                                <span className="font-size-lg d-block">
                                                                    {pl.pair1.accountid}
                                                                </span>
                                                            </div>
                                                            <div className="pb-4 px-3">
                                                                <span className="text-dark pb-4">{pl.pair1.SYMBOL}</span>
                                                                <span className="font-size-lg d-block">
                                                                    <small>PROFIT</small> {last1.PositionProfit} <small>SWAP</small> {last1.PositionSwap}
                                                                </span>
                                                            </div>
                                                        </Col>
                                                        <Col >
                                                            <div className="pb-4 px-3">
                                                                <span className="text-dark pb-4">{pl.pair2.company}</span>
                                                                <span className="font-size-lg d-block">
                                                                    {pl.pair2.accountid}
                                                                </span>
                                                            </div>
                                                            <div className="pb-4 px-3">
                                                                <span className="text-dark pb-4">{pl.pair2.SYMBOL}</span>
                                                                <span className="font-size-lg d-block">
                                                                    <small>PROFIT</small> {last2.PositionProfit} <small>SWAP</small> {last2.PositionSwap}
                                                                </span>
                                                            </div>
                                                        </Col>

                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <div className="pb-4 px-3">
                                                                <span className="text-dark pb-4">Total</span>
                                                                <span className="font-size-lg d-block">{parseFloat((last1.PositionProfit + last1.PositionSwap) + (last2.PositionProfit + last2.PositionSwap)).toFixed(2)}</span>
                                                            </div>

                                                        </Col>
                                                        <Col>
                                                            <div className="pb-4 px-3">
                                                                <span className="text-dark pb-4">Status</span>
                                                                <span className="font-size-lg d-block">{pl.status}</span>
                                                            </div>

                                                        </Col>
                                                    </Row>
                                                    <Chart
                                                        options={chartsLarge3Options}
                                                        series={chartsLarge3Data}
                                                        type="area"
                                                        height={317}
                                                    />
                                                </div>
                                            </Card>
                                        </Col>
                                        <Modal zIndex={2000} centered isOpen={checkC} toggle={checkToggle}>
                                            <div className="text-center p-5">
                                                <Row>
                                                    <Col>
                                                        <div>
                                                            <span className="text-dark pb-4">{pl.pair1.accountid}</span>
                                                            <span className="font-size-lg d-block">{pl.pair1.SYMBOL}</span>
                                                            <span className="font-size-lg d-block"><b>{pair1Order}</b></span>
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <div>
                                                            <span className="text-dark pb-4">{pl.pair2.accountid}</span>
                                                            <span className="font-size-lg d-block">{pl.pair2.SYMBOL}</span>
                                                            <span className="font-size-lg d-block"><b>{pair2Order}</b></span>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <div className="pt-4" id="p1">
                                                            <Button
                                                                onClick={() => buy1Submit("buy")}
                                                                color="neutral-primary"
                                                                className="btn-pill mx-1">
                                                                <span className="btn-wrapper--label">BUY</span>
                                                            </Button>
                                                            <Button
                                                                onClick={() => sell1Submit("sell")}
                                                                color="neutral-danger"
                                                                className="btn-pill mx-1">
                                                                <span className="btn-wrapper--label">SELL</span>
                                                            </Button>
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <div className="pt-4">
                                                            <Label htmlFor="lot">LOT</Label>
                                                            <Input type="number" step={0.01} name="lot" id="lot" placeholder={lot} onChange={e => setLot(e.target.value)} >
                                                            </Input>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <div className="pt-4">
                                                    <Button
                                                        onClick={e => checkToggle()}
                                                        color="neutral-secondary"
                                                        className="btn-pill mx-1">
                                                        <span className="btn-wrapper--label">Cancel</span>
                                                    </Button>
                                                    <Button
                                                        onClick={e => orderSubmit(pl)}
                                                        outline
                                                        color="warning"
                                                        className="btn-pill mx-1">
                                                        <span className="btn-wrapper--label">submit</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </Modal>
                                    </>
                                );
                            })

                            }

                        </Row>
                    </div>
                </>
            )


        }

    }
    return (
        <>
            { }
            <Card className="card-box mb-5">
                <div className="card-header-alt p-4">
                    <h4 className="font-weight-bold font-size-lg mb-1 text-black">
                        We will Rich
                    </h4>
                    <p className="text-black-50 mb-0">
                        {/* Reports for what we sold this week. */}
                    </p>
                </div>
                <div className="nav-tabs-primary">
                    <Nav tabs>
                        <NavItem>
                            <NavLinkStrap
                                className={clsx({ active: activeTab === '1' })}
                                onClick={() => {
                                    toggle('1');
                                }}>
                                Home
                            </NavLinkStrap>
                        </NavItem>
                        <NavItem>
                            <NavLinkStrap
                                className={clsx({ active: activeTab === '2' })}
                                onClick={() => {
                                    toggle('2');
                                }}>
                                SETUP
                            </NavLinkStrap>
                        </NavItem>
                        <NavItem>
                            <NavLinkStrap
                                className={clsx({ active: activeTab === '3' })}
                                onClick={() => {
                                    toggle('3');
                                }}>
                                Messages
                            </NavLinkStrap>
                        </NavItem>
                    </Nav>
                </div>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                        <div className="text-center my-5">
                            {homeShow()}
                        </div>
                    </TabPane>
                    <TabPane tabId="2">
                        <div className="text-center my-5">
                            <div className="card-header-alt p-4">
                                <h6 className="font-weight-bold font-size-lg mb-1 text-black">
                                    SETUP PAIR
                                </h6>
                                {/* <Button
                        onClick={toggleModal}
                        size="sm"
                        color="success"
                        id="AddEntryTooltip20">
                        <span className="btn-wrapper--icon">
                            <FontAwesomeIcon
                                icon={['fas', 'plus']}
                                className="opacity-8 font-size-xs"
                            />
                        </span>
                    </Button>
                    <UncontrolledTooltip target="AddEntryTooltip20">
                        Add Pair
                    </UncontrolledTooltip> */}
                                <hr></hr>
                                {addPairShow()}
                            </div>
                            <hr></hr>
                            {accountShow()}
                        </div>
                    </TabPane>
                    <TabPane tabId="3">
                        <div className="text-center my-5">
                            <div className="d-inline-flex justify-content-center p-0 rounded-circle avatar-icon-wrapper bg-neutral-primary shadow-primary-sm text-primary mb-2 d-90">
                                <FontAwesomeIcon
                                    icon={['far', 'gem']}
                                    className="d-flex align-self-center font-size-xxl"
                                />
                            </div>
                            <h6 className="font-weight-bold font-size-xxl mb-1 mt-3 text-primary">
                                Tabbed Section
                            </h6>
                            <p className="text-black-50 font-size-lg mb-0">
                                You have pending actions to take care of.
                            </p>
                        </div>
                    </TabPane>
                </TabContent>
            </Card>
        </>
    );
}
