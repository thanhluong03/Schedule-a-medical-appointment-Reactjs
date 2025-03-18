import React, { Component } from "react";
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { FormattedMessage } from "react-intl";
import Select from "react-select";
import * as actions from "../../../store/actions";
import { dateFormat } from '../../../utils';
import DatePicker from '../../../components/Input/DatePicker';
import moment from "moment";
import _ from "lodash";
import { toast } from "react-toastify";
import HomeFooter from "../../HomePage/HomeFooter";
import { saveBulkScheduleDoctor } from '../../../services/userService';

class ManageSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDoctors: [],
            selectedDoctor: [],
            currentDate: '',
            rangeTime: [],
            isLoading: false, // Add isLoading state
        };
    }

    componentDidMount() {
        // Set isLoading to true when data starts fetching
        this.setState({ isLoading: true });

        // Fetch all doctors and schedule time
        this.props.fetchAllDoctors();
        this.props.fetchAllScheduleTime();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect,
            });
        }

        if (prevProps.allScheduleTime !== this.props.allScheduleTime) {
            let data = this.props.allScheduleTime;
            if (data && data.length > 0) {
                data = data.map((item) => ({ ...item, isSelected: false }));
            }
            this.setState({
                rangeTime: data,
                isLoading: false, // Set isLoading to false once data is loaded
            });
        }
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labeVi = `${item.lastName} ${item.firstName}`;
                object.label = labeVi;
                object.value = item.id;
                result.push(object);
            });
        }
        return result;
    };

    handleChangeSelect = async (selectedOption) => {
        this.setState({ selectedDoctor: selectedOption });
    };

    handleOnchangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0],
        });
    };

    handleClickBtnTime = (time) => {
        let { rangeTime } = this.state;
        if (rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map((item) => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            });
            this.setState({
                rangeTime: rangeTime,
            });
        }
    };

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let result = [];
        if (selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error("Invalid selected doctor!!!");
            return;
        }
        if (!currentDate) {
            toast.error("Invalid date!!!");
            return;
        }

        let formatedDate = new Date(currentDate).getTime();
        if (rangeTime && rangeTime.length > 0) {
            let selectedTime = rangeTime.filter((item) => item.isSelected === true);

            if (selectedTime && selectedTime.length > 0) {
                selectedTime.map((schedule, index) => {
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.date = formatedDate;
                    object.timeType = schedule.keyMap;
                    result.push(object);
                });
            } else {
                toast.error("Invalid selected time!!");
                return;
            }
        }

        // Set isLoading to true when saving schedule
        this.setState({ isLoading: true });

        try {
            let res = await saveBulkScheduleDoctor({
                arrSchedule: result,
                doctorId: selectedDoctor.value,
                formatedDate: formatedDate,
            });

            // Set isLoading to false after saving is done
            this.setState({ isLoading: false });

            if (res && res.errCode === 0) {
                toast.success("Save Info succeed!!");
            } else {
                toast.error("Error saving bulk Schedule Doctor!!!");
                console.log('Error saving bulk Schedule Doctor >>> res', res);
            }
        } catch (error) {
            // Set isLoading to false if there is an error
            this.setState({ isLoading: false });
            toast.error("An error occurred while saving schedule!");
            console.log('Error saving bulk Schedule Doctor >>> error', error);
        }
    };

    render() {
        let { rangeTime, isLoading } = this.state;
        let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));

        return (
            <>
            <div className="manage-schedule-container">
                {/* Loading Overlay */}
                {isLoading && (
                    <div className="loading-overlay">
                        <div className="loading-bar"></div>
                    </div>
                )}

                <div className="m-s-title">
                    <FormattedMessage id="manage-schedule.title" />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-6 form-group ">
                            <label> <FormattedMessage id="manage-schedule.choose-doctor" /></label>
                            <Select 
                                value={this.state.selectedDoctor}
                                onChange={this.handleChangeSelect}
                                options={this.state.listDoctors}
                            />
                        </div>
                        <div className="col-6 form-group pick-date-container ">
                            <label> <FormattedMessage id="manage-schedule.choose-date" /></label>
                            <DatePicker
                                onChange={this.handleOnchangeDatePicker}
                                className="form-control date-box"
                                value={this.state.currentDate}
                                minDate={yesterday}
                            />
                        </div>
                        <div className="col-12 pick-hour-container">
                            {rangeTime && rangeTime.length > 0 &&
                                rangeTime.map((item, index) => {
                                    return (
                                        <button 
                                            className={item.isSelected === true ? "btn btn-schedule active" : "btn btn-schedule"} 
                                            key={index}
                                            onClick={() => this.handleClickBtnTime(item)}>
                                            {item.valueVi}
                                        </button>
                                    )
                                })
                            }
                        </div>
                        <div className="col-12">
                            <button 
                                className=" btn-primary btn-save-schedule"
                                onClick={() => this.handleSaveSchedule()}>
                                <FormattedMessage id="manage-schedule.save"/>
                            </button>
                        </div>
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
        isLoggedIn: state.user.isLoggedIn,
        allDoctors: state.admin.allDoctors,
        allScheduleTime: state.admin.allScheduleTime,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
