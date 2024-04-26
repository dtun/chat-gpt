import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  // DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { useWindowDimensions, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ChatPage from "./app/screens/ChatPage";
import SettingsPage from "./app/screens/SettingsPage";
import ImagesPage from "./app/screens/ImagesPage";
import WhisperPage from "./app/screens/WhisperPage";
import { RootSiblingParent } from "react-native-root-siblings";
import { STORAGE_API_KEY } from "./app/constants/constants";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const openAccount = () => {
    WebBrowser.openBrowserAsync("https://platform.openai.com/account/usage");
  };
  const openHelp = () => {
    WebBrowser.openBrowserAsync(
      "https://help.openai.com/en/collections/3742473-chatgpt"
    );
  };
  const signOut = async () => {
    await AsyncStorage.removeItem(STORAGE_API_KEY);
    props.navigation.navigate("Settings");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#18191a", padding: 6 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItem
          icon={() => <Ionicons name="add-outline" size={24} color="white" />}
          label="New chat"
          labelStyle={{ color: "#fff" }}
          style={{ borderRadius: 6, borderWidth: 1, borderColor: "#ffffff33" }}
          onPress={() => {
            props.navigation.navigate("Chat");
          }}
        />
        <DrawerItem
          icon={() => (
            <Ionicons name="camera-outline" size={24} color="white" />
          )}
          label="Generate image"
          labelStyle={{ color: "#fff" }}
          onPress={() => {
            props.navigation.navigate("Images");
          }}
        />
        <DrawerItem
          icon={() => <Ionicons name="mic-outline" size={24} color="white" />}
          label="Speech to text"
          labelStyle={{ color: "#fff" }}
          onPress={() => {
            props.navigation.navigate("Whisper");
          }}
        />
      </DrawerContentScrollView>
      <View
        style={{ height: 240, borderTopColor: "#ffffff33", borderTopWidth: 1 }}
      >
        <DrawerItem
          icon={() => (
            <Ionicons name="person-outline" size={24} color="white" />
          )}
          label="My account"
          labelStyle={{ color: "#fff" }}
          onPress={() => {
            openAccount();
          }}
        />
        <DrawerItem
          icon={() => <Ionicons name="share-outline" size={24} color="white" />}
          label="Get help"
          labelStyle={{ color: "#fff" }}
          onPress={() => {
            openHelp();
          }}
        />
        <DrawerItem
          icon={() => (
            <Ionicons name="settings-outline" size={24} color="white" />
          )}
          label="Settings"
          labelStyle={{ color: "#fff" }}
          onPress={() => {
            props.navigation.navigate("Settings");
          }}
        />
        <DrawerItem
          icon={() => (
            <Ionicons name="log-out-outline" size={24} color="white" />
          )}
          label="Log out"
          labelStyle={{ color: "#fff" }}
          onPress={() => {
            signOut();
          }}
        />
      </View>
    </View>
  );
}

type DrawrParamList = {
  Chat: undefined;
  Settings: undefined;
  Images: undefined;
  Whisper: undefined;
};

const Drawer = createDrawerNavigator<DrawrParamList>();

function DrawerNavigation() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      initialRouteName="Settings"
      screenOptions={{
        drawerType: isLargeScreen ? "permanent" : "front",
        headerTintColor: "#18191a",
      }}
    >
      <Drawer.Screen component={ChatPage} name="Chat" />
      <Drawer.Screen component={SettingsPage} name="Settings" />
      <Drawer.Screen component={ImagesPage} name="Images" />
      <Drawer.Screen component={WhisperPage} name="Whisper" />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <RootSiblingParent>
      <NavigationContainer>
        <DrawerNavigation />
      </NavigationContainer>
    </RootSiblingParent>
  );
}
