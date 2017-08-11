-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jul 18, 2017 at 08:02 AM
-- Server version: 10.1.16-MariaDB
-- PHP Version: 7.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `giveadinnerparty`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin', 'admin@giveadinnerparty.com', '$2y$10$LWenYgaEONwxu1C16VnReO5kSngQAeI26zr.rr6eKZwEjDMGIFWiq', 'KeywnAJvFuB2DxurawJvX3pPDScfKaGA9EZOiYHgCg2CZnEIQkn830BEKdd2', '2017-06-24 13:02:19', '2017-06-24 13:02:19');

-- --------------------------------------------------------

--
-- Table structure for table `admin_password_resets`
--

CREATE TABLE `admin_password_resets` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sub_title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `title`, `sub_title`, `image`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Give A Dinner Party', 'Get together. Have fun. Give back', '149941007901.jpg', '1', NULL, '2017-07-07 04:01:06');

-- --------------------------------------------------------

--
-- Table structure for table `charities`
--

CREATE TABLE `charities` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `website` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `charities`
--

INSERT INTO `charities` (`id`, `title`, `logo`, `description`, `reference`, `website`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Action Against Hunger', '1499866540why.png', 'dfsdfsdfsfsfdfsd', 'ffsdfdfsdfdsfsd', 'http://www.fsfsd.com', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cms`
--

CREATE TABLE `cms` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cms`
--

INSERT INTO `cms` (`id`, `title`, `image`, `description`, `created_at`, `updated_at`) VALUES
(1, 'about us', '1499423710chat-pic.jpg', '<p>ghgfhg</p>', NULL, '2017-07-07 06:52:27');

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_one` int(11) NOT NULL,
  `user_two` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `conversations`
--

INSERT INTO `conversations` (`id`, `user_one`, `user_two`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 5, 1, '2017-07-17 06:11:43', '2017-07-17 08:20:15'),
(2, 2, 4, 1, '2017-07-17 06:50:13', '2017-07-17 07:38:14'),
(3, 1, 2, 1, '2017-07-17 06:51:30', '2017-07-17 08:17:01');

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` int(10) UNSIGNED NOT NULL,
  `code` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `code`, `title`, `created_at`, `updated_at`) VALUES
(1, 'AF', 'Afghanistan', NULL, NULL),
(2, 'AL', 'Albania', NULL, NULL),
(3, 'DZ', 'Algeria', NULL, NULL),
(4, 'DS', 'American Samoa', NULL, NULL),
(5, 'AD', 'Andorra', NULL, NULL),
(6, 'AO', 'Angola', NULL, NULL),
(7, 'AI', 'Anguilla', NULL, NULL),
(8, 'AQ', 'Antarctica', NULL, NULL),
(9, 'AG', 'Antigua and Barbuda', NULL, NULL),
(10, 'AR', 'Argentina', NULL, NULL),
(11, 'AM', 'Armenia', NULL, NULL),
(12, 'AW', 'Aruba', NULL, NULL),
(13, 'AU', 'Australia', NULL, NULL),
(14, 'AT', 'Austria', NULL, NULL),
(15, 'AZ', 'Azerbaijan', NULL, NULL),
(16, 'BS', 'Bahamas', NULL, NULL),
(17, 'BH', 'Bahrain', NULL, NULL),
(18, 'BD', 'Bangladesh', NULL, NULL),
(19, 'BB', 'Barbados', NULL, NULL),
(20, 'BY', 'Belarus', NULL, NULL),
(21, 'BE', 'Belgium', NULL, NULL),
(22, 'BZ', 'Belize', NULL, NULL),
(23, 'BJ', 'Benin', NULL, NULL),
(24, 'BM', 'Bermuda', NULL, NULL),
(25, 'BT', 'Bhutan', NULL, NULL),
(26, 'BO', 'Bolivia', NULL, NULL),
(27, 'BA', 'Bosnia and Herzegovina', NULL, NULL),
(28, 'BW', 'Botswana', NULL, NULL),
(29, 'BV', 'Bouvet Island', NULL, NULL),
(30, 'BR', 'Brazil', NULL, NULL),
(31, 'IO', 'British Indian Ocean Territory', NULL, NULL),
(32, 'BN', 'Brunei Darussalam', NULL, NULL),
(33, 'BG', 'Bulgaria', NULL, NULL),
(34, 'BF', 'Burkina Faso', NULL, NULL),
(35, 'BI', 'Burundi', NULL, NULL),
(36, 'KH', 'Cambodia', NULL, NULL),
(37, 'CM', 'Cameroon', NULL, NULL),
(38, 'CA', 'Canada', NULL, NULL),
(39, 'CV', 'Cape Verde', NULL, NULL),
(40, 'KY', 'Cayman Islands', NULL, NULL),
(41, 'CF', 'Central African Republic', NULL, NULL),
(42, 'TD', 'Chad', NULL, NULL),
(43, 'CL', 'Chile', NULL, NULL),
(44, 'CN', 'China', NULL, NULL),
(45, 'CX', 'Christmas Island', NULL, NULL),
(46, 'CC', 'Cocos (Keeling) Islands', NULL, NULL),
(47, 'CO', 'Colombia', NULL, NULL),
(48, 'KM', 'Comoros', NULL, NULL),
(49, 'CG', 'Congo', NULL, NULL),
(50, 'CK', 'Cook Islands', NULL, NULL),
(51, 'CR', 'Costa Rica', NULL, NULL),
(52, 'HR', 'Croatia (Hrvatska)', NULL, NULL),
(53, 'CU', 'Cuba', NULL, NULL),
(54, 'CY', 'Cyprus', NULL, NULL),
(55, 'CZ', 'Czech Republic', NULL, NULL),
(56, 'DK', 'Denmark', NULL, NULL),
(57, 'DJ', 'Djibouti', NULL, NULL),
(58, 'DM', 'Dominica', NULL, NULL),
(59, 'DO', 'Dominican Republic', NULL, NULL),
(60, 'TP', 'East Timor', NULL, NULL),
(61, 'EC', 'Ecuador', NULL, NULL),
(62, 'EG', 'Egypt', NULL, NULL),
(63, 'SV', 'El Salvador', NULL, NULL),
(64, 'GQ', 'Equatorial Guinea', NULL, NULL),
(65, 'ER', 'Eritrea', NULL, NULL),
(66, 'EE', 'Estonia', NULL, NULL),
(67, 'ET', 'Ethiopia', NULL, NULL),
(68, 'FK', 'Falkland Islands (Malvinas)', NULL, NULL),
(69, 'FO', 'Faroe Islands', NULL, NULL),
(70, 'FJ', 'Fiji', NULL, NULL),
(71, 'FI', 'Finland', NULL, NULL),
(72, 'FR', 'France', NULL, NULL),
(73, 'FX', 'France, Metropolitan', NULL, NULL),
(74, 'GF', 'French Guiana', NULL, NULL),
(75, 'PF', 'French Polynesia', NULL, NULL),
(76, 'TF', 'French Southern Territories', NULL, NULL),
(77, 'GA', 'Gabon', NULL, NULL),
(78, 'GM', 'Gambia', NULL, NULL),
(79, 'GE', 'Georgia', NULL, NULL),
(80, 'DE', 'Germany', NULL, NULL),
(81, 'GH', 'Ghana', NULL, NULL),
(82, 'GI', 'Gibraltar', NULL, NULL),
(83, 'GK', 'Guernsey', NULL, NULL),
(84, 'GR', 'Greece', NULL, NULL),
(85, 'GL', 'Greenland', NULL, NULL),
(86, 'GD', 'Grenada', NULL, NULL),
(87, 'GP', 'Guadeloupe', NULL, NULL),
(88, 'GU', 'Guam', NULL, NULL),
(89, 'GT', 'Guatemala', NULL, NULL),
(90, 'GN', 'Guinea', NULL, NULL),
(91, 'GW', 'Guinea-Bissau', NULL, NULL),
(92, 'GY', 'Guyana', NULL, NULL),
(93, 'HT', 'Haiti', NULL, NULL),
(94, 'HM', 'Heard and Mc Donald Islands', NULL, NULL),
(95, 'HN', 'Honduras', NULL, NULL),
(96, 'HK', 'Hong Kong', NULL, NULL),
(97, 'HU', 'Hungary', NULL, NULL),
(98, 'IS', 'Iceland', NULL, NULL),
(99, 'IN', 'India', NULL, NULL),
(100, 'IM', 'Isle of Man', NULL, NULL),
(101, 'ID', 'Indonesia', NULL, NULL),
(102, 'IR', 'Iran (Islamic Republic of)', NULL, NULL),
(103, 'IQ', 'Iraq', NULL, NULL),
(104, 'IE', 'Ireland', NULL, NULL),
(105, 'IL', 'Israel', NULL, NULL),
(106, 'IT', 'Italy', NULL, NULL),
(107, 'CI', 'Ivory Coast', NULL, NULL),
(108, 'JE', 'Jersey', NULL, NULL),
(109, 'JM', 'Jamaica', NULL, NULL),
(110, 'JP', 'Japan', NULL, NULL),
(111, 'JO', 'Jordan', NULL, NULL),
(112, 'KZ', 'Kazakhstan', NULL, NULL),
(113, 'KE', 'Kenya', NULL, NULL),
(114, 'KI', 'Kiribati', NULL, NULL),
(115, 'KP', 'Korea, Democratic People''s Republic of', NULL, NULL),
(116, 'KR', 'Korea, Republic of', NULL, NULL),
(117, 'XK', 'Kosovo', NULL, NULL),
(118, 'KW', 'Kuwait', NULL, NULL),
(119, 'KG', 'Kyrgyzstan', NULL, NULL),
(120, 'LA', 'Lao People''s Democratic Republic', NULL, NULL),
(121, 'LV', 'Latvia', NULL, NULL),
(122, 'LB', 'Lebanon', NULL, NULL),
(123, 'LS', 'Lesotho', NULL, NULL),
(124, 'LR', 'Liberia', NULL, NULL),
(125, 'LY', 'Libyan Arab Jamahiriya', NULL, NULL),
(126, 'LI', 'Liechtenstein', NULL, NULL),
(127, 'LT', 'Lithuania', NULL, NULL),
(128, 'LU', 'Luxembourg', NULL, NULL),
(129, 'MO', 'Macau', NULL, NULL),
(130, 'MK', 'Macedonia', NULL, NULL),
(131, 'MG', 'Madagascar', NULL, NULL),
(132, 'MW', 'Malawi', NULL, NULL),
(133, 'MY', 'Malaysia', NULL, NULL),
(134, 'MV', 'Maldives', NULL, NULL),
(135, 'ML', 'Mali', NULL, NULL),
(136, 'MT', 'Malta', NULL, NULL),
(137, 'MH', 'Marshall Islands', NULL, NULL),
(138, 'MQ', 'Martinique', NULL, NULL),
(139, 'MR', 'Mauritania', NULL, NULL),
(140, 'MU', 'Mauritius', NULL, NULL),
(141, 'TY', 'Mayotte', NULL, NULL),
(142, 'MX', 'Mexico', NULL, NULL),
(143, 'FM', 'Micronesia, Federated States of', NULL, NULL),
(144, 'MD', 'Moldova, Republic of', NULL, NULL),
(145, 'MC', 'Monaco', NULL, NULL),
(146, 'MN', 'Mongolia', NULL, NULL),
(147, 'ME', 'Montenegro', NULL, NULL),
(148, 'MS', 'Montserrat', NULL, NULL),
(149, 'MA', 'Morocco', NULL, NULL),
(150, 'MZ', 'Mozambique', NULL, NULL),
(151, 'MM', 'Myanmar', NULL, NULL),
(152, 'NA', 'Namibia', NULL, NULL),
(153, 'NR', 'Nauru', NULL, NULL),
(154, 'NP', 'Nepal', NULL, NULL),
(155, 'NL', 'Netherlands', NULL, NULL),
(156, 'AN', 'Netherlands Antilles', NULL, NULL),
(157, 'NC', 'New Caledonia', NULL, NULL),
(158, 'NZ', 'New Zealand', NULL, NULL),
(159, 'NI', 'Nicaragua', NULL, NULL),
(160, 'NE', 'Niger', NULL, NULL),
(161, 'NG', 'Nigeria', NULL, NULL),
(162, 'NU', 'Niue', NULL, NULL),
(163, 'NF', 'Norfolk Island', NULL, NULL),
(164, 'MP', 'Northern Mariana Islands', NULL, NULL),
(165, 'NO', 'Norway', NULL, NULL),
(166, 'OM', 'Oman', NULL, NULL),
(167, 'PK', 'Pakistan', NULL, NULL),
(168, 'PW', 'Palau', NULL, NULL),
(169, 'PS', 'Palestine', NULL, NULL),
(170, 'PA', 'Panama', NULL, NULL),
(171, 'PG', 'Papua New Guinea', NULL, NULL),
(172, 'PY', 'Paraguay', NULL, NULL),
(173, 'PE', 'Peru', NULL, NULL),
(174, 'PH', 'Philippines', NULL, NULL),
(175, 'PN', 'Pitcairn', NULL, NULL),
(176, 'PL', 'Poland', NULL, NULL),
(177, 'PT', 'Portugal', NULL, NULL),
(178, 'PR', 'Puerto Rico', NULL, NULL),
(179, 'QA', 'Qatar', NULL, NULL),
(180, 'RE', 'Reunion', NULL, NULL),
(181, 'RO', 'Romania', NULL, NULL),
(182, 'RU', 'Russian Federation', NULL, NULL),
(183, 'RW', 'Rwanda', NULL, NULL),
(184, 'KN', 'Saint Kitts and Nevis', NULL, NULL),
(185, 'LC', 'Saint Lucia', NULL, NULL),
(186, 'VC', 'Saint Vincent and the Grenadines', NULL, NULL),
(187, 'WS', 'Samoa', NULL, NULL),
(188, 'SM', 'San Marino', NULL, NULL),
(189, 'ST', 'Sao Tome and Principe', NULL, NULL),
(190, 'SA', 'Saudi Arabia', NULL, NULL),
(191, 'SN', 'Senegal', NULL, NULL),
(192, 'RS', 'Serbia', NULL, NULL),
(193, 'SC', 'Seychelles', NULL, NULL),
(194, 'SL', 'Sierra Leone', NULL, NULL),
(195, 'SG', 'Singapore', NULL, NULL),
(196, 'SK', 'Slovakia', NULL, NULL),
(197, 'SI', 'Slovenia', NULL, NULL),
(198, 'SB', 'Solomon Islands', NULL, NULL),
(199, 'SO', 'Somalia', NULL, NULL),
(200, 'ZA', 'South Africa', NULL, NULL),
(201, 'GS', 'South Georgia South Sandwich Islands', NULL, NULL),
(202, 'ES', 'Spain', NULL, NULL),
(203, 'LK', 'Sri Lanka', NULL, NULL),
(204, 'SH', 'St. Helena', NULL, NULL),
(205, 'PM', 'St. Pierre and Miquelon', NULL, NULL),
(206, 'SD', 'Sudan', NULL, NULL),
(207, 'SR', 'Suriname', NULL, NULL),
(208, 'SJ', 'Svalbard and Jan Mayen Islands', NULL, NULL),
(209, 'SZ', 'Swaziland', NULL, NULL),
(210, 'SE', 'Sweden', NULL, NULL),
(211, 'CH', 'Switzerland', NULL, NULL),
(212, 'SY', 'Syrian Arab Republic', NULL, NULL),
(213, 'TW', 'Taiwan', NULL, NULL),
(214, 'TJ', 'Tajikistan', NULL, NULL),
(215, 'TZ', 'Tanzania, United Republic of', NULL, NULL),
(216, 'TH', 'Thailand', NULL, NULL),
(217, 'TG', 'Togo', NULL, NULL),
(218, 'TK', 'Tokelau', NULL, NULL),
(219, 'TO', 'Tonga', NULL, NULL),
(220, 'TT', 'Trinidad and Tobago', NULL, NULL),
(221, 'TN', 'Tunisia', NULL, NULL),
(222, 'TR', 'Turkey', NULL, NULL),
(223, 'TM', 'Turkmenistan', NULL, NULL),
(224, 'TC', 'Turks and Caicos Islands', NULL, NULL),
(225, 'TV', 'Tuvalu', NULL, NULL),
(226, 'UG', 'Uganda', NULL, NULL),
(227, 'UA', 'Ukraine', NULL, NULL),
(228, 'AE', 'United Arab Emirates', NULL, NULL),
(229, 'GB', 'United Kingdom', NULL, NULL),
(230, 'US', 'United States', NULL, NULL),
(231, 'UM', 'United States minor outlying islands', NULL, NULL),
(232, 'UY', 'Uruguay', NULL, NULL),
(233, 'UZ', 'Uzbekistan', NULL, NULL),
(234, 'VU', 'Vanuatu', NULL, NULL),
(235, 'VA', 'Vatican City State', NULL, NULL),
(236, 'VE', 'Venezuela', NULL, NULL),
(237, 'VN', 'Vietnam', NULL, NULL),
(238, 'VG', 'Virgin Islands (British)', NULL, NULL),
(239, 'VI', 'Virgin Islands (U.S.)', NULL, NULL),
(240, 'WF', 'Wallis and Futuna Islands', NULL, NULL),
(241, 'EH', 'Western Sahara', NULL, NULL),
(242, 'YE', 'Yemen', NULL, NULL),
(243, 'ZR', 'Zaire', NULL, NULL),
(244, 'ZM', 'Zambia', NULL, NULL),
(245, 'ZW', 'Zimbabwe', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_date` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `street` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `county` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `drink_preferences` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `food_included` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `own_drinks` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `drinks_included` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `food_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `food_drink_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `open_to` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guest_gender` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `min_age` int(11) NOT NULL,
  `max_age` int(11) NOT NULL,
  `orientation` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dress_code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `seating` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `min_guests` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `max_guests` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `charity_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `charity_cut` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference_number` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `welcome_note` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ticket_price` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `user_id`, `title`, `description`, `event_date`, `start_time`, `end_time`, `street`, `city`, `county`, `postal_code`, `country`, `drink_preferences`, `food_included`, `own_drinks`, `drinks_included`, `food_type`, `food_drink_type`, `open_to`, `guest_gender`, `min_age`, `max_age`, `orientation`, `dress_code`, `setting`, `seating`, `min_guests`, `max_guests`, `charity_id`, `charity_cut`, `reference_number`, `welcome_note`, `ticket_price`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 'fdsdfsdfds', 'fsdfdfdsfsdfd', '06/27/2017', '04:30:00', '19:15:00', 'sdfsdfsdfdfsd', 'fsdfsdfsdf', 'dfsdfsdfsdf', 'DN17 2HJ', 'Qatar', 'No Alcohol', 'None', 'Don’t Mind', 'dfsdfsdfsdfsdfsd', 'Breakfast', '["Vegetarian","Vegan","Pescatarian","Kosher"]', 'Don’t Mind', 'Don’t Mind', 18, 18, 'Don''t Mind', 'As You Like', 'Indoor', 'Around A Table', '5', '15', '1', '100', 'fsfsdfsdf', 'sdfsdfsdfdfsdf', 30, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `faqs`
--

CREATE TABLE `faqs` (
  `id` int(10) UNSIGNED NOT NULL,
  `question` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `faqs`
--

INSERT INTO `faqs` (`id`, `question`, `answer`, `status`, `created_at`, `updated_at`) VALUES
(2, 'ffd', 'fdgfdgfdgfdgfd', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `friends` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `status` enum('0','1','2') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(10) UNSIGNED NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_seen` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_from_sender` tinyint(1) NOT NULL DEFAULT '0',
  `deleted_from_receiver` tinyint(1) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `message`, `is_seen`, `deleted_from_sender`, `deleted_from_receiver`, `user_id`, `conversation_id`, `created_at`, `updated_at`) VALUES
(1, 'Hi!', 0, 0, 0, 2, 1, '2017-07-17 06:11:43', '2017-07-17 06:11:43'),
(2, 'Hi..How re You?', 0, 0, 0, 2, 2, '2017-07-17 06:50:13', '2017-07-17 06:50:13'),
(3, 'Hi..How re You?', 0, 0, 0, 2, 2, '2017-07-17 06:50:22', '2017-07-17 06:50:22'),
(4, 'BB Ki Vines', 0, 0, 0, 2, 3, '2017-07-17 06:51:30', '2017-07-17 06:51:30'),
(5, 'BB Ki Vines', 0, 0, 0, 2, 3, '2017-07-17 06:51:33', '2017-07-17 06:51:33'),
(6, 'How are you!', 0, 0, 0, 4, 2, '2017-07-17 07:38:14', '2017-07-17 07:38:14'),
(7, 'How are you!', 0, 0, 0, 1, 3, '2017-07-17 07:38:31', '2017-07-17 07:38:31'),
(8, 'I am fine', 0, 0, 0, 2, 3, '2017-07-17 08:17:01', '2017-07-17 08:17:01'),
(9, 'how are you', 0, 0, 0, 2, 1, '2017-07-17 08:18:11', '2017-07-17 08:18:11'),
(10, 'ok', 0, 0, 0, 5, 1, '2017-07-17 08:18:24', '2017-07-17 08:18:24'),
(11, 'I am fine', 0, 0, 0, 2, 1, '2017-07-17 08:20:03', '2017-07-17 08:20:03'),
(12, 'Ok Good', 0, 0, 0, 5, 1, '2017-07-17 08:20:15', '2017-07-17 08:20:15');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2017_06_24_172142_create_admins_table', 1),
(4, '2017_06_24_172143_create_admin_password_resets_table', 1),
(5, '2017_06_24_172219_create_staff_table', 1),
(6, '2017_06_24_172220_create_staff_password_resets_table', 1),
(7, '2017_06_24_172240_create_user_password_resets_table', 1),
(11, '2014_10_12_000000_create_users_table', 2),
(12, '2017_06_29_123639_create_system_settings_table', 3),
(13, '2017_06_30_103547_create_social_logins_table', 4),
(14, '2017_07_05_123559_create_countries_table', 5),
(15, '2017_07_06_131843_create_banners_table', 6),
(16, '2017_07_07_082436_create_faqs_table', 7),
(17, '2017_07_07_095929_create_cms_table', 8),
(18, '2017_07_10_124254_create_userimages_table', 9),
(19, '2017_07_11_053423_create_offers_table', 10),
(20, '2017_07_11_120403_create_charities_table', 11),
(23, '2017_07_12_085447_create_seos_table', 12),
(24, '2017_07_12_092903_create_events_table', 12),
(25, '2015_10_05_110608_create_messages_table', 13),
(26, '2015_10_05_110622_create_conversations_table', 13),
(27, '2017_07_14_112948_create_transactions_table', 14),
(28, '2017_07_17_085745_create_friends_table', 14),
(29, '2017_07_17_093511_create_reviews_table', 15);

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

CREATE TABLE `offers` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rule` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_resets`
--

INSERT INTO `password_resets` (`email`, `token`, `created_at`) VALUES
('naseembca1990@gmail.com', '$2y$10$hRfJdM9UX4CajBegF/KICOuot6Dz02lfqwT5zBRUtn/W.oaCt0oVC', '2017-07-05 06:26:40');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(10) UNSIGNED NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `review` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `seos`
--

CREATE TABLE `seos` (
  `id` int(10) UNSIGNED NOT NULL,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keyword` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `social_logins`
--

CREATE TABLE `social_logins` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `facebook_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `facebook_link` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `social_logins`
--

INSERT INTO `social_logins` (`id`, `user_id`, `facebook_id`, `facebook_link`, `created_at`, `updated_at`) VALUES
(1, 1, '1959063524377417', 'https://www.facebook.com/app_scoped_user_id/1959063524377417/', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff_password_resets`
--

CREATE TABLE `staff_password_resets` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_settings`
--

CREATE TABLE `system_settings` (
  `id` int(10) UNSIGNED NOT NULL,
  `company_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_logo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address1` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address2` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address3` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fax` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `facebook` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `twitter` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `linkedIn` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `system_settings`
--

INSERT INTO `system_settings` (`id`, `company_name`, `company_logo`, `address1`, `address2`, `address3`, `email`, `telephone`, `fax`, `facebook`, `twitter`, `linkedIn`, `created_at`, `updated_at`) VALUES
(1, 'Give A Dinner Party', 'http://localhost/giveadinnerparty/public/assets/admin/uploads/images/logo.png', '75 Broomfield Place', 'STONEY MIDDLETON', 'S30 8PP', 'contact@giveadinnerparty.com', '1234567890', '1234567890', 'https://www.facebook.com/giveadinnerparty', 'https://www.twitter.com/giveadinnerparty', 'https://www.linkedin.com/giveadinnerparty', '2017-06-29 13:32:48', '2017-06-29 14:01:20');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(10) UNSIGNED NOT NULL,
  `payKey` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `userimages`
--

CREATE TABLE `userimages` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `default` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `userimages`
--

INSERT INTO `userimages` (`id`, `user_id`, `image`, `default`, `created_at`, `updated_at`) VALUES
(1, '2', '1499840830bold.png', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dob` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ethnicity` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sexuality` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `town` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `county` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postcode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `spoken_languages` text COLLATE utf8mb4_unicode_ci,
  `hosting_option` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notifications` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `invites` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `about` text COLLATE utf8mb4_unicode_ci,
  `hobbies` text COLLATE utf8mb4_unicode_ci,
  `profession` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `education` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `religion` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paypal_fname` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paypal_lname` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paypal_email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photos` text COLLATE utf8mb4_unicode_ci,
  `confirmed` int(11) NOT NULL DEFAULT '0',
  `confirmation_code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_disabled` int(11) NOT NULL DEFAULT '0',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `last_name`, `dob`, `status`, `gender`, `ethnicity`, `sexuality`, `telephone`, `address`, `town`, `county`, `country`, `postcode`, `spoken_languages`, `hosting_option`, `notifications`, `invites`, `about`, `hobbies`, `profession`, `education`, `religion`, `paypal_fname`, `paypal_lname`, `paypal_email`, `photos`, `confirmed`, `confirmation_code`, `is_disabled`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Prashant Gupta', 'prashant2621993@live.com', '$2y$10$6rVxHMcq81qH2qWmmKDuo.UhGDW2SrdlgrWlkwFk8hqdctjADaTXC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, 'MFpQGUiN6R4kRaclWulOoVjkamlgh88f6S2hHpcLC9j69bGSNJQ3tqRVBZDr', '2017-06-30 16:23:13', '2017-06-30 16:24:51'),
(2, 'Naseem', 'anaseem711@gmail.com', '$2y$10$6rVxHMcq81qH2qWmmKDuo.UhGDW2SrdlgrWlkwFk8hqdctjADaTXC', 'kkfgfdgfdg', '07/05/2017', 'Married', 'Male', 'Chinese', 'Lesbian', '9899004511', 'H.No. 217, Okhla', 'Delhi', 'county', 'India', 'DN17 2HG', '["Arabic","French","Hindi","Italian","Japanese","Malay","Polish","Punjabi","Romanian","Russian","Swedish","Vietnamese"]', '["Socialising & Friendship","Dating","Charity & Fundraising","Meditation, Yoga & Healing","Art & Antiques","Tv & Cinema","Outdoor Pursuits","Entrepreneurship & Business"]', NULL, NULL, 'bnbbbmmbdfsdfsffsdfsddfdsdfsdfdfsdfsdfsdfdfdfdfsdfdfdfdfdfdfsd ggfdgfdgfdgfdgfdgfgfdgfdfgfgfgfdgfgfdgfdgfdgfgfgfdgfdgfdgfd', '["Travel & Culture","Meditation, Yoga & Healing","Card Games","Tv & Cinema","Instruments & Singing","Dancing"]', 'profession testing okkkk', 'bca', 'testing', '$2y$10$WBEDCFhAfcF2o0tpBTYIhe7ZtMLS20KA08QiIG4Hski.Hsfm.vCkm', NULL, NULL, '1', 1, '35467874323456789', 0, 'UVHT9uEn0itHhNEgURTcyFCT3YtgKCtYLHU3mn3Z3wzIcSQ0hwN8UIywX8Sp', '2017-07-04 18:30:00', '2017-07-17 23:33:47'),
(3, 'Rahul', 'phpdeveloper7@gmail.com', '$2y$10$7jnxL9SDOTY7oR8P6dPXW.fNAMODkKUdrYDM2VSUt2Mkb6Pjq6EHi', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, 0, 'CZWkG9pZuy2So6MwJDsFYeY1hLoDpQHpphd1dJCzThjbfh645aE8bAWaXn1i', '2017-07-10 01:59:47', '2017-07-10 01:59:47'),
(4, 'Arun', 'phpdeveloper71@gmail.com', '$2y$10$S/O2PeyjGDZ/JBsHvjseL.2QnItbBLnpufBBZ.5TcO9cU0HM/fI6G', NULL, '3/5/1990', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'DN17 2HJ', '["Arabic","French","Hindi","Italian","Japanese","M...', NULL, NULL, NULL, NULL, '["Travel & Culture","Meditation, Yoga & Healing","Card Games","Tv & Cinema","Instruments & Singing","Dancing"]', NULL, NULL, NULL, NULL, NULL, NULL, '1', 1, '2497563081', 0, 'RbbjkibSegGkB5X96uG0UpQPPL3buWZZPJSiJNO0zR6vejJ889LP9Ahhn77I', '2017-07-10 02:11:41', '2017-07-10 02:11:41'),
(5, 'Praveen', 'phpdeveloper70@gmail.com', '$2y$10$1kxSA.mr48dAbzdlAfDKtOSJnsVc5n9j1pBmCrDxAaiUAH76mgE3.', NULL, '3/5/1990', 'Married', 'Male', 'Chinese', 'Lesbian', NULL, NULL, NULL, NULL, NULL, 'DN17 2HJ', '["Arabic","French","Hindi","Italian","Japanese","M...', NULL, NULL, NULL, 'sadfgfdggdfg fdgfdgfdgfd  fdgfdgfdgfd  fgdfdg', '["Travel & Culture","Meditation, Yoga & Healing","Card Games","Tv & Cinema","Instruments & Singing","Dancing"]', NULL, NULL, NULL, NULL, NULL, NULL, '1', 1, '8031925476', 0, 'n5rwUTYlMaZvPEVNRbJWDEoCbT7EPUMU7puOwVjfvrK0TKv675bQBpKRfDs2', '2017-07-10 02:16:22', '2017-07-10 08:10:22');

-- --------------------------------------------------------

--
-- Table structure for table `user_password_resets`
--

CREATE TABLE `user_password_resets` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `admins_email_unique` (`email`);

--
-- Indexes for table `admin_password_resets`
--
ALTER TABLE `admin_password_resets`
  ADD KEY `admin_password_resets_email_index` (`email`),
  ADD KEY `admin_password_resets_token_index` (`token`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `charities`
--
ALTER TABLE `charities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cms`
--
ALTER TABLE `cms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `seos`
--
ALTER TABLE `seos`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `social_logins`
--
ALTER TABLE `social_logins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `staff_email_unique` (`email`);

--
-- Indexes for table `staff_password_resets`
--
ALTER TABLE `staff_password_resets`
  ADD KEY `staff_password_resets_email_index` (`email`),
  ADD KEY `staff_password_resets_token_index` (`token`);

--
-- Indexes for table `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userimages`
--
ALTER TABLE `userimages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `user_password_resets`
--
ALTER TABLE `user_password_resets`
  ADD KEY `user_password_resets_email_index` (`email`),
  ADD KEY `user_password_resets_token_index` (`token`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `charities`
--
ALTER TABLE `charities`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `cms`
--
ALTER TABLE `cms`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=246;
--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;
--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `seos`
--
ALTER TABLE `seos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `social_logins`
--
ALTER TABLE `social_logins`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `userimages`
--
ALTER TABLE `userimages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
