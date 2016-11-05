import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    View,
    ListView,
    ScrollView,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Navigator,
    Animated,
    Linking,
    Dimensions,
    WebView,
} from 'react-native';
import BaseComponent from '../core/BaseComponent';
import CommentList from './CommentList';

export default class UserDetail extends BaseComponent {

    constructor(props) {
        super(props, '用户详情');
        this.state = {
            bean: null,
        }
    }

    componentDidMount() {
        this.onFetch();
    }

    async onFetch() {
        window.loading.show(true);
        let params = {
            access_token: window.accessToken,
            user: this.props.id,
            friend: this.props.id,
            dataType: 'json',
        };
        let url = `${window.domain}/action/openapi/user_information?${Object.parseParam(params)}`;
        let response = await this.request(url);
        this.setState({
            bean: response,
        });
        window.loading.show(false);
    }

    render() {
        if (!this.state.bean)
            return null;
        return (
            <View style={styles.container}>
	            <View style={styles.title}>
		            <Image
		                style={styles.image}
		                source={{ uri: this.state.bean.portrait }}
		            />
		        </View>
                <View style={styles.title}>
                    <Text style={window.theme.text}>{this.state.bean.name}</Text>
                </View>
                <View style={styles.subTitle}>
                	<Text style={window.theme.text}>性别：</Text>
	            	<Text style={[window.theme.text, styles.rowRight]}>
                		{this.state.bean.gender == 1 ? '男' : '女'}
                	</Text>
                </View>
                <View style={styles.subTitle}>
	            	<Text style={window.theme.text}>地区：</Text>
	            	<Text style={[window.theme.text, styles.rowRight]}>
	            		{this.state.bean.province} {this.state.bean.city}
	            	</Text>
	            </View>
	            <View style={styles.subTitle}>
	            	<Text style={window.theme.text}>开发平台：</Text>
	            	<Text style={[window.theme.text, styles.rowRight]}>
	            		{
	            			!this.state.bean.platforms ? null :
	            				this.state.bean.platforms.map((m, i) => {
	            					return (
	            						<Text key={i}>{m}{' '}</Text>
	            					)
	            				})
	            		}
	            	</Text>
	            </View>
	            <View style={styles.subTitle}>
	            	<Text style={window.theme.text}>专长领域：</Text>
	            	<Text style={[window.theme.text, styles.rowRight]}>
	            		{
	            			!this.state.bean.expertise ? null :
	            				this.state.bean.expertise.map((m, i) => {
	            					return (
	            						<Text key={i}>{m}{' '}</Text>
	            					)
	            				})
	            		}
	            	</Text>
	            </View>
	            <View style={styles.subTitle}>
	            	<Text style={window.theme.text}>加入时间：</Text>
	            	<Text style={window.theme.text}>
	            		{this.state.bean.joinTime}
	            	</Text>
	            </View>
	            <View style={styles.subTitle}>
	            	<Text style={window.theme.text}>最近登录时间：</Text>
	            	<Text style={[window.theme.text, styles.rowRight]}>
	            		{this.state.bean.lastLoginTime}
	            	</Text>
	            </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    subTitle: {
        padding: 10,
        flexDirection: 'row',
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
    },
    rowRight: {
    	flex: 1,
    },
    btn: {
        marginLeft: 10,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        borderRadius: 50,
        borderColor: '#ccc',
        borderWidth: 1,
    },
});
