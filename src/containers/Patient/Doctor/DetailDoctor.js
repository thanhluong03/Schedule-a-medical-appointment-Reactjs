import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions"
import HomeHeader from '../../HomePage/HomeHeader'
import './DetailDoctor.scss';
import { getDetailInforDoctor } from '../../../services/userService';
import DoctorSchedule from './DoctorSchedule';
import HomeFooter from '../../HomePage/HomeFooter';
import DoctorExtraInfor from './DoctorExtraInfor';
class DetailDoctor extends Component {
    constructor(props){
        super(props);
        this.state = {
            detailDoctor: {},
            currentDoctorId: -1,
        }
    }
    async componentDidMount(){
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            this.setState({
                currentDoctorId: id,
            })
            let res = await getDetailInforDoctor(id);
            if(res && res.errCode === 0) {
                this.setState ({
                    detailDoctor: res.data
                })
            }
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot){

    }
    render() {
        let {detailDoctor} = this.state;
        let nameVi = '';
        if(detailDoctor && detailDoctor.positionData)
        {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
        }
        return (
             <>
             <HomeHeader 
             isShowBanner = {false}/>
             <div className="doctor-detail-container">
                <div className="intro-doctor">
                    <div className="content-left"
                    style= {{backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image: ''})`}}
                    ></div>
                    <div className="content-right">
                        <div className="up">
                            {nameVi}
                        </div>
                        <div className="down">
                            {detailDoctor && detailDoctor.Markdown
                            && detailDoctor.Markdown.description &&
                            <span>
                                {detailDoctor.Markdown.description}
                                </span>
                            }
                        </div>
                    </div>
                </div>
                <div className="schedule-doctor">
                    <div className="content-left">
                        <DoctorSchedule
                          doctorIdFromParent = {this.state.currentDoctorId}
                        />
                    </div>
                    <div className="content-right">
                        <DoctorExtraInfor doctorIdFromParent= {this.state.currentDoctorId}/>
                    </div>
                </div>

                <div className="detail-infor-doctor">
                    {
                        detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.contentHTML &&
                        <div dangerouslySetInnerHTML={{__html: detailDoctor.Markdown.contentHTML}}></div>
                    }
                </div>
                <div className="comment-doctor"></div>
             </div>
             <HomeFooter/>
             </>
             
        );
    }

}

const mapStateToProps = state => {
    return {
        
    };
};

const mapDispatchToProps = dispatch => {
    return {
        
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
