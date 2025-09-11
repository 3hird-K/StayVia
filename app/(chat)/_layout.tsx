import { Tabs } from "expo-router";

export default function TabsLayout(){
    return (
      <Tabs screenOptions={{headerShown: false}}>
        <Tabs.Screen
        name="[id]"
        options={{
          title: "chats",
          tabBarStyle: {display: "none"}
        }}
      />
        
    </Tabs>
    )
}