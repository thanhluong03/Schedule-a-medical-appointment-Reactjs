import React, { Component } from 'react';
import { connect } from 'react-redux';  
import { getAllClinic } from '../../../services/userService';
import { withRouter } from 'react-router';
import HomeHeader from '../../HomePage/HomeHeader';
import HomeFooter from '../../HomePage/HomeFooter';
import './ListClinic.scss';

class ListClinic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataClinics: [],
            isLoading: true
        };
    }

    async componentDidMount() {
        try {
            let res = await getAllClinic();
            if (res && res.errCode === 0) {
                this.setState({
                    dataClinics: res.data ? res.data : [],
                    isLoading: false
                });
            } else {
                this.setState({ isLoading: false });
            }
        } catch (error) {
            console.error("Lỗi tải dữ liệu phòng khám:", error);
            this.setState({ isLoading: false });
        }
    }

    handleViewDetailClinic = (clinic) => {
        if (this.props.history) {
            this.props.history.push(`/detail-clinic/${clinic.id}`);
        }
    };

    render() {
        let { dataClinics, isLoading } = this.state;

        return (
            <>
                <HomeHeader />
                <div className="section-share section-medical-facility">
                    <div className="section-container">
                        <div className="section-header">
                            <span className="title-section border-title">Cơ sở y tế nổi bật</span>
                        </div>
                        <div className="clinic-grid-container">
                            {isLoading ? (
                                <div className="loading-container">
                                    <p>Đang tải dữ liệu...</p>
                                </div>
                            ) : (
                                <div className="clinic-grid">
                                    {dataClinics && dataClinics.length > 0 ? (
                                        dataClinics.map((item) => (
                                            <div className="clinic-item" key={item.id} onClick={() => this.handleViewDetailClinic(item)}>
                                                <div className="bg-image" style={{ backgroundImage: `url(${item.image})` }}></div>
                                                <div className="clinic-name">{item.name}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="no-data">Không có dữ liệu phòng khám.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {!isLoading && <HomeFooter />}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

export default withRouter(connect(mapStateToProps)(ListClinic));