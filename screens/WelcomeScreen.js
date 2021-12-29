import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Modal,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  ImageBackground
} from "react-native";

import SantaAnimation from "../components/SantaClaus.js";
import db from "../config";
import firebase from "firebase";

import { Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";

export default class WelcomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      emailId: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      contact: "",
      current_theme: "light",
      confirmPassword: "",
      isModalVisible: "false"
    };
  }

  userSignUp = (emailId, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return alert("password doesn't match\nCheck your password.");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(emailId, password)
        .then(() => {
          db.collection("users").add({
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            contact: this.state.contact,
            email_id: this.state.emailId,
            address: this.state.address,
            current_theme: this.state.current_theme,
            IsBookRequestActive: false
          });
          return alert("User Added Successfully", "", [
            {
              text: "OK",
              onPress: () => this.setState({ isModalVisible: false })
            }
          ]);
        })
        .catch(error => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          return alert(errorMessage);
        });
    }
  };

  userLogin = (emailId, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(emailId, password)
      .then(() => {
        this.props.navigation.navigate("DonateBooks");
      })
      .catch(error => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return alert(errorMessage);
      });
  };



  showModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isModalVisible}
      >
      <SafeAreaView/>
        <ScrollView style={styles.scrollview}>
          <View style={styles.signupView}>
            <Text style={styles.signupText}> SIGN UP </Text>
          </View>
          <View style={{ flex: 0.95 }}>
          <View style = {{padding: RFValue(5)}}/>
            <Text style={styles.label}>First Name </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"First Name"}
              maxLength={12}
              onChangeText={text => {
                this.setState({
                  firstName: text
                });
              }}
            />

            <Text style={styles.label}>Last Name </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Last Name"}
              maxLength={12}
              onChangeText={text => {
                this.setState({
                  lastName: text
                });
              }}
            />

            <Text style={styles.label}>Contact Information</Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Phone Number"}
              maxLength={10}
              keyboardType={"number-pad"}
              onChangeText={text => {
                this.setState({
                  contact: text
                });
              }}
            />

            <Text style={styles.label}> Address </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Street"}
              //multiline={true}
              onChangeText={text => {
                this.setState({
                  address: text
                });
              }}
            />

            <Text style={styles.label}>Email </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Email"}
              keyboardType={"email-address"}
              onChangeText={text => {
                this.setState({
                  emailId: text
                });
              }}
            />

            <Text style={styles.label}> Password </Text>
            <TextInput
              style={styles.formInput}
              placeholder={"Password"}
              secureTextEntry={true}
              onChangeText={text => {
                this.setState({
                  password: text
                });
              }}
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={[styles.formInput, {marginBottom: RFValue(40)}]}
              placeholder={"Confirm Password"}
              secureTextEntry={true}
              onChangeText={text => {
                this.setState({
                  confirmPassword: text
                });
              }}
            />
          </View>

          <View style={{ flex: 0.2, alignItems: "center" }}>
            <TouchableOpacity
              style={[styles.button, {marginBottom: RFValue(0)}]}
              onPress={() =>
                this.userSignUp(
                  this.state.emailId,
                  this.state.password,
                  this.state.confirmPassword
                )
              }
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <Text
              style={styles.cancelButtonText}
              onPress={() => {
                this.setState({ isModalVisible: false });
              }}
            >
              Cancel
            </Text>
          </View>
        </ScrollView>
      </Modal>
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground 
        source={require("../assets/abstract.jpg")}
        resizeMode = "stretch">
        {this.showModal()}
        <View style={{ flex: 0.25 }}>
          <View style={{ flex: 0.15 }} />
          <View style={styles.titleView}>
            <Text style = {styles.titleText}>Title</Text>
          </View>
        </View>
        <View style={{ flex: 0.45 }}>
          <View style={styles.textInput}>
            <TextInput
              style={styles.loginBox}
              placeholder="abc@example.com"
              placeholderTextColor="gray"
              keyboardType="email-address"
              onChangeText={text => {
                this.setState({
                  emailId: "one@gmail.com"
                });
              }}
            />
            <TextInput
              style={styles.loginBox}
              secureTextEntry={true}
              placeholder="Enter Password"
              placeholderTextColor="gray"
              onChangeText={text => {
                this.setState({
                  password: "123456"
                });
              }}

            />
          </View>
          <View style={{ flex: 0.5, alignItems: "center", marginTop: RFValue(20) }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.userLogin(this.state.emailId, this.state.password);
              }}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => this.setState({ isModalVisible: true })}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flex: 0.3 }}>
          <Image
            source={require("../assets/splash.png")}
            style={styles.bookImage}
            resizeMode={"stretch"}
          />
        </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "white"
  },
  loginBox: {
    width: "75%",
    height: RFValue(45),
    borderWidth: RFValue(1),
    borderColor: "red",
    fontSize: RFValue(20),
    paddingLeft: RFValue(15),
    borderRadius: 50,
    marginBottom: RFValue(10),
    backgroundColor: "black",
    color: "white"
  },
  
  button: {
    width: "40%",
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(25),
    backgroundColor: "black",
    //opacity: 0.5,
    marginBottom: RFValue(15),
    borderWidth: RFValue(1),
    borderColor: "white"
  },
  buttonText: {
    color: "red",
    fontWeight: "200",
    fontSize: RFValue(20),
  },
  label: {
    fontSize: RFValue(14),
    color: "red",
    //fontWeight: "bold",
    marginLeft: RFValue(25),
    paddingBottom: RFValue(3)
  },
  formInput: {
    width: "90%",
    height: RFValue(35),
    padding: RFValue(10),
    borderWidth: 1,
    borderRadius: 25,
    borderColor: "white",
    paddingBottom: RFValue(10),
    paddingLeft: RFValue(15),
    alignSelf: "center",
    marginBottom: RFValue(14)
  },
  cancelButtonText: {
    fontSize: RFValue(20),
    color: "white",
    marginTop: RFValue(10)
  },
  scrollview: {
    flex: 1,
    paddingTop: RFValue(15),
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderColor: "white",
    borderWidth: RFValue(2)
  },
  signupView: {
    flex: 0.05,
    justifyContent: "center",
    alignItems: "center"
  },
  signupText: {
    fontSize: RFValue(24),
    color: "red"
  },
  titleView: {
    flex: 0.85,
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(10),
  },
  titleText: {
    fontSize: RFValue(36),
    color: "white"
  },
  /*santaImage: {
    width: "70%",
    height: "100%",
    resizeMode: "stretch"
  },*/
  textInput: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center"
  },
  bookImage: {
    width: "100%",
    height: RFValue(220)
  },


  ////////LIGHT!!!!!!!!!!!!!!!


  buttonLight: {
    width: "40%",
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(25),
    backgroundColor: "#ffff",
    //shadowColor: "#000",
    marginBottom: RFValue(15),
    borderWidth: RFValue(2),
    /*shadowOffset: {
      width: 0,
      height: 8
    },*/
    //shadowOpacity: 0.3,
    //shadowRadius: 10.32,
    //elevation: 16,
  },
  buttonTextLight: {
    color: "#32867d",
    fontWeight: "200",
    fontSize: RFValue(20)
  },
  loginBoxLight: {
    width: "75%",
    height: RFValue(45),
    borderWidth: RFValue(1),
    borderColor: "black",
    fontSize: RFValue(20),
    paddingLeft: RFValue(15),
    borderRadius: 50,
    marginBottom: RFValue(10),
    backgroundColor: "white",
    color: "black"
  },
  labelLight: {
    fontSize: RFValue(14),
    color: "black",
    //fontWeight: "bold",
    marginLeft: RFValue(25),
    paddingBottom: RFValue(3)
  },
  formInputLight: {
    width: "90%",
    height: RFValue(35),
    padding: RFValue(10),
    borderWidth: 1,
    borderRadius: 25,
    borderColor: "black",
    paddingBottom: RFValue(10),
    paddingLeft: RFValue(15),
    alignSelf: "center",
    marginBottom: RFValue(14)
  },
  cancelButtonTextLight: {
    fontSize: RFValue(20),
    color: "black",
    marginTop: RFValue(10)
  },
  scrollviewLight: {
    flex: 1,
    paddingTop: RFValue(15),
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderColor: "black",
    borderWidth: RFValue(2)
  },
  signupTextLight: {
    fontSize: RFValue(24),
    color: "black"
  },
  titleTextLight: {
    fontSize: RFValue(36),
    color: "black"
  },
});
