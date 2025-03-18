import React, { Component} from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import './ManageClinic.scss';
import MarkdownIt from "markdown-it";
import MdEditor from 'react-markdown-editor-lite';
import {CommonUtils} from '../../../utils';
import { createNewClinic } from '../../../services/userService';
import {toast} from "react-toastify";
import { lang } from "moment";
import Lightbox from 'react-image-lightbox';
import HomeFooter from "../../HomePage/HomeFooter";
const mdParser = new MarkdownIt();
class ManageClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
            isOpen: false,
        }
    }

    async componentDidMount() {
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language){

        }
    }

    handeOnchangeInput = (event, id) => {
        let stateCopy = {...this.state}
        stateCopy[id] = event.target.value;
        this.setState({
            ...stateCopy
        })
    }
    openPreviewImage = () => {
        if (!this.state.imageBase64) return;
        this.setState({
            isOpen: true
        })
    }
    handleEditorChange = ({html, text}) => {
        this.setState({
            descriptionHTML: html,
            descriptionMarkdown: text,
        })
    }

    handeOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if(file) {
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64
            })
        }
    }

    handleSaveNewClinic = async () => {
        let res = await createNewClinic(this.state)
        if(res && res.errCode === 0){
            toast.success('Add new specialty success!!')
            this.setState({
                name: '',
                address: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
            })
        } else {
            toast.error('Something wrongs...')
            console.log('nnn', res)
        }
    }
    render() {
        return (
            <>
            <div className="manage-clinic-container">
                <div className="ms-title">Quản lý cơ sở y tế</div>
                <div className="add-new-clinic row">
                    <div className="col-6 form-group">
                        <label>Tên cơ sở y tế</label>
                        <input className="form-control" type="text" value={this.state.name}
                        onChange={(event) => this.handeOnchangeInput(event, 'name')}/>
                    </div>
                    <div className="col-6 form-group">
                        <label>Địa chỉ cơ sở y tế</label>
                        <input className="form-control" type="text" value={this.state.address}
                        onChange={(event) => this.handeOnchangeInput(event, 'address')}/>
                    </div>
                    <div className="col-6 form-group">
                        <label>Ảnh cơ sở y tế</label>
                        <div className="preview-img-container">
                            <input id ="previewImg" type="file" hidden
                                onChange={(event) => this.handeOnchangeImage(event)}/>
                            <label className="label-upload" htmlFor="previewImg">Tải ảnh <i className="fas fa-upload"></i></label>
                            <div className="preview-image"
                                style= {{backgroundImage: `url(${this.state.imageBase64})`}}
                                onClick={() => this.openPreviewImage()}
                                >       
                                </div>
                            </div>
                        </div>
                    <div className="col-12">
                        <label>Mô tả chi tiết</label>
                        <MdEditor
                        style={{height:'300px'}}
                        renderHTML={text => mdParser.render(text)}
                        onChange={this.handleEditorChange}
                        value={this.state.descriptionMarkdown}/>
                    </div>
                    <div className="col-12">
                        <button className="btn-save-clinic" 
                        onClick={() => this.handleSaveNewClinic()}>
                            Lưu phòng khám
                        </button>
                    </div>
                    {this.state.isOpen === true && 
                        <Lightbox 
                        mainSrc= {this.state.imageBase64}
                        onCloseRequest={() => this.setState({isOpen: false})}
                        />
                    }
                </div>
            </div>
            <HomeFooter/>
            </>
        );
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
       
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
