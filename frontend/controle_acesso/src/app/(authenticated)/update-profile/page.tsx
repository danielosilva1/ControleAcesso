"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Swal from "sweetalert2";
import { axios } from "@/config/axios";
import { Axios, AxiosError } from "axios";

interface FormUser {
    username: string,
    email: string,
    fullname: string,
    password?: string,
    passwordConfirm?: string
}

// Interface para resposta da requisição para obter dados do usuário logado
interface Response {
    user: {
        username: string,
        fullname: string,
        email: string,
    }
}

// Interface para erro: ajuda a recuperar mensagem retornada do back
interface Error {
    message: string
}

export default function updateProfile() {
    const [changePass, setChangePass] = useState<boolean>(false);
    const [loggedUser, setLoggedUser] = useState<FormUser>({
        username: '',
        email: '',
        fullname: '',
        password: '',
        passwordConfirm: ''
    });
    const [passAreEquals, setPassAreEquals] = useState<boolean>(true);

    const formLoggedUserIsValid = () => {
        return (loggedUser.email != ''
                && loggedUser.fullname != ''
                && (!changePass || (loggedUser.password != '' && loggedUser.passwordConfirm != ''))
        );
    }

    const handleUpdateProfile = () => {
        if (formLoggedUserIsValid()) {
            const body = {
                email: loggedUser.email,
                fullname: loggedUser.fullname,
                ...(loggedUser.password && {password: loggedUser.password})
            }
    
            axios.put('/auth/update-user',
            { email: loggedUser.email, fullname: loggedUser.fullname, ...(changePass && {password: loggedUser.password}) }).
            then(response => {
                if (response.status == 200) {
                    Swal.fire({
                        icon: 'info',
                        text: 'Profile updated successfully'
                    }).then(value => {
                        handleClearPassInput();
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

    useEffect(() => {
        // Manda requisição para obter dados do usuário logado
        axios.get<Response>('/auth/get-logged-user').
        then(response => {
            if (response.status == 200) {
                const loggUser = response.data.user;

                setLoggedUser({
                    email: loggUser.email,
                    username: loggUser.username,
                    fullname: loggUser.fullname
                });
            }
        }).catch((error: AxiosError<Error>) => {
            const message = error.response?.data?.message;
            Swal.fire({
                icon: 'error',
                text: message
            });
        });
    }, []);

    const handleClearPassInput = () => {
        let passComponent = document.getElementById('password') as HTMLInputElement;
        let passConfirmComponent = document.getElementById('passwordConfirm') as HTMLInputElement;

        if (passComponent && passConfirmComponent) {
            passComponent.value = '';
            passConfirmComponent.value = '';
        }
    }

    const handleChangePass = () => {
        setChangePass(!changePass);
    }

    /* Trata evento change nas caixas de entrada: ajusta dados do formLogin */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        setLoggedUser(prevState => ({
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
            if (id == 'email') {
                // Foco vai para caixa de nome completo
                component = document.getElementById('fullname');
            } else if (id == 'fullname') {
                // Foco vai para checkbox de mudança de senha
                component = document.getElementById('changePassword');
            } else if (id == 'password') {
                // Foco vai para caixa de confirmação da nova senha
                component = document.getElementById('passwordConfirm');
            } else if (id == 'passwordConfirm') {
                // Foco vai para botão de salvar alterações
                component = document.getElementById('updateProfile');
            }
            component?.focus();
        }
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.updateProfileContainer}>
                <p className={styles.pageTitle}>MEUS DADOS</p>
                <div className={styles.form}>
                    <div className={styles.horizontalEntryDataContainer}>
                        <div className={styles.entryDataContainerMinor}>
                            <p className={styles.label}>Usuário</p>
                            <input
                                id='username'
                                className={styles.input}
                                type='text'
                                placeholder='Digite seu nome de usuário'
                                value={loggedUser.username}
                                tabIndex={0}
                                readOnly={true}
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
                                value={loggedUser.email}
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
                                value={loggedUser.fullname}
                                tabIndex={0}
                                onKeyUp={handleKeyPress}
                                onChange={handleInputChange}
                            ></input>
                        </div>
                        <div className={styles.changePassChkBoxContainer}>
                            <input
                                id='changePassword'
                                type='checkbox'
                                onChange={handleChangePass}
                                tabIndex={0}
                            />
                            <label htmlFor='changePassword' className={styles.label}>Alterar senha</label>
                        </div>
                    </div>
                    { changePass && (
                            <div className={styles.horizontalEntryDataContainer}>
                            <div className={styles.entryDataContainer}>
                                <p className={styles.label}>Nova senha*</p>
                                <input
                                    id='password'
                                    className={styles.input}
                                    type='password'
                                    placeholder='Digite sua nova senha'
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
                    )}
                    <div className={styles.entryDataContainer}>
                        { (changePass && !passAreEquals) && (
                            <p className={styles.errorPassNotEqualsLbl}>As senhas não correspondem!</p>
                        )}
                    </div>
                    
                    <div className={styles.buttonContainer}>
                        <div id='updateProfile'
                                className={styles.button}
                                tabIndex={0}
                                onClick={ (!changePass || passAreEquals) ? handleUpdateProfile : () => {} }
                                onKeyUp={handleKeyPressBtn}
                            >
                            <p className={styles.buttonLbl}>Salvar</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}