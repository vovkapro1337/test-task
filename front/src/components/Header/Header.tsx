import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Header.module.scss'; // Импортируем модуль стилей

const Header = () => {
	return (
		<header className={styles.header}>
			<nav className={styles.navbar}>
				<ul className={styles.navList}>
					<li className={styles.navItem}>
						<Link to="/" className={styles.navLink}>
							Main
						</Link>
					</li>
					<li className={styles.navItem}>
						<Link to="/cart" className={styles.navLink}>
							Cart
						</Link>
					</li>
					<li className={styles.navItem}>
						<Link to="/order-history" className={styles.navLink}>
							History order
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
