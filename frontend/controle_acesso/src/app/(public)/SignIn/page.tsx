'use client';
import { useState } from "react";
import styles from "./page.module.css";

interface FormLogin {
    username: string,
    password: string
}

export default function SignIn() {

    const [formLogin, setFormLogin] = useState<FormLogin>({
        username: "",
        password: ""
    });

    /* Trata clique no botão Entrar: realiza o login */
    const handleLogin = () => {
        console.log('Dados de Login\nUsername: ' + formLogin.username + '\nPassword: ' + formLogin.password);
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
                    </div>
                </div>
            </div>
        </div>
    )
}