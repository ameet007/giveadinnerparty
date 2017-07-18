<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'dinner_blog');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'siaeV`Jotz7?|<y/+i-]qr`To_ygMr20&0d?o}yDE!qXDk#z/q00ca7paE)DUKLZ');
define('SECURE_AUTH_KEY',  '3Zj2g19xB1L9&I_oM%U2AImC:#H6tF87_wQAM$]}/Xb8]nnUlOd*0./FS<PpL@Im');
define('LOGGED_IN_KEY',    'MHmUu&bxbZq_#>BypXhMTP>e)Rh!JC?<lv,l,X1nMQj>Px+3A_1245-(zx[!S^{[');
define('NONCE_KEY',        'F9IfVA%V|<US[FiHT]DQ.]2L7=6jYARjUo=8%B>Y4OnW~e$~mcfZ]mpuJD9qp&D[');
define('AUTH_SALT',        '8ff<BZSZBb#vbG^VqS8yW./+Ag?`}4#Xyg*6c1Uz.-aRb,/P@~1MNng~S?.S uz`');
define('SECURE_AUTH_SALT', 'LL5^pq4dLU|)Sv]nS6aLXgp8dMVDuh<t?gM[_LI64Y6o=Cc:c>[]k *Ig-!^/P[%');
define('LOGGED_IN_SALT',   'W>0jai|o$!f$F. i1Lpi<rCQA`dd$Bjd{P=u|bW=+qIs[{~7ii@4i_~tT5g(R[]i');
define('NONCE_SALT',       'SOx= -&H#(:OhQL6S0q0i/6%]v-X,Yz|Ogzlv n-q/&9O3mjL`U7nRk2iLfA]J(i');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'blog';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
