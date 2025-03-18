import React, { Component} from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import './DetailSpecialty.scss';
import HomeHeader from "../../HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import Home from "../../../routes/Home";
import {getAllDetailSpecialtyById, getAllCodeService} from '../../../services/userService';
import _, { create } from 'lodash';
import { LANGUAGES } from "../../../utils";
import LoadingOverlay from 'react-loading-overlay';
import HomeFooter from "../../HomePage/HomeFooter";
class DetailSpecialty extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            dataDetailSpecialty: {},
            listProvince: [],
            isShowLoading: false
        }
    }

    async componentDidMount() {
        if(this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            this.setState ({isShowLoading: true})
            let res = await getAllDetailSpecialtyById({
                id: id,
                location: 'ALL'
            });
            let resProvince = await getAllCodeService('PROVINCE');
            if(res && res.errCode === 0 && resProvince && resProvince.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if(data && !_.isEmpty(res.data)) {
                    let arr = data.doctorSpecialty;
                    if(arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }
                let dataProvince = resProvince.data;
                if(dataProvince && dataProvince.length > 0) {
                    dataProvince.unshift({
                        createdAt: null,
                        keyMap: "ALL",
                        type: "PROVINCE",
                        valueEn: "ALL",
                        valueVi: "Toàn quốc",
                    })
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                    listProvince: dataProvince ? dataProvince : [],
                    isShowLoading: false
                })
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language){

        }
    }

    handleOnChangeSelect = async (event) => {
        if(this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let location = event.target.value;
            this.setState({isShowLoading: true})
            let res = await getAllDetailSpecialtyById({
                id: id,
                location: location
            });
            if(res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if(data && !_.isEmpty(res.data)) {
                    let arr = data.doctorSpecialty;
                    if(arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }
                this.setState({
                    dataDetailSpecialty: res.data,
                    arrDoctorId: arrDoctorId,
                    isShowLoading: false
                })
            }
        }
    }
    render() {
        let {arrDoctorId, dataDetailSpecialty, listProvince} = this.state;
        let{language} = this.props;
        return (
            <>
             <HomeHeader />

                
                {this.state.isShowLoading && (
                    <div className="loading-overlay-detail">
                        <div className="loading-content-detail">
                            <div className="loading-spinner-detail"></div>
                            <div className="loading-text-detail">Đang tải dữ liệu...</div>
                        </div>
                    </div>
                )}

                <div className="detail-specialty-container">
                <div className="detail-specialty-body">
                    <div className="description-specialty">
                    {dataDetailSpecialty && !_.isEmpty(dataDetailSpecialty) &&
                    <div dangerouslySetInnerHTML={{__html: dataDetailSpecialty.descriptionHTML}}></div>}
                    </div>
                    <div className="search-sp-doctor">
                        <select onChange={(event) => this.handleOnChangeSelect(event)}>
                            {
                                listProvince && listProvince.length > 0 &&
                                listProvince.map((item, index) => {
                                    return (
                                        <option key={index} value={item.keyMap}>
                                            {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    {arrDoctorId && arrDoctorId.length > 0 &&
                    arrDoctorId.map((item, index) => {
                        return (
                            <div className="each-doctor" key={index}>
                                <div className="dt-content-left">
                                    <div className="profile-doctor">
                                        <ProfileDoctor
                                        doctorId={item}
                                        isShowDescriptionDoctor = {true}
                                        isShowLinkDetail={true}
                                        isShowPrice={false} />
                                    </div>
                                </div>
                                <div className="dt-content-right">
                                    <div className="doctor-schedule">
                                        <DoctorSchedule 
                                        doctorIdFromParent={item}/>
                                    </div>
                                    <div className="doctor-extra-infor">
                                        <DoctorExtraInfor 
                                        doctorIdFromParent= {item}/>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    }
                </div>
            </div>
            {/* </> </LoadingOverlay> */}
            <HomeFooter/>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
       
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty);
