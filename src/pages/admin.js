import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Box,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";

import { Container } from "../components/Container";

import { DarkModeSwitch } from "../components/DarkModeSwitch";

import { Footer } from "../components/Footer";
import firebase from "../firebase/initFirebase";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

import AddHint from "../components/AddHint";
import ShowHint from "../components/ShowHint";

const Admin = () => {
  const db = firebase.firestore();
  const [user, loading, error] = useAuthState(firebase.auth());

  return (
    <Container minH="100vh">
      <Box h="20vh"></Box>
      <AddHint />
      <ShowHint />

      <DarkModeSwitch />

      <Footer></Footer>
    </Container>
  );
};

export default Admin;
