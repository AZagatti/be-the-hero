import React, { useState, useEffect, useCallback } from "react";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { View, FlatList, Image, Text, TouchableOpacity } from "react-native";

import api from "../../services/api";
import logoImg from "../../assets/logo.png";

import styles from "./styles";

interface IncidentsInterface {
  id: number;
  name: string;
  title: string;
  value: number;
  formattedPrice: string;
}

const Incidents: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentsInterface[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [
    onEndReachedCalledDuringMomentum,
    setOnEndReachedCalledDuringMomentum
  ] = useState(true);

  const navigation = useNavigation();

  function navigateToDetail(incident: IncidentsInterface) {
    navigation.navigate("Detail", { incident });
  }

  const loadIncidents = useCallback(async () => {
    if (loading) {
      return;
    }

    if (total > 0 && incidents.length === total) {
      return;
    }

    setLoading(true);

    const response = await api.get<IncidentsInterface[]>("incidents", {
      params: {
        page
      }
    });

    const data = response.data.map((incident: IncidentsInterface) => ({
      ...incident,
      formattedPrice: Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(incident.value)
    }));

    setIncidents([...incidents, ...data]);
    setTotal(response.headers["x-total-count"]);
    setPage(page + 1);
    setLoading(false);
  }, [loading, page, total, incidents]);

  useEffect(() => {
    loadIncidents();
  }, []);

  function onEndReached() {
    if (!onEndReachedCalledDuringMomentum) {
      loadIncidents();
      setOnEndReachedCalledDuringMomentum(true);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} />
        <Text style={styles.headerText}>
          Total de <Text style={styles.headerTextBold}>{total} casos</Text>
        </Text>
      </View>

      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.description}>
        Escolha um dos casos abaixo e salve o dia.
      </Text>

      <FlatList
        style={styles.incidentList}
        data={incidents}
        showsVerticalScrollIndicator={false}
        bounces={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.2}
        onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
        keyExtractor={incident => String(incident.id)}
        renderItem={({ item: incident }) => (
          <View style={styles.incident}>
            <Text style={styles.incidentProperty}>ONG:</Text>
            <Text style={styles.incidentValue}>{incident.name}</Text>

            <Text style={styles.incidentProperty}>CASO:</Text>
            <Text style={styles.incidentValue}>{incident.title}</Text>

            <Text style={styles.incidentProperty}>VALOR:</Text>
            <Text style={styles.incidentValue}>{incident.formattedPrice}</Text>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigateToDetail(incident)}
            >
              <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
              <Feather name="arrow-right" size={16} color="#e02041" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default Incidents;
