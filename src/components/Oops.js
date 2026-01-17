import Link from "next/link";
import styles from "./Oops.module.css";

export default function Oops() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Oops!</h1>
        <p className={styles.text}>
          We couldn’t find the article you were looking for.
        </p>

        <Link href="/" className={styles.button}>
          Go back home
        </Link>
      </div>
    </div>
  );
}
