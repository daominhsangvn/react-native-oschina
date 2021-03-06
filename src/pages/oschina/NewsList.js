import {
    React,
    BaseComponent,
    PropTypes,
    StyleSheet,
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    ListView,
    RefreshListView,
} from '../../core/Libraries';
import NewsDetail from './NewsDetail';

export default class NewsList extends BaseComponent {

    constructor(props) {
        super(props, '资讯列表');
        this.state = {
            dataSource: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
            pageSize: 20,
            pageCount: 0,
            loaded: false,
        }
        this.listData = [];
        this.catalog = 1;
        this.rightButton = [{
            id: 1,
            name: '类别',
            selectedId: 1,
            children: [{
                id: 1,
                name: '全部',
                onPress: this.onPressRightButton.bind(this, 1),
            }, {
                id: 2,
                name: '综合资讯',
                onPress: this.onPressRightButton.bind(this, 2),
            }, {
                id: 3,
                name: '软件更新',
                onPress: this.onPressRightButton.bind(this, 3),
            }]
        }];
    }

    async onFetch(pageNo) {
        if (pageNo == 1)
            this.listData = [];
        let params = {
            access_token: window.accessToken,
            catalog: this.catalog,
            page: pageNo,
            pageSize: this.state.pageSize,
            dataType: 'json',
        };
        let url = `${window.domain}/action/openapi/news_list?${Object.parseParam(params)}`;
        let response = await this.request(url);
        this.listData = this.listData.concat(response.newslist);
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.listData),
            pageCount: 999999,
            loaded: true,
        });
    }

    onPress(id) {
        this.props.navigator.push({
            component: NewsDetail,
            params: {
                id
            },
        });
    }

    onPressRightButton(id) {
        this.catalog = id;
        this.onFetch(1);
    }

    renderRow(rowData) {
        return (
            <TouchableOpacity
                style={[
                    styles.listItem,
                    { backgroundColor: window.theme.whiteColor },
                ]}
                onPress={this.onPress.bind(this, rowData.id)}
                >
                <Text style={[window.theme.text, styles.title]}>{rowData.title}</Text>
                <Text style={window.theme.subText}>{rowData.pubDate}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        if (this.state.loaded && this.state.dataSource.getRowCount() == 0) {
            return (
                <View style={styles.message}>
                    <Text style={window.theme.subText}>暂无评论</Text>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <RefreshListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    onFetch={this.onFetch.bind(this)}
                    pageCount={this.state.pageCount}
                    />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listItem: {
        marginBottom: 1,
        padding: 12,
    },
    title: {
        marginBottom: 5,
    },
    message: {
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
