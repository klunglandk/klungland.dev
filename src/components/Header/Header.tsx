import Navbar from "../Navbar/Navbar";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <div className={styles.header}>
      <Navbar />
    </div>
  );
}
