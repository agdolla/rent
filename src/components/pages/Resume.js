import React, { Component } from 'react';
import  {
    View,
    Text,
    Alert,
    TextInput,
    Image,
    TouchableHighlight,
    StyleSheet,
    ListView,
    RefreshControl
} from 'react-native';

import { List, ListItem } from 'react-native-elements';
import Detail from './Detail';
import Player from './Player';

const Resume = React.createClass({
    getInitialState () {
        return {
          refreshing: false,
          dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id})
        }
    },

    loadData () {
      return this.props.dataManager.get('resume');
    },

    handleApiResponse (response) {
      console.info('Resume page - Response from API arrived.');
      let self = this;
      if(response.ok) {
        response.json()
          .then((resumeItems) => {
            console.info('Resume page - Parsed data to JSON.');
            self.setState({
              refreshing: false,
              dataSource: self.state.dataSource.cloneWithRows(resumeItems.items)
            });
          });
      }
      else {
        console.error('Resume page - Fetching from API failed, status:' + response.status);
      }
    },

    componentWillMount () {
      console.info('Resume page - componentWillMount() invoked.');
      console.info('Resume page - fetching menu details from API.');
      this.props.gaTracker.trackScreenView('Resume');
      this.loadData().then(this.handleApiResponse);
    },

    renderRow (rowData, sectionID) {
      let self = this;

      return (
        <ListItem
          roundAvatar
          key={rowData.id}
          title={rowData.title}
          subtitle={rowData.genre}
          avatar={{uri: self.props.dataManager.getApiBaseUrl() + rowData.logoSrc}}
          rightIcon={{name: 'play-circle-outline'}}
          chevronColor="#00A4E4"
          underlayColor="#00A4E4"
          onPress={() => {
            console.log('Resume page - Pressed item with id:[' + rowData.id + '] and videoSrc:[' + rowData.videoSrc + ']');
            let newRoute = self.props.routes[3];
            newRoute.videoId = rowData.id;
            newRoute.videoSrc = rowData.videoSrc;
            console.log('Resume page - Created new router item with id:[' + newRoute.videoId + '] and videoSrc:[' + newRoute.videoSrc + ']');
            self.props.navigator.push(newRoute);
          }}
        />
      )
    },

    onListRefresh () {
     this.setState({
       refreshing: true,
       dataSource: this.state.dataSource
     });
     this.loadData().then(this.handleApiResponse);
   },

    render () {
      var self = this;
      return (
          <ListView
            refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onListRefresh}
            />
          }
            style= {{flex:1}}
            renderRow={this.renderRow}
            dataSource={this.state.dataSource}
          />

      );
    }
});

export default Resume;
