import { Image, StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Feather } from "@expo/vector-icons";
import { DeterminateProgressBar } from "@/components/DeterminateProgressBar";
import { useNavigationState } from "@react-navigation/native";

export default function Profile() {
  const currentRoute = useNavigationState((state) => state.routes[state.index]);
  const currentTitle = currentRoute?.name;

  return (
    <View style={styles.container}>
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
      <View style={styles.profileStructure}>
        <View style={{ width: 120 }}>
          <Image
            style={{ width: 120, height: 150 }}
            resizeMode="contain"
            source={require("./../../assets/images/imagePlaceholder.png")}
          />
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>Marilyn</Text>
          <View style={styles.shareButton}>
            <Text style={{ fontSize: 12 }}>YKNKH</Text>
            <Feather name="share" color="#777076" size={15} />
          </View>
          <View>
            <Text style={styles.level}>{"Level " + "3"}</Text>
            <View style={styles.progress}>
              <DeterminateProgressBar
                progress={0.4}
                color="#6212B1"
                retrigger={currentTitle == "three"}
                style={{ width: "80%" }}
              />
              <View style={styles.multi}>
                <Text style={{ fontWeight: "600" }}>x6</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      {/*<EditScreenInfo path="app/(tabs)/three.tsx" />*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  profileStructure: {
    width: "100%",
    flexDirection: "row",
    alignContent: "center",
  },
  shareButton: {
    width: 80,
    backgroundColor: "#E0DBE0",
    borderRadius: 7,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginVertical: 5,
  },
  details: {
    marginTop: 30,
    width: "100%",
    paddingHorizontal: 5,
  },
  name: {
    fontFamily: "notoserif",
    fontWeight: "bold",
    fontSize: 30,
  },
  level: {
    fontFamily: "notoserif",
    fontWeight: "bold",
    fontSize: 15,
  },
  multi: {
    backgroundColor: "#E0DBE0",
    paddingHorizontal: 9,
    borderRadius: 10,
    marginLeft: 5,
  },
  progress: {
    flexDirection: "row",
    alignContent: "center",
    width: "70%",
  },
});
