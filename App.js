import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Alert, ActivityIndicator,Dimensions,Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AuthContext } from './src/components/context'
// import { RootStackScreen } from './src/screens/RootStackNavigator'
import firebase from 'firebase';
import { createStackNavigator } from '@react-navigation/stack';
import CustomDrawerContent from './src/screens/DrawerContent';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import NewRegScreen from './src/screens/NewRegScreen';
import ViewVisitorsScreen from './src/screens/ViewVisitorsScreen';
import { Feather } from '@expo/vector-icons';

const Drawer = createDrawerNavigator();
const HomeStack = createStackNavigator();

const HomeStackScreen = ({ navigation }) => (
  <HomeStack.Navigator screenOptions={{
    headerStyle: {
      backgroundColor: "rgb(255,255,255)",
    },
    headerTintColor: "#000",
    headerTitleStyle: {
      fontWeight: 'bold'
    }
  }}>
    {/* <HomeStack.Screen name="Home" component={listscreen} /> */}
    {/* name and component are required props for HomeStack screen */}
    {/* <HomeStack.Screen name="Splash" component={SplashScreen} /> */}
    <HomeStack.Screen name="Home" component={HomeScreen} options={{
      title: "Home",
      headerLeft: () => (
        <Feather name="menu" size={40} color="#000" style={styles.drawericon} onPress={() => navigation.openDrawer()} />
      )
    }} />
    <HomeStack.Screen name="NewReg" component={NewRegScreen} options={{
      title: "NewReg",
      headerLeft: () => (
        <Feather name="menu" size={40} color="#000" style={styles.drawericon} onPress={() => navigation.openDrawer()} />
      )
    }} />
    <HomeStack.Screen name="ViewVisit" component={ViewVisitorsScreen} options={{
      title: "Visitors",
      headerLeft: () => (
        <Feather name="menu" size={40} color="#000" style={styles.drawericon} onPress={() => navigation.openDrawer()} />
      )
    }} />
    {/* <HomeStack.Screen name="signup" component={SignUpScreen} /> */}
  </HomeStack.Navigator>
);

export default function App() {

  // Firebase initializing
  var firebaseConfig = {
    apiKey: "AIzaSyDSwHEhmaOJeTnk9K7NfrBZO0f2H-1qtGg",
    authDomain: "viser-f4901.firebaseapp.com",
    projectId: "viser-f4901",
    storageBucket: "viser-f4901.appspot.com",
    messagingSenderId: "926939680084",
    appId: "1:926939680084:web:c32ddd18345bc165998cc1"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }


  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN': //This is for when user opens our app for first time
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);


  // Memorizing technique for speeding up the process
  const authContext = React.useMemo(() => ({
    signInWithOtp: async (phonenumber, userid) => {
      dispatch({ type: 'LOGIN', id: phonenumber, token: userid });
      // console.log(userid);
    },
    signIn: async (userName, password) => {
      // setUserToken('dhvfj');
      // setIsLoading(false);
      let userToken;
      userToken = null;
      firebase.auth().signInWithEmailAndPassword(userName, password)
        .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          // console.log("User is signed in");
          // ...
          userToken = user.uid;
          // await AsyncStorage.setItem('userToken', userToken);
          // console.log("User is signed in, token generated, below is the token");
          // console.log(userToken);
          dispatch({ type: 'LOGIN', id: userName, token: userToken });
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          // console.log(errorMessage);
          Alert.alert("Error!", errorMessage);
        });
      // console.log("Outside firebase auth, Below is the userToken");
      // console.log(userToken);
    },
    signOut: async () => {
      // setUserToken(null);
      // setIsLoading(false);
      // console.log('userToken:');
      firebase.auth().signOut().then(() => {
        // Sign-out successful.
        console.log("Sign out successful");
        dispatch({ type: 'LOGOUT' });
      }).catch((error) => {
        // An error happened.
        console.log(error);
      });
      // try {
      //   await AsyncStorage.removeItem('userToken');
      // } catch (e) {
      //   console.log(e);
      // }
    },
    signUp: async (username, password) => {
      let userToken;
      userToken = null;
      // ---------->creating user using firebase
      firebase.auth().createUserWithEmailAndPassword(username, password)
        .then((userCredential) => {
          var user = userCredential.user;
          userToken = user.uid;
          dispatch({ type: 'REGISTER', id: username, token: userToken });
          // console.log("Created new user, below is the user Token");
          // console.log(userToken)
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          // console.log(errorMessage);
          Alert.alert("Error!", errorMessage);
          // ..
        });
      // created user using firebase <------------


      // if (username == 'user@gmail.com' && password == 'pass') {
      //   try {
      //     userToken = 'asdad';
      //     await AsyncStorage.setItem('userToken', userToken);
      //   } catch (e) {
      //     console.log(e);
      //   }
      // }
      // setUserToken('dhvfj');
      // setIsLoading(false);
    },
  }), []);

  React.useEffect(() => {
    setTimeout(async () => {
      let userToken;
      userToken = null;
      // try {
      //   userToken = await AsyncStorage.getItem('userToken');
      // } catch (e) {
      //   console.log(e);
      // }
      // setIsLoading(false);
      // console.log("Checking value of isUserLoggedIn function");
      // console.log(isUserLoggedIn());

      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          // User is signed in.
          dispatch({ type: 'RETRIEVE_TOKEN', token: user.uid })
        } else {
          // No user is signed in.
          dispatch({ type: 'RETRIEVE_TOKEN', token: null })
          // console.log("first time checkin,not signed in , below is the user Token");
          // console.log(loginState.userToken);
        }
      });

      // if (isUserLoggedIn()) {
      //   dispatch({ type: 'RETRIEVE_TOKEN', token: 'kasjd' })
      //   console.log("first time checkin,signed in, below is the user Token");
      //   console.log(loginState.userToken);
      // }
      // else{
      //   dispatch({ type: 'RETRIEVE_TOKEN', token: null })
      //   console.log("first time checkin,not signed in , below is the user Token");
      //   console.log(loginState.userToken);
      // }
    }, 1000);
  }, []);

  // Loading circle #1464F4,009387(green)
  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Image
          animation="bounceIn"
          duraton="3500"
          source={require('./assets/hal_load.gif')}
          style={styles.logo}
          resizeMode="cover"
        />
        {/* <ActivityIndicator size="large" color="#0000ff" /> */}
      </View>
    );
  }
  const RootStack = createStackNavigator();
  return (

    <AuthContext.Provider value={authContext}>

      <NavigationContainer>
        {loginState.userToken !== null ? (

          <Drawer.Navigator
            // initialRouteName="Home" 
            drawerContent={props => <CustomDrawerContent {...props} />}
          >
            <Drawer.Screen name="Home" component={HomeStackScreen} />
          </Drawer.Navigator>

        ) : (
          <RootStack.Navigator headerMode="none" initialRouteName="login">
            <RootStack.Screen name="login" component={LoginScreen} />
            <RootStack.Screen name="signup" component={SignUpScreen} />
          </RootStack.Navigator>
        )
        }

      </NavigationContainer>
    </AuthContext.Provider>

  );
}

const { height } = Dimensions.get("screen");
const height_logo = height * 0.55;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawericon: {
    marginLeft: 15,
  },
  logo: {
    width: height_logo,
    height: height_logo
    // height_logo is defined just above styles.
  },
});
