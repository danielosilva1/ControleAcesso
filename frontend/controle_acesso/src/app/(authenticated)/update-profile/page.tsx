"use client";

import React, { useState } from "react";
import styles from "./page.module.css";

export default function updateProfile() {
    const [changePass, setChangePass] = useState<boolean>(false);

    const handleChangePass = () => {
        setChangePass(!changePass);
    }

    const handleUpdateProfile = () => {
        console.log("Atualizar perfil do usuário logado");
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
                                tabIndex={0}
                                readOnly={true}
                            ></input>
                        </div>

                        <div className={styles.entryDataContainer}>
                            <p className={styles.label}>Email</p>
                            <input
                                id='email'
                                className={styles.input}
                                type='email'
                                placeholder='Digite seu email'
                                tabIndex={0}
                                onKeyUp={handleKeyPress}
                            ></input>
                        </div>
                    </div>
                    <div className={styles.horizontalEntryDataContainer}>
                        <div className={styles.entryDataContainerMinor}>
                            <p className={styles.label}>Nome</p>
                            <input
                                id='fullname'
                                className={styles.input}
                                type='text'
                                placeholder='Digite seu nome completo'
                                tabIndex={0}
                                onKeyUp={handleKeyPress}
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
                                <p className={styles.label}>Nova senha</p>
                                <input
                                    id='password'
                                    className={styles.input}
                                    type='password'
                                    placeholder='Digite sua nova senha'
                                    tabIndex={0}
                                    onKeyUp={handleKeyPress}
                                ></input>
                            </div>

                            <div className={styles.entryDataContainer}>
                                <p className={styles.label}>Confirmar senha</p>
                                <input
                                    id='passwordConfirm'
                                    className={styles.input}
                                    type='password'
                                    placeholder='Confirmar nova senha'
                                    tabIndex={0}
                                    onKeyUp={handleKeyPress}
                                ></input>
                            </div>
                        </div>
                    )}

                    <div className={styles.buttonContainer}>
                        <div id='updateProfile'
                                className={styles.button}
                                tabIndex={0}
                                onClick={ handleUpdateProfile }
                                onKeyUp={handleKeyPressBtn}
                            >
                            <p className={styles.buttonLbl}>Salvar alterações</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}