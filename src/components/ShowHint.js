import { Text, Flex, Box, CloseButton } from "@chakra-ui/react";

import firebase from "../firebase/initFirebase";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useState, useEffect } from "react";

const ShowHint = () => {
  const db = firebase.firestore();
  const [user, loading, error] = useAuthState(firebase.auth());
  const [hint, hintLoading, hintError] = useCollection(
    db.collection("hint"),
    {}
  );
  const [hintList, setHintList] = useState([]);

  const removeHint = async (id) => {
    await db.collection("hint").doc(id).delete();
  };
  useEffect(() => {
    if (!hintLoading) {
      const newHintList = [];
      hint.docs.forEach((doc) => {
        newHintList.push({
          name: doc.data().name,
          hint: doc.data().hint,
          id: doc.id,
        });
      });
      setHintList(newHintList);
    }
  }, [hint, hintLoading]);

  return (
    <Flex
      w="300px"
      maxW="80vw"
      flexDir="column"
      align="center"
      justify="center"
    >
      <Box h="10vh"></Box>
      <Text fontFamily="mono" fontSize="3xl">
        Hints
      </Text>
      {hintList.map((h) => {
        return (
          <Flex
            flexDir="row"
            rounded="md"
            bg="green.100"
            m="5px"
            p="5px"
            color="black"
            fontFamily="mono"
            w="100%"
            align="center"
            justify="center"
          >
            <Text w="40%" pl="5px">
              {h.name}
            </Text>
            <Text w="40%" pl="5px">
              {h.hint}
            </Text>
            <CloseButton
              onClick={() => {
                removeHint(h.id);
              }}
            />
          </Flex>
        );
      })}
    </Flex>
  );
};
export default ShowHint;
