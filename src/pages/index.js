import {
  Link as ChakraLink,
  Text,
  Spinner,
  Box,
  Button,
} from "@chakra-ui/react";

import { Container } from "../components/Container";

import { DarkModeSwitch } from "../components/DarkModeSwitch";

import { Footer } from "../components/Footer";
import firebase from "../firebase/initFirebase";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";
const Index = () => {
  const db = firebase.firestore();
  const [user, loading, error] = useAuthState(firebase.auth());
  const [gotHint, setGotHint] = useState(false);
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
        if (doc.id === user.uid) {
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
    let queueTime = firebase.firestore.FieldValue.serverTimestamp();
    let isIn = isInQueue(user);
    console.log(isIn);
    if (!isIn) {
      await db.collection("queue").add({ uid: user.uid, timestamp: queueTime });
    }
  };

  const removeQueue = async (user) => {
    queue.docs.forEach(async (doc) => {
      if (doc.data().uid === user.uid)
        await db.collection("queue").doc(doc.id).delete();
    });
  };

  useEffect(async () => {
    if (!queueLoading && !loading && !hintListLoading)
      if (queue.empty) {
        console.log("queue is empty");
      } else {
        if (queue.docs[0].data().uid == user.uid) {
          console.log("getting hints");
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
          if (doc.id == user.uid) {
            setGotHint(doc.data().gotHint);
          }
        });
      }
    }
  }, [userList, userListLoading, loading]);

  return (
    <Container height="100vh">
      <Box h="20vh"></Box>
      <Text colorScheme="whiteAlpha" fontSize="3xl" fontFamily="mono">
        {loading ? <Spinner /> : "Hi! " + user.displayName}
      </Text>
      <Box h="5vh"></Box>
      {gotHint ? (
        <Text colorScheme="yellow" fontSize="xl" fontFamily="mono">
          "This is your hint"
        </Text>
      ) : (
        <Button onClick={() => addQueue(user)}>GET A HINT</Button>
      )}

      <DarkModeSwitch />

      <Footer></Footer>
    </Container>
  );
};

export default Index;
