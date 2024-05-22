"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Swal from "sweetalert2";
import { axios } from "@/config/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import Select from 'react-select';

// Interface será usada no cadastro de um novo usuário
interface FormUser {
    username: string,
    email: string,
    fullname: string,
    password: string,
    passwordConfirm: string
}

// Interface será usada na atualização dos dados do usuário
interface UserInfo {
    id: string,
    username: string,
    email: string,
    fullname: string,
    password?: string,
    passwordConfirm?: string,
    role: string
}

// Interface para erro: ajuda a recuperar mensagem retornada do back
interface Error {
    message: string
}

export default function ManageUsers() {
    const [user, setUser] = useState<FormUser>({
        username: '',
        email: '',
        fullname: '',
        password: '',
        passwordConfirm: ''
    });
    const [passAreEquals, setPassAreEquals] = useState<boolean>(true);
    const router = useRouter();
    const [showRegisterForm, setShowRegisterForm] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [changePass, setChangePass] = useState<boolean>(false);
    const [users, setUsers] = useState<UserInfo[]>([
        { id: '1', username: 'Usuário1', email: 'usuario1@gmail.com', fullname: 'Nome completo do usuário 1', role: 'admin' },
        { id: '2', username: 'Usuário2', email: 'usuario2@gmail.com', fullname: 'Nome completo do usuário 2', role: 'auth' },
        { id: '3', username: 'Usuário3', email: 'usuario3@gmail.com', fullname: 'Nome completo do usuário 3', role: 'auth' }
    ]);
    const [selectedUser, setSelectedUser] = useState<UserInfo>(
        { id: '', username: '', email: '', fullname: '', role: '' }
    );

    const formUserDataIsValid = () => {
        if (showRegisterForm) {
            return (user.username != ''
                    && user.email != ''
                    && user.fullname != ''
                    && user.password != ''
                    && user.passwordConfirm != ''
                    );
        }

        return (selectedUser.username != ''
                && selectedUser.email != ''
                && selectedUser.fullname != ''
                && ( !changePass ||
                    ( selectedUser.password != '' && selectedUser.passwordConfirm != '' ) )
                );

    }

    const handleRegisterUser = () => {
        if (formUserDataIsValid()) {

            Swal.fire({
                text: `Cadastrar usuário. Dados: username: ${user.username}, email: ${user.email}, fullname: ${user.fullname}, password: ${user.password}, role: ${isAdmin ? 'admin' : 'auth'}`
            });

            return;



            axios.post('/admin/create-user',
            {
                username: user.username,
                email: user.email,
                fullname: user.fullname,
                password: user.password,
                role: isAdmin ? 'admin' : 'auth'
            }
            ).then(response => {
                if (response.status == 201) {
                    Swal.fire({
                        icon: 'info',
                        text: 'User registered successfully'
                    }).then(value => {
                        handleClearAllInputs();
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

    const handleUpdateUser = () => {
        if (formUserDataIsValid()) {
            Swal.fire({
                text: `Atualizar dados do usuário cujo id é ${selectedUser?.id}.
                Novos dados: username: ${selectedUser.username}, email: ${selectedUser.email}, fullname: ${selectedUser.fullname}, password: ${selectedUser.password}, role: ${isAdmin ? 'admin' : 'auth'}`
            });
        } else {
            Swal.fire({
                icon: 'warning',
                text: 'All the fields marked with "*" are required'
            });
        }
    }

    const handleDeleteUserById = () => {
        Swal.fire({
            text: `Deletar dados do usuário cujo id é ${selectedUser?.id}`
        });
    }

    const handleClearAllInputs = () => {
        setUser({ username: '',
                email: '',
                fullname: '',
                password: '',
                passwordConfirm: ''
                });

        setSelectedUser({ id: '',
                          username: '',
                          email: '',
                          fullname: '',
                          role: ''
                        });
        
        setIsAdmin(false);
        setChangePass(false);
    }

    const handleChangeIsAdmin = () => {
        setIsAdmin(!isAdmin);
    }

    const handleChangePass = () => {
        setChangePass(!changePass);
    }

    /* Trata evento change nas caixas de entrada: ajusta dados do formLogin */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        if (showRegisterForm) {
            setUser(prevState => ({
                ...prevState,
                [id]: value,
            }));
        } else {
            setSelectedUser(prevState => ({
                ...prevState,
                [id]: value
            }));
        }

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
                // Foco vai para checkbox de isAdmin
                component = document.getElementById('isAdmin');
            } else if (id == 'password') {
                // Foco vai para caixa de confirmação da nova senha
                component = document.getElementById('passwordConfirm');
            } else if (id == 'passwordConfirm') {
                // Foco vai para botão de salvar alterações
                component = document.getElementById('register');
            }
            component?.focus();
        }
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.registerUpdateUserContainer}>
                <p className={styles.pageTitle}>GERENCIAR USUÁRIOS</p>
                <div className={styles.buttonContainer}>
                        <div id='registerUser'
                                className={`${ showRegisterForm ? styles.selectedButton : styles.buttonChooseAction}`}
                                tabIndex={0}
                                onClick={ () => { handleClearAllInputs(); setShowRegisterForm(true); } }
                                onKeyUp={handleKeyPressBtn}
                            >Cadastrar
                        </div>
                        <div id='updateUser'
                                className={`${ !showRegisterForm ? styles.selectedButton : styles.buttonChooseAction}`}
                                tabIndex={0}
                                onClick={ () => { handleClearAllInputs(); setShowRegisterForm(false); } }
                                onKeyUp={handleKeyPressBtn}
                            >Editar
                        </div>
                </div>
                <div className={styles.form}>
                    { !showRegisterForm && (
                        /* Caixa de busca do usuário a ser editado */
                        <div className={styles.entryDataContainerMinor}>
                            <p className={styles.label}>Usuário*</p>
                            <Select
                                value={selectedUser}
                                onChange={(selectedOption) => { setSelectedUser(selectedOption as UserInfo); setIsAdmin(selectedOption?.role == 'admin' ? true : false); } }
                                options={
                                    users
                                    ? users.map((user: UserInfo) => ({
                                        label: user.username,
                                        value: user.id,
                                        id: user.id,
                                        username: user.username,
                                        email: user.email,
                                        fullname: user.fullname,
                                        role: user.role
                                    }))
                                    : []
                                }
                                className={styles.reactSelect}
                                isSearchable
                                placeholder='Selecione um usuário'
                                noOptionsMessage={() => 'Usuário não encontrado'}
                            />
                        </div>
                    )}
                    <div className={styles.horizontalEntryDataContainer}>
                        <div className={styles.entryDataContainerMinor}>
                            <p className={styles.label}>Usuário*</p>
                            <input
                                id='username'
                                className={styles.input}
                                type='text'
                                placeholder='Digite o nome de usuário'
                                value={ showRegisterForm ? user.username : selectedUser?.username }
                                tabIndex={0}
                                onKeyUp={handleKeyPress}
                                onChange={handleInputChange}
                                readOnly={ showRegisterForm ? false : true }
                            ></input>
                        </div>

                        <div className={styles.entryDataContainer}>
                            <p className={styles.label}>Email*</p>
                            <input
                                id='email'
                                name='email'
                                className={styles.input}
                                type='email'
                                placeholder='Digite o email'
                                value={ showRegisterForm ? user.email : selectedUser?.email }
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
                                placeholder='Digite o nome completo'
                                value={ showRegisterForm ? user.fullname : selectedUser?.fullname }
                                tabIndex={0}
                                onKeyUp={handleKeyPress}
                                onChange={handleInputChange}
                            ></input>
                        </div>
                        <div className={styles.chkBoxContainer}>
                            <input
                                id='isAdmin'
                                type='checkbox'
                                checked={ isAdmin }
                                onChange={ handleChangeIsAdmin }
                                tabIndex={0}
                            />
                            <label htmlFor='isAdmin' className={styles.label}>Administrador</label>
                        </div>
                        { !showRegisterForm && (
                            /* Caixa de seleção que informa se senha será ou não alterada */
                            <div className={styles.chkBoxContainer}>
                                <input
                                    id='changePass'
                                    type='checkbox'
                                    onChange={ handleChangePass }
                                    checked={changePass}
                                    tabIndex={0}
                                />
                                <label htmlFor='changePass' className={styles.label}>Alterar senha</label>
                            </div>
                        )}
                    </div>
                    { (showRegisterForm || (!showRegisterForm && changePass)) && (
                        <>
                            <div className={styles.horizontalEntryDataContainer}>
                                <div className={styles.entryDataContainer}>
                                    <p className={styles.label}>Nova senha*</p>
                                    <input
                                        id='password'
                                        className={styles.input}
                                        type='password'
                                        placeholder='Digite a senha'
                                        value={ showRegisterForm ? user.password : selectedUser?.password }
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
                                        placeholder='Confirme a senha'
                                        value={ showRegisterForm ? user.passwordConfirm : selectedUser?.passwordConfirm }
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
                        </>
                    )}
                    
                    <div className={styles.buttonContainer}>
                        <div id='register'
                                className={styles.button}
                                tabIndex={0}
                                onClick={passAreEquals ? ( showRegisterForm ? handleRegisterUser : handleUpdateUser ) : () => {} }
                                onKeyUp={handleKeyPressBtn}
                            >
                            <p className={styles.buttonLbl}> {showRegisterForm ? 'Cadastrar' : 'Salvar'} </p>
                        </div>

                        { (!showRegisterForm && selectedUser.id != '') && (
                            <>
                            {/* Botão de cancelar alterações */}
                            <div id='cancel'
                                    className={styles.buttonCancel}
                                    tabIndex={0}
                                    // onClick={handleGetUserById}
                                    onKeyUp={handleKeyPressBtn}
                                >
                                <p className={styles.buttonLbl}>Cancelar</p>
                            </div>

                            {/* Botão de excluir usuário */}
                            <div id='delete'
                                    className={styles.buttonDelete}
                                    tabIndex={0}
                                    onClick={handleDeleteUserById}
                                    onKeyUp={handleKeyPressBtn}
                                >
                                <p className={styles.buttonLbl}>Excluir</p>
                            </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}