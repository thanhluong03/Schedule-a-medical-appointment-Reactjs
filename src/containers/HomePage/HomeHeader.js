import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import logo from '../../assets/images/logo.png';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
class HomeHeader extends Component {


    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`)
        }
    }
    handleViewListSpecialty = () => {
        if(this.props.history) {
            this.props.history.push(`/list-specialty`)
        }
    }

    handleViewLogin = () => {
        if(this.props.history) {
            this.props.history.push(`/login`)
        }
    }
    render() {
    
        return (
            <React.Fragment>
            <div className="home-header-container">
                <div className="home-header-content">
                    <div className="left-content">
                        {/* <i className="fas fa-bars"></i> */}
                        <img className="header-logo" src= {logo} onClick={() => this.returnToHome()}/>
                    </div>
                    <div className="center-content">
                        <div className="child-content">
                            <div><b>< FormattedMessage id="homeheader.speciality"/></b></div>
                            <div className="subs-title">< FormattedMessage id="homeheader.searchdoctor"/></div>
                        </div>
                        <div className="child-content">
                            <div><b>< FormattedMessage id="homeheader.health-facility"/></b></div>
                            <div className="subs-title">< FormattedMessage id="homeheader.select-room"/></div>
                        </div>
                        <div className="child-content">
                            <div><b>< FormattedMessage id="homeheader.doctor"/></b></div>
                            <div className="subs-title">< FormattedMessage id="homeheader.select-doctor"/></div>
                        </div>
                        <div className="child-content">
                            <div><b>< FormattedMessage id="homeheader.fee"/></b></div>
                            <div className="subs-title">< FormattedMessage id="homeheader.check-health"/></div>
                        </div>
                    </div>
                    <div className="right-content">
                    <div className="right-content">
                        {/* <div className="language-vi">VN</div>
                        <div className="language-en">EN</div> */}
                        <button className="login-btn"
                         onClick={() => this.handleViewLogin()}>Login</button>
                    </div>

                    </div>
                </div>
            </div>
            {this.props.isShowBanner === true &&
                <div className="home-header-banner">
                <div className="content-up">
                    <div className="title1">< FormattedMessage id="banner.title1"/></div>
                    <div className="title2">< FormattedMessage id="banner.title2"/></div>
                    {/* <div className="search">
                    <i className="fas fa-search"></i>
                    <input type="text" placeholder="Tìm chuyên khoa khám bệnh"/>
                    </div> */}
                </div>
                <div className="content-down">
                    <div className="options">
                        <div className="option-child" 
                        onClick={() => this.handleViewListSpecialty()}>
                            <div className="icon-child"><i className="far fa-hospital"></i></div>
                            <div className="text-child">Khám chuyên khoa</div>
                        </div>
                        <div className="option-child">
                            <div className="icon-child"><i className="fas fa-mobile-alt"></i></div>
                            <div className="text-child">Khám từ xa </div>
                        </div>
                        <div className="option-child">
                            <div className="icon-child"><i class="fas fa-procedures"></i></div>
                            <div className="text-child">Khám tổng quát</div>
                        </div>
                        <div className="option-child">
                            <div className="icon-child"><i class="fas fa-flask"></i></div>
                            <div className="text-child">Xét nghiệm y học </div>
                        </div>
                        <div className="option-child">
                            <div className="icon-child"><i className="fas fa-user-md"></i></div>
                            <div className="text-child">Sức khỏe tinh thần </div>
                        </div>
                        <div className="option-child">
                            <div className="icon-child"><i class="fas fa-briefcase-medical"></i></div>
                            <div className="text-child">Khám nha khoa </div>
                        </div>
                    </div>
                </div>
            </div>
            }
            
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
