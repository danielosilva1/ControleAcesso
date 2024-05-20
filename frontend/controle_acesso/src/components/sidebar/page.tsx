"use client";
import { FaBars, FaUsers } from "react-icons/fa";
import styles from "./page.module.css";
import { useState } from "react";
import { getStoredItem } from "@/config/localStorage";

export default function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const role = getStoredItem('role');

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    }

    return (
        <div className={styles.mainContainer}>
            <FaBars className={styles.toggleSidebarIcon} onClick={handleToggleSidebar}></FaBars>
            { sidebarOpen && (
                <>
                    { role === 'admin' && (
                        <>
                        <div className={styles.sidebarItem}>
                            <div className={styles.clickableSidebarItem}>
                                <FaUsers className={styles.sidebarItemIcon}></FaUsers>
                                <p className={styles.sidebarItemLbl}>Gerenciar usuários</p>
                            </div>
                        </div>
                        </>
                    )}
                    <div className={styles.sidebarItem}>
                        <div className={styles.clickableSidebarItem}>
                            <FaUsers className={styles.sidebarItemIcon}></FaUsers>
                            <p className={styles.sidebarItemLbl}>Outra opção</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}