import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <Drawer>
      <Drawer.Screen
        name="boop" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Booper",
          title: "Random",
        }}
      />

      <Drawer.Screen
        name="chat" // This is the name of the page and must match the url from root
        options={{
          drawerLabel: "Chat",
          title: "Chat",
        }}
      />
    </Drawer>
  );
}
