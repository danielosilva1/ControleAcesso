"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { axios } from "@/config/axios";
import { AxiosError } from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import {useRouter } from "next/navigation";

interface FormLogin {
    username: string,
    password: string
}

// Interface para resposta da requisição de login
interface Response {
    id: string,
    token: string
}

// Interface para erro: ajuda a recuperar mensagem retornada do back
interface Error {
    message: string
}

export default function SignIn() {
    
    const [formLogin, setFormLogin] = useState<FormLogin>({
        username: "",
        password: ""
    });

    const formLoginIsValid = () => {
        return (formLogin.username != '' && formLogin.password != '')
    }

    const router = useRouter();

    /* Trata clique no botão Entrar: realiza o login */
    const handleLogin = () => {
        if (!formLoginIsValid()) {
            Swal.fire({
                icon: 'warning',
                text: 'Username and password are required fields'
            });
            return;
        }

        axios.post<Response>('/login', { username: formLogin.username, password: formLogin.password }).
        then(response => {
            if (response.status == 200) {
                const token = response.data.token;

                // Login efetuado com sucesso: adiciona token retornado ao header do axios
                axios.defaults.headers['Authorization'] = `Bearer ${token}`;
                
                router.push('/home'); // Redireciona para tela inicial
            }
        }).catch((error: AxiosError<Error>) => {
            const message = error.response?.data?.message;
            axios.defaults.headers['Authorization'] = ''; // Remove token do header do axios
            Swal.fire({
                icon: 'error',
                text: message
            });
        });
    }

    /* Trata evento change nas caixas de entrada: ajusta dados do formLogin */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        setFormLogin((prevState) => ({
            ...prevState,
            [id]: value
        }));
    }

    /* Trata clique na tecla enter no botão de login: dispara evento de clique */
    const handleKeyPressBtn = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            // Chama o evento de clique do botão
            const { id } = e.target as HTMLDivElement;
            const component = document.getElementById(id);
            component?.click();
        }
    }

    /* Trata clique na tecla enter nas caixas de entrada */
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const { id } = e.target as HTMLInputElement;
        
        if (e.key === 'Enter') {
            // Clique na tecla Enter
            if (id == 'username') {
                // Foco vai para caixa de senha
                const component = document.getElementById('password');
                component?.focus();
            } else {
                // Executa evento de clique do botão de login
                const component = document.getElementById('login');
                component?.click();
            }
        }
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.loginContainer}>
                <h2 className={styles.pageTitle}>LOGIN</h2>
                <div className={styles.form}>
                    <div className={styles.entryDataContainer}>
                        <p className={styles.label}>Usuário</p>
                        <input
                            id='username'
                            className={styles.input}
                            type='text'
                            placeholder='Digite seu nome de usuário'
                            tabIndex={0}
                            onKeyUp={ handleKeyPress }
                            onChange={ handleInputChange }
                        ></input>
                    </div>

                    <div className={styles.entryDataContainer}>
                        <p className={styles.label}>Senha</p>
                        <input
                            id='password'
                            className={styles.input}
                            type='text'
                            placeholder='Digite sua senha'
                            tabIndex={0}
                            onKeyUp={ handleKeyPress }
                            onChange={ handleInputChange }
                        ></input>
                    </div>
                    <div className={styles.entryDataContainer}>
                        <div id='login'
                             className={styles.button}
                             tabIndex={0}
                             onKeyUp={ handleKeyPressBtn }
                             onClick={ handleLogin }
                            >
                            <p className={styles.buttonLbl}>Entrar</p>
                        </div>
                        <Link href='/home'><p className={styles.signUpLbl}>Não possui uma conta? Cadastre-se</p></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}