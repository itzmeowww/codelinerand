import { Link as ChakraLink, Spinner, Box, Button } from "@chakra-ui/react";

import { Container } from "../components/Container";

import { DarkModeSwitch } from "../components/DarkModeSwitch";

import { Footer } from "../components/Footer";
import firebase from "../firebase/initFirebase";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Link from "next/link";

import AddHint from "../components/AddHint";
import ShowHint from "../components/ShowHint";
import ShowUser from "../components/ShowUser";

const Admin = () => {
  const db = firebase.firestore();
  const [user, loading, error] = useAuthState(firebase.auth());
  const signOut = () =>
    firebase
      .auth()
      .signOut()
      .then(
        toast({
          title: "Signed out!",
          description: "You've been signed out",
          status: "success",
          duration: 9000,
          isClosable: true,
        })
      );
  const Edit = () => {
    if (loading) {
      return <Spinner />;
    } else if (user == undefined) {
      return (
        <ChakraLink as={Link} href="/auth">
          <Button>Sign In</Button>
        </ChakraLink>
      );
    } else
      return (
        <>
          <Button size="xs" onClick={signOut}>
            Sign Out
          </Button>
          <Box h="20vh"></Box>
          <AddHint />
          <ShowHint />
          <ShowUser />
        </>
      );
  };
  return (
    <Container minH="100vh">
      <Box h="20vh"></Box>
      <Edit />
      <DarkModeSwitch />

      <Footer></Footer>
    </Container>
  );
};

export default Admin;
