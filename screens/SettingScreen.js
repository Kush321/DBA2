import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { Card } from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import db from '../config';
import firebase from 'firebase';
import { RFValue } from 'react-native-responsive-fontsize';

export default class SettingScreen extends Component {
  constructor() {
    super();
    this.state = {
      emailId: '',
      firstName: '',
      lastName: '',
      address: '',
      contact: '',
      docId: '',
      isEnabled: false,
      light_theme: true,
      current_theme: 'light',
    };
  }

  toggleSwitch() {
    const previous_state = this.state.isEnabled;
    const theme = !this.state.isEnabled ? 'dark' : 'light';
    var updates = {};
    updates['/users/' + firebase.auth().currentUser.uid + '/current_theme'] =
      theme;
    firebase.database().ref().update(updates);
    this.setState({ isEnabled: !previous_state, light_theme: previous_state });
  }

  async fetchUser() {
    let theme;
    await firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', function (snapshot) {
        theme = snapshot.val().current_theme;
      });
    this.setState({
      light_theme: theme === 'light' ? true : false,
      isEnabled: theme === 'light' ? false : true,
    });
  }

  getUserDetails = () => {
    var email = firebase.auth().currentUser.email;
    db.collection('users')
      .where('email_id', '==', email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            emailId: data.email_id,
            firstName: data.first_name,
            lastName: data.last_name,
            address: data.address,
            contact: data.contact,
            current_theme: data.current_theme,
            docId: doc.id,
          });
        });
      });
  };

  updateUserDetails = () => {
    db.collection('users').doc(this.state.docId).update({
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      address: this.state.address,
      contact: this.state.contact,
      current_theme: this.state.current_theme,
    });

    alert('Profile Updated Successfully');
  };

  componentDidMount() {
    this.getUserDetails();
    this.fetchUser();
  }

  render() {
    return (
      <View
        style={
          this.state.light_theme
            ? styles.formContainerLight
            : styles.formContainer
        }>
        <MyHeader title="Settings" navigation={this.props.navigation} />
        <Text style={this.state.light_theme ? styles.labelLight : styles.label}>
          First Name{' '}
        </Text>
        <TextInput
          style={
            this.state.light_theme
              ? styles.formTextInputLight
              : styles.formTextInput
          }
          placeholder={'First Name'}
          maxLength={12}
          onChangeText={(text) => {
            this.setState({
              firstName: text,
            });
          }}
          value={this.state.firstName}
        />
        <Text style={this.state.light_theme ? styles.labelLight : styles.label}>
          Last Name{' '}
        </Text>
        <TextInput
          style={
            this.state.light_theme
              ? styles.formTextInputLight
              : styles.formTextInput
          }
          placeholder={'Last Name'}
          maxLength={12}
          onChangeText={(text) => {
            this.setState({
              lastName: text,
            });
          }}
          value={this.state.lastName}
        />
        <Text style={this.state.light_theme ? styles.labelLight : styles.label}>
          Contact{' '}
        </Text>
        <TextInput
          style={
            this.state.light_theme
              ? styles.formTextInputLight
              : styles.formTextInput
          }
          placeholder={'Contact'}
          maxLength={10}
          keyboardType={'numeric'}
          onChangeText={(text) => {
            this.setState({
              contact: text,
            });
          }}
          value={this.state.contact}
        />
        <Text style={this.state.light_theme ? styles.labelLight : styles.label}>
          Address{' '}
        </Text>
        <TextInput
          style={
            this.state.light_theme
              ? styles.formTextInputLight
              : styles.formTextInput
          }
          placeholder={'Address'}
          //multiline={true}
          onChangeText={(text) => {
            this.setState({
              address: text,
            });
          }}
          value={this.state.address}
        />
        <Text
          style={
            this.state.light_theme
              ? {
                  textAlign: 'center',
                  padding: RFValue(8),
                  marginTop: RFValue(-15),
                  color: 'black',
                }
              : {
                  textAlign: 'center',
                  padding: RFValue(8),
                  marginTop: RFValue(-15),
                  color: 'white',
                }
          }>
          Theme
        </Text>
        <Switch
          style={{
            transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
            alignSelf: 'center',
          }}
          trackColor={{
            false: 'black',
            true: 'white',
          }}
          thumbColor={this.state.isEnabled ? 'black' : 'white'}
          ios_backgroundColor="white"
          onValueChange={() => this.toggleSwitch()}
          value={this.state.isEnabled}
        />
        <View style={styles.buttonView}>
          <TouchableOpacity
            style={this.state.light_theme ? styles.buttonLight : styles.button}
            onPress={() => {
              this.updateUserDetails();
            }}>
            <Text
              style={
                this.state.light_theme
                  ? styles.buttonTextLight
                  : styles.buttonText
              }>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  formContainer: {
    justifyContent: 'center',
    marginTop: RFValue(-60),
    backgroundColor: 'black',
    flex: 1
  },
  label: {
    fontSize: RFValue(18),
    color: 'white',
    fontWeight: 'bold',
    padding: RFValue(10),
    marginLeft: RFValue(20),
  },
  formTextInput: {
    width: '90%',
    height: RFValue(50),
    padding: RFValue(10),
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'grey',
    marginBottom: RFValue(20),
    marginLeft: RFValue(20),
    color: 'white',
  },
  button: {
    width: '75%',
    height: RFValue(60),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(50),
    backgroundColor: 'black',
    marginTop: RFValue(20),
  },
  buttonView: {
    //flex: 0.22,
    alignItems: 'center',
    //marginTop: RFValue(175),
  },
  buttonText: {
    fontSize: RFValue(23),
    fontWeight: 'bold',
    color: 'white',
  },

  ///////

  formContainerLight: {
    //flex: 0.88,
    justifyContent: 'center',
    marginTop: RFValue(-60),
    backgroundColor: 'white',
    flex: 1
  },
  labelLight: {
    fontSize: RFValue(18),
    color: 'black',
    fontWeight: 'bold',
    padding: RFValue(10),
    marginLeft: RFValue(20),
  },
  buttonLight: {
    width: '75%',
    height: RFValue(60),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(50),
    backgroundColor: 'white',
    marginTop: RFValue(20),
  },
  buttonTextLight: {
    fontSize: RFValue(23),
    fontWeight: 'bold',
    color: 'black',
  },
  formTextInputLight: {
    width: '90%',
    height: RFValue(50),
    padding: RFValue(10),
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'grey',
    marginBottom: RFValue(20),
    marginLeft: RFValue(20),
  },
});
