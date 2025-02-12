import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FormattedMessage } from 'react-intl';



class HomeFooter extends Component {

    render() {
        return (
            <div className="home-footer">
                <p>&copy; Thanhluong depzai. Dep trai qua di.
                    <a target="_blank" href="https://www.youtube.com/watch?v=147SkAVXEqM&list=PLncHg6Kn2JT6E38Z3kit9Hnif1xC_9VqI&index=62"> &#8594; Click here &#8592;</a></p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
