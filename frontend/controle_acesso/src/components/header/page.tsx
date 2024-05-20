"use client";
import styles from "./page.module.css";
import { IoMdHome } from "react-icons/io";
import { FaUserCircle, FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { axios } from "@/config/axios";
import { useRouter } from "next/navigation";
import { removeStoredItem } from "@/config/localStorage";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

    const handleToggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    const handleSignout = () => {
        axios.defaults.headers['Authorization'] = ''; // Remove token do header do axios
        removeStoredItem('role'); // Remove role do armazenamento local
        router.push('./sign-in');
    }

    const handleGoToHomeWin = () => {
        setMenuOpen(false); // Fecha menu drop-down
        router.push('/home');
    }

    const handleGoToUpdProfileWin = () => {
        handleToggleMenu(); // Altera visualização do menu drop-down
        router.push('/update-profile');
    }

    useEffect(() => {
        if (axios.defaults.headers['Authorization'] == undefined || axios.defaults.headers['Authorization'] == '') {
            // Usuário não está logado: redireciona para tela de login
            router.push('/sign-in');
        }
    }, []);

    return (
        <div className={styles.mainContainer}>
             <div className={styles.iconContainer}>
                <IoMdHome className={styles.headerIcon} onClick={handleGoToHomeWin}></IoMdHome>
            </div>
            <div></div> {/* div central */}
            <div className={styles.iconContainer}>
                <FaUserCircle className={styles.headerIcon} onClick={handleToggleMenu}></FaUserCircle>
            </div>
            { /* Menu dropdown */ }
            {menuOpen && (
                <div className={styles.dropDownMenu}>
                    <div className={styles.dropDownMenuItem}>
                        <div className={styles.clickableDropDownMenuItem} onClick={handleGoToUpdProfileWin}>
                            <FaUserEdit className={styles.dropDownMenuIcon}></FaUserEdit>
                            <p className={styles.dropDownMenuLbl}>Editar perfil</p>
                        </div>
                    </div>
                    <div className={styles.dropDownMenuItem}>
                        <div className={styles.clickableDropDownMenuItem} onClick={handleSignout}>
                            <FaSignOutAlt className={styles.dropDownMenuIcon}></FaSignOutAlt>
                            <p className={styles.dropDownMenuLbl}>Sair</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}