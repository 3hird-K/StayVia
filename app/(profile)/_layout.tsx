import { Tabs } from "expo-router";

export default function TabsLayout(){
    return (
      <Tabs screenOptions={{headerShown: false}}>
        <Tabs.Screen
        name="editProfile"
        options={{
          title: "Update Profile",
          tabBarStyle: {display: "none"}
        }}
      />
        <Tabs.Screen
        name="settings"
        options={{
          title: "Account Settings",
          tabBarStyle: {display: "none"}
        }}
      />
        <Tabs.Screen
        name="request"
        options={{
          title: "Requests",
          tabBarStyle: {display: "none"}
        }}
      />
        <Tabs.Screen
        name="favorite"
        options={{
          title: "Favorites",
          tabBarStyle: {display: "none"}
        }}
      />
    </Tabs>
    )
}