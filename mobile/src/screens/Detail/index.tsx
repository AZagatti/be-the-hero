import React from "react";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView
} from "react-native";
import * as MailComposer from "expo-mail-composer";

import logoImg from "../../assets/logo.png";
import styles from "./styles";

type StackParamList = {
  Incident: {
    incident: {
      id: number;
      name: string;
      title: string;
      email: string;
      value: number;
      formattedPrice: string;
      city: string;
      uf: string;
      whatsapp: string;
    };
  };
};

type DetailRouteProp = RouteProp<StackParamList, "Incident">;

const Detail: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<DetailRouteProp>();

  const incident = route.params.incident;

  const message = `Olá ${incident.name}, estou entrando em contato pois gostaria de ajudar no caso "${incident.title}" com o valor de ${incident.formattedPrice}`;

  function navigateBack() {
    navigation.goBack();
  }

  function sendMail() {
    MailComposer.composeAsync({
      subject: `Herói do caso: ${incident.title}`,
      recipients: [incident.email],
      body: message
    });
  }

  function sendWhatsapp() {
    Linking.openURL(
      `whatsapp://send?phone=${incident.whatsapp}&text=${message}`
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} />

        <TouchableOpacity onPress={navigateBack}>
          <Feather name="arrow-left" size={28} color="#e02041" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.incident}>
          <Text style={[styles.incidentProperty, { marginTop: 0 }]}>ONG:</Text>
          <Text style={styles.incidentValue}>
            {incident.name} de {incident.city}/{incident.uf}
          </Text>

          <Text style={styles.incidentProperty}>CASO:</Text>
          <Text style={styles.incidentValue}>{incident.title}</Text>

          <Text style={styles.incidentProperty}>VALOR:</Text>
          <Text style={styles.incidentValue}>{incident.formattedPrice}</Text>
        </View>

        <View style={styles.contactBox}>
          <Text style={styles.heroTitle}>Salve o dia!</Text>
          <Text style={styles.heroTitle}>Seja o herói desse caso.</Text>

          <Text style={styles.heroDescription}>Entre em contato:</Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.action} onPress={sendWhatsapp}>
              <Text style={styles.actionText}>WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.action} onPress={sendMail}>
              <Text style={styles.actionText}>E-mail</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Detail;
