import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from "react-native";
import { DrawerItems } from "react-navigation-drawer";
import { Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import firebase from "firebase";
import db from "../config";
import { Icon } from "react-native-elements";

import { RFValue } from "react-native-responsive-fontsize";

export default class CustomSideBarMenu extends Component {
  state = {
    userId: firebase.auth().currentUser.email,
    image: "#",
    name: "",
    docId: "",
    light_theme: true
  };

  fetchUser = () => {
    let theme;
    firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", snapshot => {
        theme = snapshot.val().current_theme;
        this.setState({ light_theme: theme === "light" });
      });
  };

  selectPicture = async () => {
    const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3], //this is aspect of image so that it will give the crop option for square image
      quality: 1, //this is quality parameter 
    });
//33 line and 34 line why are we using here
//1 more question

    if (!cancelled) {
      this.uploadImage(uri, this.state.userId);
    }
  };

  uploadImage = async (uri, imageName) => {
    var response = await fetch(uri);
    var blob = await response.blob();

    var ref = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    return ref.put(blob).then((response) => {
      this.fetchImage(imageName);
    });
  };

  fetchImage = (imageName) => {
    var storageRef = firebase
      .storage()
      .ref()
      .child("user_profiles/" + imageName);

    // Get the download URL
    storageRef
      .getDownloadURL()
      .then((url) => {
        this.setState({ image: url });
      })
      .catch((error) => {
        this.setState({ image: "#" });
      });
  };

  getUserProfile() {
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            name: doc.data().first_name + " " + doc.data().last_name,
            docId: doc.id,
            image: doc.data().image,
          });
        });
      });
  }

  componentDidMount() {
    this.fetchImage(this.state.userId);
    this.getUserProfile();
    this.fetchUser();
  }

  render() {
    return (
      <View style={
      this.state.light_theme ? {
        borderColor: "black",
        flex: 1,
        borderWidth: RFValue(5)
      }:{
        borderColor: "white",
        flex: 1,
        borderWidth: RFValue(5)
      }}>
        <View
          style={this.state.light_theme ? {
            flex: 0.3,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            paddingTop: RFValue(50),
            paddingBottom: RFValue(50),
            borderBottomWidth: RFValue(5),
            borderColor: "black"
          } : {
            flex: 0.3,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
            paddingTop: RFValue(50),
            paddingBottom: RFValue(50),
            borderColor: "white",
            borderBottomWidth: RFValue(5)
          }}
        >
          <Avatar
            rounded
            source={{
              uri: this.state.image,
            }}
            size={"xlarge"}
            onPress={() => this.selectPicture()}
            showEditButton
          />

          <Text
            style={this.state.light_theme ? {
              fontWeight: "400",
              fontSize: RFValue(20),
              color: "black",
              padding: RFValue(10),
            } : {
              fontWeight: "400",
              fontSize: RFValue(20),
              color: "red",
              padding: RFValue(10),
            }}
          >
            {this.state.name}
          </Text>
        </View>
        <View style={this.state.light_theme ? {
              flex: 0.6, 
              backgroundColor: "white",
              paddingBottom: RFValue(5) 
            } : {
              flex: 0.6, 
              backgroundColor: "grey", 
              paddingBottom: RFValue(5)
            }}>
          <DrawerItems {...this.props} />
        </View>
        <View style={this.state.light_theme ? {
              flex: 0.1, 
              backgroundColor: "white",
              borderTopWidth: RFValue(5),
              borderColor: "black" 
            } : {
              flex: 0.1, 
              backgroundColor: "black", 
              borderTopWidth: RFValue(5),
              borderColor: "white",
            }}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              this.props.navigation.navigate("WelcomeScreen");
              firebase.auth().signOut();
            }}
          >

            <Text
              style={{
                fontSize: RFValue(15),
                marginTop: RFValue(10),
                color: "red"
              }}
            >
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerItemsContainer: {
    flex: 0.8,
  },
  logOutContainer: {
    flex: 0.2,
    justifyContent: "flex-end",
    paddingBottom: 30,
    flexDirection: "row",
  },
  logOutButton: {
    height: 30,
    width: "85%",
    justifyContent: "center",
    padding: 10,
  },
  imageContainer: {
    flex: 0.75,
    width: "40%",
    height: "20%",
    marginLeft: 20,
    marginTop: 30,
    borderRadius: 40,
  },
  logOutText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  logoutButton: {
    alignContent: "center",
    flexDirection: "row",
    //borderWidth: RFValue(2),
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 50,
    padding: RFValue(10)
  }
});

//Put before text in logout button
/*<Icon
    name="logout"
    type="antdesign"
    size={RFValue(20)}/>*/




