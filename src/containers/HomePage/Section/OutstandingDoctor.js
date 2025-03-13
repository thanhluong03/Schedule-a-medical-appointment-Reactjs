import React, { Component } from 'react';
import { connect } from 'react-redux';  
import Slider from "react-slick";
import * as actions from '../../../store/actions';
import { withRouter } from 'react-router';
class OutstandingDoctor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            arrDoctors: []
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot){
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux){
            this.setState({
                arrDoctors: this.props.topDoctorsRedux
            })
        }
    }
    componentDidMount() {
        this.props.loadTopDoctors();
    }
    handleViewDetailDoctor = (doctor) => {
        if(this.props.history)
        {
            this.props.history.push(`/detail-doctor/${doctor.id}`)
        }
        
    }
    render() {
        console.log('check topdoctor', this.props.topDoctorsRedux)
        let arrDoctors = this.state.arrDoctors;
        //arrDoctors = arrDoctors.concat(arrDoctors).concat(arrDoctors)
        return (
            <div className="section-share section-outstanding-doctor">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section">Bác sĩ nổi bật tuần qua</span>
                        <button className="btn-section">Xem thêm</button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>           
                            {arrDoctors && arrDoctors.length > 0 &&
                            arrDoctors.map((item, index)=>{
                                let imageBase64 = '';
                                if(item.image) {
                                    imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                }
                                let name = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                                return (
                                    <div className="section-customize" key={index} onClick={() => this.handleViewDetailDoctor(item)}>
                                            <div className="custumize-border">
                                                <div className="outer-bg">
                                                <div className="bg-image section-outstanding-doctor"
                                                   style={{backgroundImage: `url(${imageBase64})`}} />
                                                </div>
                                                <div className="position">
                                                    <div>{name}</div>
                                                    <div>Cơ xương khớp2</div>
                                                </div>
                                            </div>
                                    </div>
                                )
                            }
                            )}
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        topDoctorsRedux: state.admin.topDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor())
    };
};

export default withRouter( connect(mapStateToProps, mapDispatchToProps)(OutstandingDoctor));
