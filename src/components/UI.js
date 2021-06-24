import { Text, Flex, Box, CloseButton } from "@chakra-ui/react";

import firebase from "../firebase/initFirebase";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useState, useEffect } from "react";

const UI = () => {
  return <Flex w="100vw" h="100vh"></Flex>;
};
export default UI;
