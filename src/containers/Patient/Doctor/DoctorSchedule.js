import React, { Component } from 'react';
import { connect } from 'react-redux';
import './DoctorSchedule.scss';
import moment from 'moment';
import localization from 'moment/locale/vi';
import { LANGUAGES } from '../../../utils';
import { getScheduleDoctorByDate } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';

class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailableTime: [],
            isOpenModalBooking: false,
            dataScheduleTimeModal: {}
        };
    }

    async componentDidMount() {
        let { language, doctorIdFromParent } = this.props;
        let allDays = this.getArrDays(language);
        this.setState({ allDays });

        if (doctorIdFromParent) {
            let res = await getScheduleDoctorByDate(doctorIdFromParent, allDays[0].value);
            if (res && res.errCode === 0) {
                let filteredTimes = this.filterPastTimes(res.data, allDays[0].value);
                this.setState({ allAvailableTime: filteredTimes });
            }
        }
    }

    async componentDidUpdate(prevProps) {
        if (this.props.language !== prevProps.language || this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let allDays = this.getArrDays(this.props.language);
            this.setState({ allDays });

            if (this.props.doctorIdFromParent) {
                let res = await getScheduleDoctorByDate(this.props.doctorIdFromParent, allDays[0].value);
                if (res && res.errCode === 0) {
                    let filteredTimes = this.filterPastTimes(res.data, allDays[0].value);
                    this.setState({ allAvailableTime: filteredTimes });
                }
            }
        }
    }

    getArrDays = (language) => {
        let allDays = [];
        for (let i = 0; i < 7; i++) {
            let date = moment().add(i, 'days');
            let formattedDate = date.format('DD/MM');
            let label = language === LANGUAGES.VI
                ? (i === 0 ? `Hôm nay - ${formattedDate}` : this.capitalizeFirstLetter(date.format('dddd - DD/MM')))
                : (i === 0 ? `Today - ${formattedDate}` : date.locale('en').format('dddd - DD/MM'));
            allDays.push({ label, value: date.startOf('day').valueOf() });
        }
        return allDays;
    };

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    handleOnChangeSelect = async (event) => {
        let { doctorIdFromParent } = this.props;
        let date = event.target.value;
        if (doctorIdFromParent) {
            let res = await getScheduleDoctorByDate(doctorIdFromParent, date);
            if (res && res.errCode === 0) {
                let filteredTimes = this.filterPastTimes(res.data, date);
                this.setState({ allAvailableTime: filteredTimes });
            }
        }
    };

    filterPastTimes = (scheduleList, selectedDate) => {
        let now = moment();
        let isToday = moment(parseInt(selectedDate)).isSame(now, 'day');

        return scheduleList.filter(item => {
            let scheduleTime = moment(item.timeTypeData.valueVi, "HH:mm");
            return !isToday || scheduleTime.isSameOrAfter(now, 'minute');
        });
    };

    handleClickScheduleTime = (time) => {
        this.setState({ isOpenModalBooking: true, dataScheduleTimeModal: time });
    };

    closeBookingClose = () => {
        this.setState({ isOpenModalBooking: false });
    };

    render() {
        let { allDays, allAvailableTime, isOpenModalBooking, dataScheduleTimeModal } = this.state;
        let { language } = this.props;

        return (
            <>
                <div className="doctor-schedule-container">
                    <div className="all-schedule">
                        <select onChange={this.handleOnChangeSelect}>
                            {allDays.map((item, index) => (
                                <option value={item.value} key={index}>{item.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="all-available-time">
                        <div className="text-calendar">
                            <i className="fas fa-calendar-alt"><span><FormattedMessage id="patient.detail-doctor.schedule" /></span></i>
                        </div>
                        <div className="time-content">
                            {allAvailableTime.length > 0 ? (
                                <>
                                    <div className="time-content-btns">
                                        {allAvailableTime.map((item, index) => (
                                            <button 
                                                key={index} 
                                                className={language === LANGUAGES.VI ? 'btn-vie' : 'btn-en'}
                                                onClick={() => this.handleClickScheduleTime(item)}>
                                                {language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="book-free">
                                        <span>
                                            <FormattedMessage id="patient.detail-doctor.choose" />
                                            <i className="fa fa-hand-point-up"></i>
                                            <FormattedMessage id="patient.detail-doctor.book-free" />
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="no-schedule">
                                    <FormattedMessage id="patient.detail-doctor.no-schedule" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <BookingModal 
                    isOpenModal={isOpenModalBooking}
                    closeBookingClose={this.closeBookingClose}
                    dataTime={dataScheduleTimeModal}
                />
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);