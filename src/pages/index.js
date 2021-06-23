import {
  Link as ChakraLink,
  Text,
  Spinner,
  Box,
  Button,
  useToast,
  Flex,
} from "@chakra-ui/react";

import { Container } from "../components/Container";

import { DarkModeSwitch } from "../components/DarkModeSwitch";

import { Footer } from "../components/Footer";
import firebase from "../firebase/initFirebase";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";

import Link from "next/link";
const Index = () => {
  const toast = useToast();

  const db = firebase.firestore();
  const [user, loading, error] = useAuthState(firebase.auth());
  const [gotHint, setGotHint] = useState(false);
  const [userHint, setUserHint] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [queue, queueLoading, queueError] = useCollection(
    db.collection("queue").orderBy("timestamp"),
    {}
  );
  const [userList, userListLoading, userListError] = useCollection(
    db.collection("user"),
    {}
  );
  const [hintList, hintListLoading, hintListError] = useCollection(
    db.collection("hint"),
    {}
  );
  const haveUser = (user) => {
    let have = false;
    if (userList.empty) return false;
    else {
      userList.docs.forEach((doc) => {
        if (user != undefined && doc.id === user.uid) {
          have = true;
        }
      });
      return have;
    }
  };

  const addUser = async (user) => {
    setUser(user, false, "", "");
  };

  const setUser = async (user, gotHint, hint, answer) => {
    if (user != undefined)
      await db.collection("user").doc(user.uid).set({
        name: user.displayName,
        gotHint: gotHint,
        hint: hint,
        answer: answer,
      });
  };

  const showQueue = () => {
    queue.docs.forEach(async (doc) => {
      console.log(doc.data());
    });
  };

  const isInQueue = (user) => {
    let isIn = false;
    if (queue.empty) return false;
    else {
      queue.docs.forEach((doc) => {
        if (doc.data().uid === user.uid) {
          isIn = true;
        }
      });
      return isIn;
    }
  };

  const addQueue = async (user) => {
    if (hintList.empty) {
      toast({
        title: "Error!",
        description: "No hint available, please contact admin",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      let queueTime = firebase.firestore.FieldValue.serverTimestamp();
      let isIn = isInQueue(user);
      console.log(isIn);
      if (!isIn) {
        await db
          .collection("queue")
          .add({ uid: user.uid, timestamp: queueTime });
        setWaiting(true);
      }
    }
  };

  const removeQueue = async (user) => {
    queue.docs.forEach(async (doc) => {
      if (doc.data().uid === user.uid)
        await db.collection("queue").doc(doc.id).delete();
    });
  };

  useEffect(async () => {
    if (!queueLoading && !loading && !hintListLoading && waiting && !gotHint)
      if (queue.empty) {
        console.log("queue is empty");
      } else {
        if (user != undefined && queue.docs[0].data().uid == user.uid) {
          let idx = Math.floor(Math.random() * hintList.docs.length);
          if (idx >= hintList.docs.length) idx = hintList.docs.length - 1;
          await setUser(
            user,
            true,
            hintList.docs[idx].data().hint,
            hintList.docs[idx].data().name
          );
          await db.collection("hint").doc(hintList.docs[idx].id).delete();
          removeQueue(user);
        }
      }
  }, [queue, queueLoading, loading, hintListLoading]);

  useEffect(async () => {
    if (!loading && !userListLoading) {
      if (!haveUser(user)) await addUser(user);
      else {
        userList.docs.forEach((doc) => {
          if (user != undefined && doc.id == user.uid) {
            setGotHint(doc.data().gotHint);
            setUserHint(doc.data().hint);
          }
        });
      }
    }
  }, [userList, userListLoading, loading]);

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

  const Hint = () => {
    if (gotHint)
      return (
        <Flex bg="yellow.100" p="5px" rounded="md">
          <Text color="black" fontSize="xl" fontFamily="mono">
            "{userHint}"
          </Text>
        </Flex>
      );
    else return <Button onClick={() => addQueue(user)}>GET A HINT</Button>;
  };

  const Name = () => {
    if (loading) {
      return <Spinner />;
    }
    if (user == undefined) {
      return (
        <ChakraLink as={Link} href="/auth">
          <Button>Sign In</Button>
        </ChakraLink>
      );
    } else {
      return (
        <Flex flexDir="column" align="center" justify="center">
          <Text colorScheme="whiteAlpha" fontSize="3xl" fontFamily="mono">
            {loading ? <Spinner /> : "Hi! " + user.displayName}
          </Text>

          <Button size="xs" onClick={signOut}>
            Sign Out
          </Button>
          <Box h="5vh"></Box>
          <Hint />
        </Flex>
      );
    }
  };

  return (
    <Container height="100vh">
      <Box h="30vh"></Box>
      <Name />

      <Box h="5vh"></Box>

      <DarkModeSwitch />
      <Box h="30vh"></Box>
      <Footer>
        <Text color="grey" fontFamily="mono">
          Code with 💖 by Thanasan Kumdee & Designed Nara Ratchsuwan
        </Text>
      </Footer>
    </Container>
  );
};

export default Index;
