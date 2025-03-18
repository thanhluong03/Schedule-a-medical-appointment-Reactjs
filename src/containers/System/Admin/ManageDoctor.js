import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import * as actions from "../../../store/actions";

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import './ManageDoctor.scss';
import Select from 'react-select';
import { CRUD_ACTIONS } from '../../../utils';
import { getDetailInforDoctor } from '../../../services/userService';
import HomeFooter from '../../HomePage/HomeFooter';
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Custom styles cho react-select để hiển thị border "vạch xanh" khi được focus
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    borderColor: state.isFocused ? 'blue' : provided.borderColor,
    boxShadow: state.isFocused ? '0 0 0 1px blue' : provided.boxShadow,
    '&:hover': {
      borderColor: state.isFocused ? 'blue' : provided.borderColor,
    },
    minHeight: 35, 
    height: 35,
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: 35,
    padding: "0 8px",
  }),
  // input: (provided) => ({
  //   ...provided,
  //   margin: 0,
  //   padding: 0,
  // }),
  // indicatorsContainer: (provided) => ({
  //   ...provided,
  //   height: 35,
  // }),
};

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentMarkdown: '',
      contentHTML: '',
      selectedOption: '',
      description: '',
      listDoctors: [],
      hasOldData: false,

      // save to doctor_infor table
      listPrice: [],
      listPayment: [],
      listProvince: [],
      listSpecialty: [],
      listClinic: [],
      
      selectedPrice: '',
      selectedPayment: '',
      selectedProvince: '',
      selectedSpecialty: '',
      selectedClinic: '',
      nameClinic: '',
      addressClinic: '',
      note: '', 
      clinicId: '',
      specialtyId: '',
      
      isLoading: true 
    };
  }
  
  componentDidMount() {
    // Khi component mount, gọi API để lấy dữ liệu cần thiết
    this.props.fetchAllDoctors();
    this.props.getAllRequiredDoctorInfor();
  }

  componentDidUpdate(prevProps) {
    // Khi danh sách bác sĩ được load
    if (prevProps.allDoctors !== this.props.allDoctors) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
      this.setState({
        listDoctors: dataSelect,
        // Nếu có dữ liệu bác sĩ, tắt loading (nếu dữ liệu khác cũng đã có)
        isLoading: dataSelect.length > 0 && !this.state.isLoading ? false : this.state.isLoading,
      });
    }
    // Khi dữ liệu required của bác sĩ được load
    if (prevProps.allRequiredDoctorInfor !== this.props.allRequiredDoctorInfor) {
      let { resPayment, resPrice, resProvince, resSpecialty, resClinic } = this.props.allRequiredDoctorInfor;
      let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
      let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
      let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
      let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
      let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC');
      this.setState({
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
        listSpecialty: dataSelectSpecialty,
        listClinic: dataSelectClinic,
        // Tắt loading nếu tất cả dữ liệu bắt buộc đã có
        isLoading:
          dataSelectPrice.length > 0 &&
          dataSelectPayment.length > 0 &&
          dataSelectProvince.length > 0 &&
          dataSelectSpecialty.length > 0 &&
          dataSelectClinic.length > 0
            ? false
            : this.state.isLoading,
      });
    }
    // Cập nhật lại khi language thay đổi
    if (prevProps.language !== this.props.language) {
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
      let { resPayment, resPrice, resProvince } = this.props.allRequiredDoctorInfor;
      let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
      let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
      let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
      this.setState({
        listDoctors: dataSelect,
        listPrice: dataSelectPrice,
        listPayment: dataSelectPayment,
        listProvince: dataSelectProvince,
      });
    }
  }
  
  buildDataInputSelect = (inputData, type) => {
    let result = [];
    if (inputData && inputData.length > 0) {
      if (type === 'USERS') {
        inputData.forEach((item) => {
          let object = {
            label: `${item.lastName} ${item.firstName}`,
            value: item.id
          };
          result.push(object);
        });
      }
      if (type === 'PRICE') {
        inputData.forEach((item) => {
          let object = {
            label: `${item.valueVi} VND`,
            value: item.keyMap
          };
          result.push(object);
        });
      }
      if (type === 'PAYMENT' || type === 'PROVINCE') {
        inputData.forEach((item) => {
          let object = {
            label: `${item.valueVi}`,
            value: item.keyMap
          };
          result.push(object);
        });
      }
      if (type === 'SPECIALTY') {
        inputData.forEach((item) => {
          let object = {
            label: item.name,
            value: item.id
          };
          result.push(object);
        });
      }
      if (type === 'CLINIC') {
        inputData.forEach((item) => {
          let object = {
            label: item.name,
            value: item.id
          };
          result.push(object);
        });
      }
    }
    return result;
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentMarkdown: text,
      contentHTML: html,
    });
  };

  handleSaveContentMarkdown = () => {
    let { hasOldData } = this.state;
    this.props.saveDetailDoctor({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      doctorId: this.state.selectedOption.value,
      action: hasOldData ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,
      selectedPrice: this.state.selectedPrice.value,
      selectedPayment: this.state.selectedPayment.value,
      selectedProvince: this.state.selectedProvince.value,
      nameClinic: this.state.nameClinic,
      addressClinic: this.state.addressClinic,
      note: this.state.note,
      clinicId: this.state.selectedClinic && this.state.selectedClinic.value ? this.state.selectedClinic.value : '',
      specialtyId: this.state.selectedSpecialty.value
    });
  };

  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedOption });
    let { listPayment, listPrice, listProvince, listSpecialty, listClinic } = this.state;
    let res = await getDetailInforDoctor(selectedOption.value);
    if (res && res.errCode === 0 && res.data && res.data.Markdown) {
      let markdown = res.data.Markdown;
      let addressClinic = '', nameClinic = '', note = '',
          paymentId = '', priceId = '', provinceId = '', specialtyId = '', clinicId = '',
          selectedPayment = '', selectedPrice = '', selectedProvince = '', selectedClinic = '', selectedSpecialty = '';
      if (res.data.Doctor_Infor) {
        addressClinic = res.data.Doctor_Infor.addressClinic;
        nameClinic = res.data.Doctor_Infor.nameClinic;
        note = res.data.Doctor_Infor.note;
        paymentId = res.data.Doctor_Infor.paymentId;
        priceId = res.data.Doctor_Infor.priceId;
        provinceId = res.data.Doctor_Infor.provinceId;
        specialtyId = res.data.Doctor_Infor.specialtyId;
        clinicId = res.data.Doctor_Infor.clinicId;

        selectedPayment = listPayment.find(item => item && item.value === paymentId);
        selectedPrice = listPrice.find(item => item && item.value === priceId);
        selectedProvince = listProvince.find(item => item && item.value === provinceId);
        selectedSpecialty = listSpecialty.find(item => item && item.value === specialtyId);
        selectedClinic = listClinic.find(item => item && item.value === clinicId);
      }
      this.setState({
        contentHTML: markdown.contentHTML,
        contentMarkdown: markdown.contentMarkdown,
        description: markdown.description,
        hasOldData: true,
        addressClinic,
        note,
        nameClinic,
        selectedPayment,
        selectedPrice,
        selectedProvince,
        selectedSpecialty,
        selectedClinic
      });
    } else {
      this.setState({
        contentHTML: '',
        contentMarkdown: '',
        description: '',
        hasOldData: false,
        addressClinic: '',
        nameClinic: '',
        note: '',
        selectedPayment: '',
        selectedPrice: '',
        selectedProvince: '',
        selectedSpecialty: '',
        selectedClinic: '',
      });
    }
  };

  handleChangeSelectDoctorInfor = async (selectedOption, name) => {
    let stateName = name.name;
    this.setState({
      [stateName]: selectedOption
    });
  };

  handleOnChangeText = (event, id) => {
    this.setState({
      [id]: event.target.value
    });
  };

  render() {
    let { hasOldData, isLoading } = this.state;
    return (
      <>
      <div className="manage-doctor-container">
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-bar"></div>
          </div>
        )}
        <div className="manage-doctor-title">
          <FormattedMessage id="admin.manage-doctor.title" />
        </div>
        <div className="more-infor">
          <div className="content-left form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.select-doctor" />
            </label>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeSelect}
              className="form"
              options={this.state.listDoctors}
              
              placeholder={<FormattedMessage id="admin.manage-doctor.select-doctor" />}
              styles={customSelectStyles}
            />
          
          </div>
          <div className="content-right">
            <label>
              <FormattedMessage id="admin.manage-doctor.intro" />
            </label>
            <textarea
              className="form-control"
              onChange={(event) => this.handleOnChangeText(event, 'description')}
              value={this.state.description}
            />
          </div>
        </div>
        <div className="more-infor-extra row ">
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.price" />
            </label>
            <Select
              value={this.state.selectedPrice}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listPrice}
              className="form"
              placeholder={<FormattedMessage id="admin.manage-doctor.price" />}
              name="selectedPrice"
              styles={customSelectStyles}
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.payment" />
            </label>
            <Select
              value={this.state.selectedPayment}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listPayment}
              placeholder={<FormattedMessage id="admin.manage-doctor.payment" />}
              name="selectedPayment"
              className="form"
              styles={customSelectStyles}
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.province" />
            </label>
            <Select
              value={this.state.selectedProvince}
              onChange={this.handleChangeSelectDoctorInfor}
              options={this.state.listProvince}
              placeholder={<FormattedMessage id="admin.manage-doctor.province" />}
              name="selectedProvince"
              className="form"
              styles={customSelectStyles}
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.nameClinic" />
            </label>
            <input
              className="form-control"
              onChange={(event) => this.handleOnChangeText(event, 'nameClinic')}
              value={this.state.nameClinic}
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.addressClinic" />
            </label>
            <input
              className="form-control"
              onChange={(event) => this.handleOnChangeText(event, 'addressClinic')}
              value={this.state.addressClinic}
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.note" />
            </label>
            <input
              className="form-control"
              onChange={(event) => this.handleOnChangeText(event, 'note')}
              value={this.state.note}
            />
          </div>
        </div>
        <div className=" more-infor-extra row">
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.specialty" />
            </label>
            <Select
              value={this.state.selectedSpecialty}
              options={this.state.listSpecialty}
              placeholder={<FormattedMessage id="admin.manage-doctor.specialty" />}
              onChange={this.handleChangeSelectDoctorInfor}
              name="selectedSpecialty"
              className="form"
              styles={customSelectStyles}
            />
          </div>
          <div className="col-4 form-group">
            <label>
              <FormattedMessage id="admin.manage-doctor.select-clinic" />
            </label>
            <Select
              value={this.state.selectedClinic}
              options={this.state.listClinic}
              placeholder={<FormattedMessage id="admin.manage-doctor.select-clinic" />}
              onChange={this.handleChangeSelectDoctorInfor}
              name="selectedClinic"
              className="form"
              styles={customSelectStyles}
            />
          </div>
        </div>
        <div className="manage-doctor-editor">
          <label>Mô tả chi tiết</label>
          <MdEditor
            style={{ height: '300px' }}
            renderHTML={text => mdParser.render(text)}
            onChange={this.handleEditorChange}
            value={this.state.contentMarkdown}
          />
        </div>
        <div className="container">
            <button
              onClick={() => this.handleSaveContentMarkdown()}
              className={hasOldData ? "save-content-doctor" : "create-content-doctor"}
            >
              {hasOldData ? <span>Lưu thông tin</span> : <span>Tạo thông tin</span>}
            </button>
          </div>

      </div>
      <HomeFooter/>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    allDoctors: state.admin.allDoctors,
    allRequiredDoctorInfor: state.admin.allRequiredDoctorInfor,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
    getAllRequiredDoctorInfor: () => dispatch(actions.getAllRequiredDoctorInfor()),
    saveDetailDoctor: (data) => dispatch(actions.saveDetailDoctor(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
