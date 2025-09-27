import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando useNavigate para navegação
import './Home.css';  // Importando o arquivo CSS

const Home = () => {
  const navigate = useNavigate(); // Função para navegar entre as páginas
  const [nome, setNome] = useState(''); // Estado para armazenar o nome

  // Pergunta o nome ao usuário quando a página carregar
  useEffect(() => {
    const nomeSalvo = localStorage.getItem('userName'); // Verifica se já tem um nome salvo
    if (nomeSalvo) {
      setNome(nomeSalvo); // Se tiver, usa o nome salvo
    } else {
      const nomeUsuario = prompt("Qual é o seu nome?");
      if (nomeUsuario) {
        setNome(nomeUsuario);
        localStorage.setItem('userName', nomeUsuario); // Salva o nome no localStorage
      }
    }
  }, []);

  // Função para redirecionar para o site
  const redirecionarParaSite = () => {
    window.location.href = "https://www.depositoemerceariadalagoa.com.br/";
  };

  return (
    <div className="home-container">
      <h2>Olá, {nome}! Bem-vindo ao Gerenciamento de Produtos</h2> 

      {/* Botões para navegação */}
      <div className="button-container">
        <button className="nav-button" onClick={() => navigate('/lista')}>Todos os Produtos</button>
        <button className="nav-button" onClick={() => navigate('/adicionar')}>Adicionar Produto</button>
        <button className="nav-button" onClick={() => navigate('/deletar')}>Excluir Produto</button>
        <button className="nav-button" onClick={() => navigate('/atualizar')}>Atualizar Produto</button>
        <button className="nav-button" onClick={() => navigate('/imprimir')}>Imprimir</button>
      </div>

      {/* Botão para redirecionar para o site */}
      <div className="button-container">
        <button 
          className="nav-button"
          onClick={redirecionarParaSite} 
          style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#6b3624', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Ir para o site
        </button>
      </div>
    </div>
  );
}

export default Home;
