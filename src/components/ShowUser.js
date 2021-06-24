import { Text, Flex, Box, Checkbox, useToast } from "@chakra-ui/react";

import firebase from "../firebase/initFirebase";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useState, useEffect } from "react";

const ShowHint = () => {
  const db = firebase.firestore();

  const [userData, userDataLoading, useDataError] = useCollection(
    db.collection("user"),
    {}
  );
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (!userDataLoading) {
      const newUserList = [];
      userData.docs.forEach((doc) => {
        newUserList.push({
          name: doc.data().name,
          hint: doc.data().hint,
          answer: doc.data().answer,
          gotHint: doc.data().gotHint,
        });
      });
      setUserList(newUserList);
    }
  }, [userData, userDataLoading]);

  return (
    <Flex
      w="600px"
      maxW="80vw"
      flexDir="column"
      align="center"
      justify="center"
    >
      <Box h="10vh"></Box>
      <Text fontFamily="mono" fontSize="3xl">
        Users
      </Text>
      <Flex
        flexDir="row"
        rounded="md"
        m="5px"
        p="10px"
        fontFamily="mono"
        w="100%"
        align="center"
        justify="flex-start"
      >
        <Text w="40%" fontSize="md" textOverflow="ellipsis">
          Name
        </Text>
        <Text w="20%" pl="5px">
          Hint
        </Text>

        <Text w="40%" pl="5px">
          Senior Name
        </Text>
      </Flex>
      {userList.map((u) => {
        return (
          <Flex
            flexDir="row"
            rounded="md"
            bg={u.gotHint ? "green.100" : "gray.200"}
            m="5px"
            p="10px"
            color="black"
            fontFamily="mono"
            fontSize={["xs", "md"]}
            w="100%"
            align="center"
            justify="flex-start"
          >
            <Text w="40%" textOverflow="ellipsis">
              {u.name}
            </Text>
            <Text w="20%" pl="5px">
              {u.hint}
            </Text>

            <Text w="40%" pl="5px">
              {u.answer}
            </Text>
          </Flex>
        );
      })}
    </Flex>
  );
};
export default ShowHint;
