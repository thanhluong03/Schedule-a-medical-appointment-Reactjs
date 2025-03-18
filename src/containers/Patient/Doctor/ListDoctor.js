import React, { Component } from 'react';
import { connect } from 'react-redux';
import './ListDoctor.scss';
import * as actions from '../../../store/actions';
import { withRouter } from 'react-router';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';

class ListDoctor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDoctors: [],
            loading: true, 
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.topDoctorsRedux !== this.props.topDoctorsRedux) {
            this.setState({
                arrDoctors: this.props.topDoctorsRedux,
                loading: false, 
            });
        }
    }

    componentDidMount() {
        this.props.loadTopDoctors();
    }

    handleViewDetailDoctor = (doctor) => {
        if (this.props.history) {
            this.props.history.push(`/detail-doctor/${doctor.id}`);
        }
    };

    render() {
        let { arrDoctors, loading } = this.state;
        let isEmpty = arrDoctors.length === 0;

        return (
            <>
                <HomeHeader />
                <div className="section-share section-outstanding-doctor">
                    <div className="section-container">
                        <div className="section-header">
                            <span className="title-section">Bác sĩ nổi bật tuần qua</span>
                        </div>

                        <div className="doctor-grid-container">
                            {loading ? (
                                <div className="loading-container">Đang tải dữ liệu...</div>
                            ) : isEmpty ? (
                                <div className="no-data">Hiện chưa có bác sĩ nào.</div>
                            ) : (
                                <div className="doctor-grid">
                                    {arrDoctors.map((item, index) => {
                                        let imageBase64 = '';
                                        if (item.image) {
                                            imageBase64 = new Buffer(item.image, 'base64').toString('binary');
                                        }
                                        let name = `${item.positionData?.valueVi || 'Bác sĩ'}, ${item.lastName} ${item.firstName}`;
                                        let specialty = item.Doctor_Infor?.specialtyData?.name || 'Chưa cập nhật';

                                        return (
                                            <div className="doctor-item" key={index} onClick={() => this.handleViewDetailDoctor(item)}>
                                                <div className="doctor-card">
                                                    <div className="doctor-image" style={{ backgroundImage: `url(${imageBase64})` }} />
                                                    <div className="doctor-info">
                                                        <div className="doctor-name">{name}</div>
                                                        <div className="doctor-specialty">{specialty}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {!loading && <HomeFooter />}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        topDoctorsRedux: state.admin.topDoctors || [],
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListDoctor));
