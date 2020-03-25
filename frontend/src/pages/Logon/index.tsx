import React, { useState, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";

import api from "../../services/api";
import heroesImg from "../../assets/heroes.png";
import logoImg from "../../assets/logo.svg";
import "./styles.css";

interface IResponse {
  name: string;
}

const Logon: React.FC = () => {
  const history = useHistory();

  const [id, setId] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await api.post<IResponse>("sessions", { id });

      localStorage.setItem("ongId", id);
      localStorage.setItem("ongName", response.data.name);

      history.push("profile");
    } catch (err) {
      alert("Falha no login, tente novamente");
    }
  }

  return (
    <div className="logon-container">
      <section className="form">
        <img src={logoImg} alt="Be The Hero" />

        <form onSubmit={handleLogin}>
          <h1>Faça seu logon</h1>

          <input
            value={id}
            onChange={e => setId(e.target.value)}
            placeholder="Sua ID"
          />
          <button className="button" type="submit">
            Entrar
          </button>

          <Link className="backlink" to="/register">
            <FiLogIn size={16} color="#E02041" />
            Não tenho cadastro
          </Link>
        </form>
      </section>

      <img src={heroesImg} alt="Heroes" />
    </div>
  );
};

export default Logon;
