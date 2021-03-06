import {
  Link as ChakraLink,
  Text,
  Spinner,
  Box,
  Button,
  useToast,
  Flex,
  Image,
} from "@chakra-ui/react";

import { motion } from "framer-motion";

import { Container } from "../components/Container";

import { DarkModeSwitch } from "../components/DarkModeSwitch";

import { Footer } from "../components/Footer";
import firebase from "../firebase/initFirebase";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { useEffect, useState } from "react";

import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
const Index = () => {
  const router = useRouter();
  const toast = useToast();
  const MotionImg = motion(Image);
  const MotionFlex = motion(Flex);
  const db = firebase.firestore();
  const [user, loading, error] = useAuthState(firebase.auth());
  const [gotHint, setGotHint] = useState(false);
  const [playAniIn, setPlayAniIn] = useState(false);
  const [playAniOut, setPlayAniOut] = useState(false);
  const [userHint, setUserHint] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [canClick, setCanClick] = useState(false);
  const [timing, setTiming] = useState(false);
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
    if (user != undefined && !loading && !userListLoading) {
      if (!haveUser(user)) await addUser(user);
      else {
        userList.docs.forEach((doc) => {
          if (user != undefined && doc.id == user.uid) {
            if (doc.data().gotHint) {
              if (!timing) {
                setTiming(true);
                setTimeout(() => {
                  setPlayAniOut(true);
                  setTimeout(() => {
                    setPlayAniOut(false);
                    setPlayAniIn(false);

                    setGotHint(doc.data().gotHint);
                    setUserHint(doc.data().hint);
                  }, 1400);
                }, 1400);
              }
            } else {
              if (!canClick) setCanClick(true);
              setGotHint(doc.data().gotHint);
            }
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
    if (playAniOut) {
      console.log("hint 1");
      return (
        <Box position="absolute" zIndex="2" pb="90px">
          <MotionImg w="250px" src="./2/Out.GIF" />
        </Box>
      );
    } else if (playAniIn) {
      console.log("hint 2");
      return (
        <Box position="absolute" zIndex="2" pb="90px">
          <MotionImg w="250px" src="./2/In.gif" />
        </Box>
      );
    } else if (gotHint) {
      console.log("hint 3");

      return (
        <MotionFlex
          maxW="100%"
          position="absolute"
          zIndex="2"
          pb="130px"
          align="center"
          justify="center"
          flexDir="column"
          animate={{ y: "-10px" }}
          transition={{ yoyo: Infinity, duration: 2 }}
        >
          <Box position="absolute" zIndex="2" pb="100px">
            <Text
              color="black"
              fontSize="xl"
              fontFamily="mono"
              transform="rotate(-7deg)"
              bgColor="white"
              px="5px"
              rounded="md"
              opacity="0.7"
            >
              "{userHint}"
            </Text>
          </Box>
          <MotionImg w="250px" src="./3/Flower.PNG" />
        </MotionFlex>
      );
    } else
      return (
        <Box position="absolute" zIndex="2" pb="130px">
          <MotionImg
            cursor="pointer"
            w="250px"
            src="./1/Flower.PNG"
            animate={{ y: "-10px" }}
            transition={{ yoyo: Infinity, duration: 2 }}
            onClick={() => {
              if (!playAniIn) setPlayAniIn(true);
              if (canClick) {
                setCanClick(false);
                addQueue(user);
              }
            }}
          />
        </Box>
      );
  };

  const Name = () => {
    if (loading) {
      return <Spinner position="absolute" left="10px" top="10px" zIndex="10" />;
    }
    if (user == undefined) {
      return (
        <ChakraLink
          as={Link}
          href="/auth"
          position="absolute"
          zIndex="5"
          left="10px"
          top="10px"
        >
          <Button position="absolute" zIndex="5" left="10px" top="10px">
            Sign In
          </Button>
        </ChakraLink>
      );
    } else {
      return (
        <Flex
          flexDir="row"
          align="flex-start"
          justify="flex-end"
          position="absolute"
          zIndex="5"
          left="10px"
          top="10px"
          w="95%"
        >
          <Text
            colorScheme="whiteAlpha"
            fontSize="sm"
            fontFamily="mono"
            mr="5px"
            pt="3px"
          >
            {user.displayName}
          </Text>

          <Button size="xs" onClick={signOut}>
            Sign Out
          </Button>
        </Flex>
      );
    }
  };

  return (
    <Container height="100vh">
      <Head>
        <title>Sai Sam Parn 45614</title>
      </Head>
      <Flex
        w="100%"
        h="100%"
        bgImg="./BG.PNG"
        flexDir="column"
        align="center"
        justify="center"
        bgPos="center"
        bgSize="auto 100%"
      >
        {user == undefined ? (
          <ChakraLink
            as={Link}
            href="/auth"
            position="absolute"
            zIndex="5"
            left="10px"
            top="10px"
          >
            <Button position="absolute" zIndex="5" left="10px" top="10px">
              Sign In
            </Button>
          </ChakraLink>
        ) : (
          <>
            <Flex
              position="absolute"
              h="100vh"
              w="100vw"
              zIndex="5"
              align="flex-end"
              justify="center"
            >
              <MotionImg
                position="absolute"
                zIndex="3"
                w="250px"
                src="./Face.PNG"
              />
              <Hint />

              <MotionImg
                ml="75px"
                position="absolute"
                zIndex="1"
                w="250px"
                src={
                  playAniOut || playAniIn ? "./2/Shadow.PNG" : "./1/Shadow.PNG"
                }
              />
            </Flex>
            <Box h="30vh"></Box>
            <Name />

            <Box h="5vh"></Box>

            {/* <DarkModeSwitch /> */}
            <Box h="30vh"></Box>
          </>
        )}
        <Footer position="absolute" top="85vh" zIndex="10">
          <Text
            fontSize="xs"
            color="white"
            fontFamily="mono"
            textAlign="center"
            px="5vw"
          >
            Code with ???? by Thanasan Kumdee & Designed Nara Ratchsuwan
          </Text>
        </Footer>
      </Flex>
    </Container>
  );
};

export default Index;
