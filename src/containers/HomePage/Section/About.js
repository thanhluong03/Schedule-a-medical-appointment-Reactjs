import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FormattedMessage } from 'react-intl';



class About extends Component {

    render() {
        return (
            <div className="section-share section-about">
                <div className="section-about-header">Truyền thông nói gì về Phòng khám đa khoa</div>
                <div className="section-about-content">
                    <div className="content-left">
                    <iframe width="100%" height="400px" src="https://www.youtube.com/embed/i50V95Yqr9c" title="Bệnh viện Đa Khoa Quốc tế Nam Sài Gòn &#39;Tất cả vì người bệnh&quot;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    </div>
                    <div className="content-right">
                        <p>
                        Bệnh viện Đa khoa Quốc tế Nam Sài Gòn là một bệnh viện tư nhân và bắt đầu đi vào hoạt động từ cuối 2018.
                        Sứ mệnh của chúng tôi là cung cấp những dịch vụ khám chữa bệnh, chăm sóc sức khỏe tốt và phù hợp cho tất cả mọi đối tượng, kể cả người có thu nhập trung bình và thấp.
                        </p>
                        <span>Khẩu hiệu của chúng tôi là: Tất cả vì người bệnh!</span>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
