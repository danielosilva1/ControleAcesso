"use client";
import Sidebar from "@/components/sidebar/page";
import styles from "./page.module.css";

export default function Home() {
    return (
        <div className={styles.mainContainer}>
            <div>
                <Sidebar></Sidebar>
            </div>
        </div>
    )
}