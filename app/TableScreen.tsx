import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
  } from "react-native";
  
  export default function TableScreen() {
    return (
      <View style={{ flex: 1, backgroundColor: "#121212", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#E0E0E0", fontSize: 20 }}>BIENVENIDO A LA SECCION DE TABLAS</Text>
      </View>
    );
  }