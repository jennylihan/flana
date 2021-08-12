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

export default function NoteScreen({ route }) {
  const { imageURI, inputValue } = route.params;

  return (
    <View style={styles.container}>
      {imageURI && <Image source={{ uri: imageURI }} style={styles.image} />}
      <Text style={styles.textInput}>{inputValue}</Text>
    </View>
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
    width: "100%",
    height: "50%",
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
    fontSize: 20,
    justifyContent: "center",
    alignContent: "center",
    borderColor: "#eee",
  },
});
