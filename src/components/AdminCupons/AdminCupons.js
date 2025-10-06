import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './AdminCupons.css';

const AdminCupons = () => {
    const [cupons, setCupons] = useState([]);
    // CORREÇÃO: O estado agora corresponde às suas colunas `nome` e `valor`
    const [newCoupon, setNewCoupon] = useState({ nome: '', valor: '' });
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState({ message: '', type: '' });
    const navigate = useNavigate();

    const fetchCupons = async () => {
        // CORREÇÃO: Busca na sua tabela `cupom`
        const { data, error } = await supabase.from('cupom').select('*').order('nome', { ascending: true });
        if (error) {
            setFeedback({ message: `Erro ao carregar cupões: ${error.message}`, type: 'error' });
        } else {
            setCupons(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCupons();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        // CORREÇÃO: Transforma o `nome` do cupão para maiúsculas
        const finalValue = name === 'nome' ? value.toUpperCase().replace(/\s/g, '') : value;
        setNewCoupon(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        // CORREÇÃO: Validação usa `nome` e `valor`
        if (!newCoupon.nome || !newCoupon.valor) {
            setFeedback({ message: 'Por favor, preencha o código e o valor do desconto.', type: 'error' });
            return;
        }

        // CORREÇÃO: Insere na tabela `cupom` com as colunas `nome` e `valor`
        const { error } = await supabase.from('cupom').insert([
            { nome: newCoupon.nome, valor: parseInt(newCoupon.valor, 10) }
        ]);

        if (error) {
            setFeedback({ message: `Erro ao criar cupão: ${error.message}`, type: 'error' });
        } else {
            setFeedback({ message: 'Cupão criado com sucesso!', type: 'success' });
            setNewCoupon({ nome: '', valor: '' }); // Limpa o formulário
            fetchCupons(); // Atualiza a lista
        }
    };

    const handleDeleteCoupon = async (nomeCupom) => {
        if (window.confirm(`Tem a certeza que deseja apagar o cupão "${nomeCupom}"?`)) {
            // CORREÇÃO: Apaga da tabela `cupom` usando a coluna `nome`
            const { error } = await supabase.from('cupom').delete().eq('nome', nomeCupom);
            if (error) {
                setFeedback({ message: `Erro ao apagar cupão: ${error.message}`, type: 'error' });
            } else {
                setFeedback({ message: 'Cupão apagado com sucesso!', type: 'success' });
                fetchCupons();
            }
        }
    };

    return (
        <div className="admin-page-container">
            <header className="admin-header">
                <h1>Gerir Cupões de Desconto</h1>
                <button onClick={() => navigate('/')}>Voltar ao Painel</button>
            </header>

            {feedback.message && (
                <p className={`feedback-message ${feedback.type}`}>{feedback.message}</p>
            )}

            <div className="admin-content-layout">
                {/* Formulário para criar novo cupão */}
                <div className="form-section">
                    <h3>Criar Novo Cupão</h3>
                    {/* CORREÇÃO: O formulário agora usa os names 'nome' e 'valor' */}
                    <form onSubmit={handleCreateCoupon} className="coupon-form">
                        <input 
                            type="text"
                            name="nome"
                            placeholder="Código (ex: BEMVINDO10)"
                            value={newCoupon.nome}
                            onChange={handleInputChange}
                        />
                        <input 
                            type="number"
                            name="valor"
                            placeholder="Desconto (ex: 10 para 10%)"
                            value={newCoupon.valor}
                            onChange={handleInputChange}
                        />
                        <button type="submit">Criar Cupão</button>
                    </form>
                </div>

                {/* Lista de cupões existentes */}
                <div className="list-section">
                    <h3>Cupões Existentes</h3>
                    {loading ? <p>A carregar...</p> : (
                        <ul className="coupons-list">
                            {/* CORREÇÃO: O map agora usa `nome` e `valor` */}
                            {cupons.map(coupon => (
                                <li key={coupon.nome}>
                                    <div className="coupon-info">
                                        <span className="coupon-code">{coupon.nome}</span>
                                        <span className="coupon-value">{coupon.valor}% OFF</span>
                                    </div>
                                    <button onClick={() => handleDeleteCoupon(coupon.nome)} className="delete-btn">
                                        Apagar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCupons;

