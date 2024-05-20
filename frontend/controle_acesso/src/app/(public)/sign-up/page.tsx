"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Swal from "sweetalert2";
import { axios } from "@/config/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

interface FormUser {
    username: string,
    email: string,
    fullname: string,
    password: string,
    passwordConfirm: string
}

// Interface para erro: ajuda a recuperar mensagem retornada do back
interface Error {
    message: string
}

export default function updateProfile() {
    const [newUser, setNewUser] = useState<FormUser>({
        username: '',
        email: '',
        fullname: '',
        password: '',
        passwordConfirm: ''
    });
    const [passAreEquals, setPassAreEquals] = useState<boolean>(true);
    const router = useRouter();

    const formLoggedUserIsValid = () => {
        return (newUser.username != ''
                && newUser.email != ''
                && newUser.fullname != ''
                && newUser.password != ''
                && newUser.passwordConfirm != ''
                );
    }

    const handleSignUp = () => {
        if (formLoggedUserIsValid()) {
            axios.post('/sign-up',
            { username: newUser.username,
              email: newUser.email,
              fullname: newUser.fullname,
              password: newUser.password
            }
            ).then(response => {
                if (response.status == 201) {
                    Swal.fire({
                        icon: 'info',
                        text: 'User registered successfully'
                    }).then(value => {
                        if (value) {
                            // Redireciona para tela de login
                            router.push('/sign-in');
                        }
                    });
                }
            }).catch((error: AxiosError<Error>) => {
                const message = error.response?.data?.message;
                Swal.fire({
                    icon: 'error',
                    text: message
                });
            });
        } else {
            Swal.fire({
                icon: 'warning',
                text: 'All the fields marked with "*" are required'
            });
        }
    }

    /* Trata evento change nas caixas de entrada: ajusta dados do formLogin */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        setNewUser(prevState => ({
            ...prevState,
            [id]: value,
        }));

        // Valida a senha, caso id seja password ou passwordConfirm
        if (id == 'password' || id == 'passwordConfirm') { // Password e passwordCofirm devem ser iguais
            let passComponent = document.getElementById(id) as HTMLInputElement;
            let passConfirmComponent = document.getElementById('passwordConfirm') as HTMLInputElement;

            if (id == 'passwordConfirm') {
                passComponent = document.getElementById('password') as HTMLInputElement;
                passConfirmComponent = document.getElementById(id) as HTMLInputElement;
            }

            if (passComponent.value != passConfirmComponent.value) {
                setPassAreEquals(false);
            } else {
                setPassAreEquals(true);
            }
        }
    }

    /* Trata evento de clique no Enter no botão de salvar alterações */
    const handleKeyPressBtn = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            // Chama o evento de clique do botão
            const { id } = e.target as HTMLDivElement;
            const component = document.getElementById(id);
            component?.click();
        }
    }

    /* Trata evento de clique no Enter nas caixas de texto: manda foco para próxima caixa */
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const { id } = e.target as HTMLInputElement;
        let component = null;

        if (e.key === 'Enter') {
            // Tecla enter foi clicada: coloca foco na próxima caixa de texto
            if (id == 'username') {
                // Foco vai para caixa de email
                component = document.getElementById('email');
            } else if (id == 'email') {
                // Foco vai para caixa de nome completo
                component = document.getElementById('fullname');
            } else if (id == 'fullname') {
                // Foco vai para checkbox de senha
                component = document.getElementById('password');
            } else if (id == 'password') {
                // Foco vai para caixa de confirmação da nova senha
                component = document.getElementById('passwordConfirm');
            } else if (id == 'passwordConfirm') {
                // Foco vai para botão de salvar alterações
                component = document.getElementById('signup');
            }
            component?.focus();
        }
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.updateProfileContainer}>
                <p className={styles.pageTitle}>CADASTRE-SE</p>
                <div className={styles.form}>
                    <div className={styles.horizontalEntryDataContainer}>
                        <div className={styles.entryDataContainerMinor}>
                            <p className={styles.label}>Usuário*</p>
                            <input
                                id='username'
                                className={styles.input}
                                type='text'
                                placeholder='Digite seu nome de usuário'
                                value={newUser.username}
                                tabIndex={0}
                                onKeyUp={handleKeyPress}
                                onChange={handleInputChange}
                            ></input>
                        </div>

                        <div className={styles.entryDataContainer}>
                            <p className={styles.label}>Email*</p>
                            <input
                                id='email'
                                name='email'
                                className={styles.input}
                                type='email'
                                placeholder='Digite seu email'
                                value={newUser.email}
                                tabIndex={0}
                                onKeyUp={handleKeyPress}
                                onChange={handleInputChange}
                            ></input>
                        </div>
                    </div>
                    <div className={styles.horizontalEntryDataContainer}>
                        <div className={styles.entryDataContainerMinor}>
                            <p className={styles.label}>Nome*</p>
                            <input
                                id='fullname'
                                className={styles.input}
                                type='text'
                                placeholder='Digite seu nome completo'
                                value={newUser.fullname}
                                tabIndex={0}
                                onKeyUp={handleKeyPress}
                                onChange={handleInputChange}
                            ></input>
                        </div>
                    </div>
                    <div className={styles.horizontalEntryDataContainer}>
                        <div className={styles.entryDataContainer}>
                            <p className={styles.label}>Nova senha*</p>
                            <input
                                id='password'
                                className={styles.input}
                                type='password'
                                placeholder='Digite sua nova senha'
                                value={newUser.password}
                                tabIndex={0}
                                onKeyUp={handleKeyPress}
                                onChange={handleInputChange}
                            ></input>
                        </div>

                        <div className={styles.entryDataContainer}>
                            <p className={styles.label}>Confirmar senha*</p>
                            <input
                                id='passwordConfirm'
                                className={styles.input}
                                type='password'
                                placeholder='Confirmar nova senha'
                                tabIndex={0}
                                onKeyUp={handleKeyPress}
                                onChange={handleInputChange}
                            ></input>
                        </div>
                    </div>
                    <div className={styles.entryDataContainer}>
                        { !passAreEquals && (
                            <p className={styles.errorPassNotEqualsLbl}>As senhas não correspondem!</p>
                        )}
                    </div>
                    
                    <div className={styles.buttonContainer}>
                        <div id='signup'
                                className={styles.button}
                                tabIndex={0}
                                onClick={passAreEquals ? handleSignUp : () => {} }
                                onKeyUp={handleKeyPressBtn}
                            >
                            <p className={styles.buttonLbl}>Cadastrar</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}