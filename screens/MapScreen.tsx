import { Text, View } from "../components/Themed";
import React, { useState, useEffect, useRef } from "react";
import Colors from "../constants/Colors";
import { StyleSheet } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, Circle } from "react-native-maps";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/Colors";
import db from "../firebase";
import firebase from "@firebase/app";
import Navigation from "../navigation";

const LOS_ANGELES_REGION = {
  latitude: 34.0522,
  longitude: -118.2437,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function MapScreen({ navigation }) {
  const [currLocation, setCurrLocation] = useState(null);
  const [markers, setMarkers] = useState<any>([]);
  const mapView = useRef(null);

  useEffect(() => {
    // Download chats for user
    let chatsRef = db.collection("Notes");
    // Venus fix
    let unsubscribeFromNewSnapshots = chatsRef.onSnapshot((querySnapshot) => {
      let newList = [];
      querySnapshot.forEach((doc) => {
        let newChat = { ...doc.data() };
        newChat.id = doc.id;
        newList.push(newChat);
      });
      newList.sort((a, b) => a.Date <= b.Date);
      console.log(newList);
      setMarkers(newList);
    });

    return function cleanupBeforeUnmounting() {
      unsubscribeFromNewSnapshots();
    };
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrLocation(location.coords);
    })();
  }, []);

  const goToCurrLocation = () => {
    mapView?.current.animateToRegion(
      {
        latitude: currLocation.latitude,
        longitude: currLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      1000
    );
  };

  return (
    <>
      <MapView
        ref={mapView}
        style={styles.map}
        initialRegion={LOS_ANGELES_REGION}
      >
        {/* {currLocation ? (
          <Marker
            coordinate={currLocation}
            image={require("../assets/images/icon.png")}
            title={"Current Location"}
            description={"You are here!"}
          />
        ) : null} */}

        {/* TODO: add logic to prevent you from opening notes that you're too far from */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.Location}
            title={new Date(marker.Date).toDateString()}
            description={marker.Message}
            onCalloutPress={() =>
              navigation.navigate("NoteScreen", {
                inputValue: marker.Message,
                imageURI: marker.Image,
              })
            }
          />
        ))}
      </MapView>
      {currLocation ? (
        <View style={styles.locateButtonContainer}>
          <TouchableOpacity
            style={styles.locateButton}
            onPress={goToCurrLocation}
          >
            <Ionicons
              name={"navigate"}
              size={40}
              style={{ marginTop: 5, marginLeft: 3 }}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locateButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  locateButton: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: "white",
  },
});
