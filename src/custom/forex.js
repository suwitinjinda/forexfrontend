import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    Row,
    Col,
    UncontrolledTooltip,
    Nav,
    NavItem,
    Button, Form,
    Modal, Table, Card, Badge,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    CustomInput, Label, Input
} from 'reactstrap';

import avatar1 from '../assets/images/avatars/avatar1.jpg';
import avatar2 from '../assets/images/avatars/avatar2.jpg';
import avatar5 from '../assets/images/avatars/avatar5.jpg';
import avatar6 from '../assets/images/avatars/avatar6.jpg';
import avatar7 from '../assets/images/avatars/avatar7.jpg';

import Trend from 'react-trend';
import CountUp from 'react-countup';
export default function LivePreviewExample() {

    const [data, setData] = useState("")
    const [accountInfo, setAccountInfo] = useState("")

    const [modal, setModal] = useState(false);
    const toggleModal = () => setModal(!modal);
    const [addPair, setAddPair] = useState([])
    const [pairName, setPairName] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: response } = await axios.get('http://8.219.48.50:3001/data');
                console.log(response)
                setData(response);
            } catch (error) {
                console.error(error.message);
            }
        }

        fetchData();
    }, []);
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

    const addPairSubmit = async event => {
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

        axios.post('http://8.219.48.50:3001/addData', { pairName, pair1, pair2 }, {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }
        )
            .then(res => {
                console.log(res.data)
                // setData(response.data);
                //     if (res.data.status === "ok") {
                //         // setSiteData(res.data.data)
                //         setStatus("crate new data successfully")
                //         toggle1()
                //         updatetoggle()
                //         updateCfo()
                //     } else {
                //         return alert(res.data.status);
                //     }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    const accountShow = () => {

        if (data != "") {
            let account = data;
            // console.log(account)
            let accountid = [...new Set((account.data).map(obj => obj.accountid))];
            // console.log(accountid)

            return (
                <>
                    {accountid.map(acc => {
                        let accDetail = (account.data).filter(data1 => data1.accountid == acc)
                        // console.log(accDetail)
                        const last = accDetail[accDetail.length - 1];
                        // console.log(last)
                        // if (last != undefined)
                        return (
                            <div className="card-body pt-3 px-4 pb-4">
                                <h4 className="font-weight-bold font-size-lg mb-1 text-black">
                                    Account:{acc}
                                </h4>
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
                                                    color="success"
                                                    id={last.accountid}>
                                                    <span className="btn-wrapper--icon">
                                                        <FontAwesomeIcon
                                                            icon={['fas', 'plus']}
                                                            className="opacity-4 font-size-sm"
                                                        />
                                                    </span>
                                                </Button>
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
                                                <span className="font-weight-bold text-danger">{last.swapLongTrade}</span>
                                            </td>
                                            <td className="text-center">
                                                <span className="font-weight-bold text-danger">{last.swapShortTrade}</span>
                                            </td>
                                            <td className="text-center">
                                                <span className="font-weight-bold text-danger">{last.PositionProfit}</span>
                                            </td>
                                            <td className="text-center">
                                                <span className="text-danger font-weight-bold">{last.PositionSwap}</span>
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
                                                        {parseFloat(last.PositionProfit + last.PositionSwap).toFixed(2)}
                                                    </div>

                                                </div>
                                            </td>
                                        </tr>

                                    </tbody>
                                </Table>
                            </div>
                        )

                    })}

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
                <div className="card-header-alt p-4">
                    <h4 className="font-weight-bold font-size-lg mb-1 text-black">
                        SETUP PairName
                    </h4><br></br>
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
                <Modal
                    centered
                    size="xl"
                    isOpen={modal}
                    zIndex={1300}
                    toggle={toggleModal}
                    contentClassName="border-0 bg-transparent">
                    <Row className="no-gutters">
                        <Col lg="5">
                            <div className="bg-white rounded-left">
                                <div className="p-4 text-center">
                                    <div className="avatar-icon-wrapper rounded-circle mx-auto">
                                        <div className="d-block p-0 avatar-icon-wrapper rounded-circle m-0 border-3 border-first">
                                            <div className="rounded-circle border-3 border-white overflow-hidden">
                                                <img alt="..." className="img-fluid" src={avatar5} />
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="font-size-lg font-weight-bold my-2">
                                        Marion Devine
                                    </h4>
                                    <div className="text-center my-4">
                                        <Badge pill color="neutral-first" className="text-first mx-1">
                                            Web developer
                                        </Badge>
                                        <Badge
                                            pill
                                            color="neutral-warning"
                                            className="text-warning mx-1">
                                            Javascript
                                        </Badge>
                                        <Badge
                                            pill
                                            color="neutral-danger"
                                            className="text-danger mx-1">
                                            Angular
                                        </Badge>
                                    </div>

                                    <p className="text-muted mb-4">
                                        I should be incapable of drawing a single stroke at the
                                        present moment; and yet I feel that I never was a greater
                                        artist than now.
                                    </p>

                                    <div className="divider my-4" />
                                    <Row>
                                        <Col lg="6">
                                            <span className="opacity-6 pb-2">Current month</span>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <span className="font-weight-bold font-size-lg">
                                                    <small className="opacity-6 pr-1">$</small>
                                                    46,362
                                                </span>
                                                <Badge
                                                    color="neutral-danger"
                                                    className="ml-2 text-danger">
                                                    -8%
                                                </Badge>
                                            </div>
                                        </Col>
                                        <Col lg="6">
                                            <span className="opacity-6 pb-2">Last year</span>
                                            <div className="d-flex align-items-center justify-content-center">
                                                <span className="font-weight-bold font-size-lg">
                                                    <small className="opacity-6 pr-1">$</small>
                                                    34,546
                                                </span>
                                                <Badge
                                                    color="neutral-success"
                                                    className="text-success ml-2">
                                                    +13%
                                                </Badge>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="divider my-4" />
                                    <div className="font-weight-bold text-uppercase text-black-50 text-center mb-3">
                                        Team members
                                    </div>
                                    <div className="avatar-wrapper-overlap d-flex justify-content-center mb-3">
                                        <div className="avatar-icon-wrapper" id="DelaneyTooltip1">
                                            <div className="avatar-icon">
                                                <img alt="..." src={avatar1} />
                                            </div>
                                        </div>
                                        <UncontrolledTooltip
                                            target="DelaneyTooltip1"
                                            popperClassName="tooltip-danger">
                                            Chelsey Delaney
                                        </UncontrolledTooltip>

                                        <div className="avatar-icon-wrapper" id="SantosTooltip1">
                                            <div className="avatar-icon">
                                                <img alt="..." src={avatar7} />
                                            </div>
                                        </div>
                                        <UncontrolledTooltip
                                            target="SantosTooltip1"
                                            popperClassName="tooltip-first">
                                            Laibah Santos
                                        </UncontrolledTooltip>

                                        <div className="avatar-icon-wrapper" id="WeberTooltip1">
                                            <div className="avatar-icon">
                                                <img alt="..." src={avatar1} />
                                            </div>
                                        </div>
                                        <UncontrolledTooltip
                                            target="WeberTooltip1"
                                            popperClassName="tooltip-second">
                                            Ksawery Weber
                                        </UncontrolledTooltip>

                                        <div className="avatar-icon-wrapper" id="MaganaTooltip1">
                                            <div className="avatar-icon">
                                                <img alt="..." src={avatar2} />
                                            </div>
                                        </div>
                                        <UncontrolledTooltip
                                            target="MaganaTooltip1"
                                            popperClassName="tooltip-info">
                                            Killian Magana
                                        </UncontrolledTooltip>

                                        <div className="avatar-icon-wrapper" id="BanksTooltip1">
                                            <div className="avatar-icon">
                                                <img alt="..." src={avatar6} />
                                            </div>
                                        </div>
                                        <UncontrolledTooltip
                                            target="BanksTooltip1"
                                            popperClassName="tooltip-success">
                                            Kean Banks
                                        </UncontrolledTooltip>
                                    </div>
                                    <div className="divider my-4" />
                                    <Button outline color="first" className="mt-2">
                                        View complete profile
                                    </Button>
                                </div>
                            </div>
                        </Col>

                    </Row>
                </Modal>
                <hr></hr>
                {accountShow()}
            </Card>
        </>
    );
}
