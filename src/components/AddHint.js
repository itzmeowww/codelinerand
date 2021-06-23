import {
  FormControl,
  FormLabel,
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
  useToast,
} from "@chakra-ui/react";

import firebase from "../firebase/initFirebase";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useState } from "react";
const AddHint = () => {
  const toast = useToast();

  const color = useColorModeValue("gray.800", "white");
  const lightColor = useColorModeValue("gray.600", "gray.300");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formName, setFormName] = useState("");
  const [formHint, setFormHint] = useState("");

  const db = firebase.firestore();
  const [user, loading, error] = useAuthState(firebase.auth());
  const [hint, hintLoading, hintError] = useCollection(
    firebase.firestore().collection("hint"),
    {}
  );

  const handleNameChange = (e) => {
    setFormName(e.target.value);
  };
  const handleHintChange = (e) => {
    setFormHint(e.target.value);
  };

  const addHint = async () => {
    if (formName == "" || formHint == "") {
      toast({
        title: "ERROR!",
        description: "Name or Hint cannot be empty",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      await db.collection("hint").add({ name: formName, hint: formHint });
      setFormHint("");
      setFormName("");
      onClose();
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Add Hint</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color={color}>Add hint</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="name-hint">
              <FormLabel color={color}>Name</FormLabel>
              <Input
                color={lightColor}
                onChange={handleNameChange}
                type="name"
                value={formName}
              />
              <FormLabel color={color}>Hint</FormLabel>
              <Input
                color={lightColor}
                onChange={handleHintChange}
                type="hint"
                value={formHint}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={addHint} type="submit">
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddHint;
