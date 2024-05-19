"use client"

import { useState } from "react";
import styles from "./page.module.css";

export default function updateProfile() {
    const [changePass, setChangePass] = useState<boolean>(false);

    const handleChangePass = () => {
        setChangePass(!changePass);
    }

    const handleUpdateProfile = () => {
        console.log("Atualizar perfil do usuário logado");
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
                            ></input>
                        </div>
                        <div className={styles.changePassChkBoxContainer}>
                            <input
                                id='changePassword'
                                type='checkbox'
                                onChange={handleChangePass}
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
                                ></input>
                            </div>
                        </div>
                    )}

                    <div className={styles.buttonContainer}>
                        <div id='updateProfile'
                                className={styles.button}
                                tabIndex={0}
                                onClick={ handleUpdateProfile }
                            >
                            <p className={styles.buttonLbl}>Salvar alterações</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}