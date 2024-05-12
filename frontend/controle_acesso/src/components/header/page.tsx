"use client";
import styles from "./page.module.css";
import { IoMdHome } from "react-icons/io";
import { FaUserCircle, FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleToggleMenu = () => {
        setMenuOpen(!menuOpen);
    }

    return (
        <div className={styles.mainContainer}>
             <div className={styles.iconContainer}>
                <IoMdHome className={styles.headerIcon}></IoMdHome>
            </div>
            <div></div> {/* div central */}
            <div className={styles.iconContainer}>
                <FaUserCircle className={styles.headerIcon} onClick={handleToggleMenu}></FaUserCircle>
            </div>
            { /* Menu dropdown */ }
            {menuOpen && (
                <div className={styles.dropDownMenu}>
                    <div className={styles.dropDownMenuItem}>
                        <div className={styles.clickableDropDownMenuItem}>
                            <FaUserEdit className={styles.dropDownMenuIcon}></FaUserEdit>
                            <p className={styles.dropDownMenuLbl}>Editar perfil</p>
                        </div>
                    </div>
                    <div className={styles.dropDownMenuItem}>
                        <div className={styles.clickableDropDownMenuItem}>
                            <FaSignOutAlt className={styles.dropDownMenuIcon}></FaSignOutAlt>
                            <p className={styles.dropDownMenuLbl}>Sair</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}