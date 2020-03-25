import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiPower, FiTrash2 } from "react-icons/fi";

import api from "../../services/api";
import logoImg from "../../assets/logo.svg";
import "./styles.css";

interface IncidentsInterface {
  id: number;
  title: string;
  description: string;
  value: number;
  formattedPrice: string;
}

const Profile: React.FC = () => {
  const history = useHistory();

  const [incidents, setIncidents] = useState<IncidentsInterface[]>([]);

  const ongId = localStorage.getItem("ongId");
  const ongName = localStorage.getItem("ongName");

  useEffect(() => {
    api
      .get<IncidentsInterface[]>("profile", {
        headers: {
          Authorization: ongId
        }
      })
      .then(response => {
        const data = response.data.map(incident => ({
          ...incident,
          formattedPrice: Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
          }).format(incident.value)
        }));
        setIncidents(data);
      });
  }, [ongId]);

  async function handleDeleteIncident(id: number) {
    try {
      await api.delete(`incidents/${id}`, {
        headers: {
          Authorization: ongId
        }
      });

      setIncidents(incidents.filter(incident => incident.id !== id));
    } catch (err) {
      alert("Erro ao deletar caso, tente novamente");
    }
  }

  function handleLogout() {
    localStorage.clear();

    history.push("/");
  }

  return (
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be the Hero" />
        <span>Bem vinda, {ongName}</span>

        <Link className="button" to="/incidents/new">
          Cadastrar novo caso
        </Link>
        <button type="button" onClick={handleLogout}>
          <FiPower size={18} color="#e02041" />
        </button>
      </header>

      <h1>Casos cadastrados</h1>

      <ul>
        {incidents.map(incident => (
          <li key={String(incident.id)}>
            <strong>CASO:</strong>
            <p>{incident.title}</p>

            <strong>DESCRIÇÃO:</strong>
            <p>{incident.description}</p>

            <strong>VALOR:</strong>
            <p>{incident.formattedPrice}</p>

            <button
              onClick={() => handleDeleteIncident(incident.id)}
              type="button"
            >
              <FiTrash2 size={20} color="#a8a8b3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
