import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getAllSpecialty } from '../../../services/userService';
import './ListSpecialty.scss';
import HomeHeader from "../../HomePage/HomeHeader";
import HomeFooter from '../../HomePage/HomeFooter';
import { withRouter } from 'react-router';

class Specialty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSpecialty: [],
        };
    }

    async componentDidMount() {
        let res = await getAllSpecialty();
        if (res && res.errCode === 0) {
            this.setState({
                dataSpecialty: res.data ? res.data : []
            });
        }
    }

    handleViewDetailSpecialty = (item) => {
        if (this.props.history) {
            this.props.history.push(`/detail-specialty/${item.id}`);
        }
    }

    render() {
        let { dataSpecialty } = this.state;
        return (
            <>
            <HomeHeader />
            <div className="section-share section-specialty">
                <div className="section-container">
                <div className="section-header">
                    <span className="title-section border-title">
                        <FormattedMessage id="homepage.specialty-popular" />
                    </span>
                </div>

                    <div className="specialty-grid">
                        {dataSpecialty && dataSpecialty.length > 0 &&
                            dataSpecialty.map((item, index) => {
                                return (
                                    <div className="specialty-item" key={index} onClick={() => this.handleViewDetailSpecialty(item)}>
                                        <div className="bg-image"
                                            style={{ backgroundImage: `url(${item.image})` }}>
                                        </div>
                                        <div className="specialty-name">{item.name}</div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
            <HomeFooter/>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

export default withRouter(connect(mapStateToProps)(Specialty));
