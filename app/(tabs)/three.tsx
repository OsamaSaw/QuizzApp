import { Image, StyleSheet, Dimensions } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { DeterminateProgressBar } from "@/components/DeterminateProgressBar";
import { useNavigationState } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

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
          <View style={styles.infoContainer}>
            <View style={styles.shareButton}>
              <Text style={{ fontSize: 12 }}>YKNKH</Text>
              <Feather name="share" color="#777076" size={15} />
            </View>
            <FontAwesome5 name="venus" size={SCREEN_HEIGHT * 0.016} color="#FF69B4" style={styles.infoIcon} />
            <Text style={styles.infoText}>🇵🇸</Text>
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

      {/* New Statistics Section */}
      <View style={styles.statsContainer}>
        {/* Quick Stats Row */}
        <View style={styles.quickStats}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>247</Text>
            <Text style={styles.statLabel}>Questions</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>89%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>1,280</Text>
            <Text style={styles.statLabel}>Total Score</Text>
          </View>
        </View>

        {/* Detailed Stats */}
        <View style={styles.detailedStats}>
          <Text style={styles.sectionTitle}>Performance Details</Text>
          
          <View style={styles.statRow}>
            <View style={styles.statLabel}>
              <FontAwesome5 name="check-circle" size={SCREEN_HEIGHT * 0.024} color="#4CAF50" />
              <Text style={styles.statText}>Correct Answers</Text>
            </View>
            <Text style={styles.statValue}>220</Text>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statLabel}>
              <FontAwesome5 name="times-circle" size={SCREEN_HEIGHT * 0.024} color="#FF5252" />
              <Text style={styles.statText}>Wrong Answers</Text>
            </View>
            <Text style={styles.statValue}>27</Text>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statLabel}>
              <FontAwesome5 name="bolt" size={SCREEN_HEIGHT * 0.024} color="#FFD700" />
              <Text style={styles.statText}>Best Streak</Text>
            </View>
            <Text style={styles.statValue}>15</Text>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statLabel}>
              <FontAwesome5 name="clock" size={SCREEN_HEIGHT * 0.024} color="#2196F3" />
              <Text style={styles.statText}>Avg. Response Time</Text>
            </View>
            <Text style={styles.statValue}>8.5s</Text>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statLabel}>
              <FontAwesome5 name="calendar-check" size={SCREEN_HEIGHT * 0.024} color="#9C27B0" />
              <Text style={styles.statText}>Quiz Completed</Text>
            </View>
            <Text style={styles.statValue}>42</Text>
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
    paddingHorizontal: SCREEN_WIDTH * 0.03,
  },
  shareButton: {
    width: SCREEN_WIDTH * 0.2,
    backgroundColor: "#E0DBE0",
    borderRadius: 7,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: SCREEN_WIDTH * 0.015,
    paddingVertical: SCREEN_HEIGHT * 0.004,
    marginRight: SCREEN_WIDTH * 0.025,
  },
  details: {
    marginTop: SCREEN_HEIGHT * 0.035,
    width: "100%",
    paddingHorizontal: SCREEN_WIDTH * 0.015,
  },
  name: {
    fontFamily: "notoserif",
    fontWeight: "bold",
    fontSize: SCREEN_HEIGHT * 0.035,
  },
  level: {
    fontFamily: "notoserif",
    fontWeight: "bold",
    fontSize: SCREEN_HEIGHT * 0.018,
  },
  multi: {
    backgroundColor: "#E0DBE0",
    paddingHorizontal: SCREEN_WIDTH * 0.02,
    borderRadius: 10,
    marginLeft: SCREEN_WIDTH * 0.01,
  },
  progress: {
    flexDirection: "row",
    alignContent: "center",
    width: "70%",
  },
  statsContainer: {
    width: "100%",
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    marginTop: SCREEN_HEIGHT * 0.025,
  },
  quickStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  statBox: {
    alignItems: "center",
    flex: 1,
    borderRadius: 10,
    padding: SCREEN_HEIGHT * 0.015,
    marginHorizontal: SCREEN_WIDTH * 0.01,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.2)",
  },
  statNumber: {
    fontSize: SCREEN_HEIGHT * 0.028,
    fontWeight: "bold",
    marginBottom: SCREEN_HEIGHT * 0.006,
    color: "#6212B1",
  },
  statLabel: {
    fontSize: SCREEN_HEIGHT * 0.014,
    opacity: 0.8,
  },
  detailedStats: {
    borderRadius: 15,
    padding: SCREEN_HEIGHT * 0.02,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.2)",
  },
  sectionTitle: {
    fontSize: SCREEN_HEIGHT * 0.022,
    fontWeight: "bold",
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SCREEN_HEIGHT * 0.012,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150,150,150,0.1)",
  },
  statLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    marginLeft: SCREEN_WIDTH * 0.025,
    fontSize: SCREEN_HEIGHT * 0.018,
  },
  statValue: {
    fontSize: SCREEN_HEIGHT * 0.018,
    fontWeight: "600",
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SCREEN_HEIGHT * 0.006,
  },
  infoIcon: {
    marginRight: SCREEN_WIDTH * 0.015,
  },
  infoText: {
    fontSize: SCREEN_HEIGHT * 0.016,
  },
});
