import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "../firebase/initFirebase";
import { Flex } from "@chakra-ui/react";
import { Container } from "../components/Container";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
const uiConfig = {
  signInSuccessUrl: "/",
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};

const Auth = () => {
  return (
    <Container>
      <Flex h="100vh" align="center" justify="center" w="100vw">
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        ></StyledFirebaseAuth>
      </Flex>
    </Container>
  );
};

export default Auth;
