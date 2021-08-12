import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Image,
  Platform,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Text, View } from "../components/Themed";
import * as Location from "expo-location";
import { DocumentScreenList } from "../types";
import db from "../firebase";
import firebase from "@firebase/app";

export default function DocumentScreen() {
  const [imageURI, setImageURI] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [currLocation, setCurrLocation] =
    useState<DocumentScreenList | null>(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
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
      console.log(location.coords);
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImageURI(result.uri);
    }
  };

  const sendToFirebase = async () => {
    let downloadURL = imageURI;

    if (imageURI !== null) {
      downloadURL = await uploadImage();
      console.log("I'm awaiting this upload image");
    } else {
      console.log(" yr u mad at me");
    }

    db.collection("Notes")
      .doc(Date.now().toString())
      .set({
        Date: Date.now(),
        Message: inputValue,
        Location: [currLocation?.latitude, currLocation?.longitude],
        Image: downloadURL ? downloadURL : "",
      })
      .then((docRef: any) => {
        console.log("Document written!" + inputValue);
        setImageURI(null);
        setInputValue("");
      })
      .catch((error: any) => {
        console.error("Error adding document: ", error);
      });
  };

  const uploadImage = async () => {
    const filepath = imageURI;
    setImageURI(null);
    const filename = filepath?.substring(filepath.lastIndexOf("/") + 1);
    // @ts-ignore
    const response = await fetch(filepath);
    const blob = await response.blob();
    console.log(blob);

    // @ts-ignore
    const uploadTask = firebase.storage().ref(filename).put(blob);
    // set progress state
    uploadTask.on("state_changed", () => {
      // setTransferred(
      //   Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
      // );
    });

    let downloadURL = null;

    try {
      await uploadTask;
      downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
      console.log("hi it worked ");
    } catch (e) {
      console.error(e);
    }

    return downloadURL;
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {imageURI && <Image source={{ uri: imageURI }} style={styles.image} />}
      <TextInput
        // multiline
        // numberOfLines={2}
        placeholder="thoughts about your surroundings"
        style={styles.textInput}
        onChangeText={(text) => setInputValue(text)}
        value={inputValue}
      />
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          marginBottom: 30,
        }}
      >
        <Button title="Use image" onPress={pickImage} />
        <Button title="Save" onPress={sendToFirebase} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  textInput: {
    height: 60,
    borderColor: "#eee",
    borderWidth: 1,
    width: "80%",
  },
});
