-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Aug 11, 2017 at 07:38 AM
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
-- Table structure for table `account_closes`
--

CREATE TABLE `account_closes` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `why_close` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `tell_more` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_you` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `account_closes`
--

INSERT INTO `account_closes` (`id`, `user_id`, `why_close`, `tell_more`, `contact_you`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, '["I have concerns about privacy","I haven\\u2019t found it useful","I don\\u2019t understand how to use it"]', 'This token is used to verify that the authenticated user is the one actually making the requests to the application.', 'yes', 0, '2017-08-10 01:31:52', NULL);

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
(1, 'Admin', 'admin@giveadinnerparty.com', '$2y$10$LWenYgaEONwxu1C16VnReO5kSngQAeI26zr.rr6eKZwEjDMGIFWiq', 'VoZk6Rw23FAC5YkJVozZa7d1ZO2FqUIMKOwwj0FGUJAviC1hWSw9jO6qWgfg', '2017-06-24 13:02:19', '2017-08-09 01:51:45');

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
(1, 'Give A Dinner Party', 'Get together. Have fun. Give back', '149941007901.jpg', '1', NULL, '2017-07-11 07:35:10');

-- --------------------------------------------------------

--
-- Table structure for table `charities`
--

CREATE TABLE `charities` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(199) COLLATE utf8mb4_unicode_ci NOT NULL,
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

INSERT INTO `charities` (`id`, `title`, `email`, `password`, `logo`, `description`, `reference`, `website`, `status`, `created_at`, `updated_at`) VALUES
(2, 'Dinner Party chatity', 'admin@gmail.com', '$2y$10$k0hV3jWQmyhiYgKHtJRjwexw3MadoOZ4BPP.RJryGt7zwrrl9.P/m', '1499777993Hydrangeas.jpg', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '9899004511', 'ytuytuyt', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `charity_password_resets`
--

CREATE TABLE `charity_password_resets` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `charity_reports`
--

CREATE TABLE `charity_reports` (
  `id` int(10) UNSIGNED NOT NULL,
  `charity_id` int(11) NOT NULL,
  `amount` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `charity_transaction_reports`
--

CREATE TABLE `charity_transaction_reports` (
  `id` int(10) UNSIGNED NOT NULL,
  `charity_id` int(11) NOT NULL,
  `transaction_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(1, 'about us', '1499423710chat-pic.jpg', '<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&#39;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>', NULL, '2017-08-09 06:06:14'),
(2, 'fdgdfgfdgfd', '', '<p>dfgfdgfdg</p>', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `number`, `message`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Ravi Verma', 'ravi.mygzb@gmail.com', '9560414211', 'This is my mgs.', '', NULL, NULL),
(2, 'Ravi Verma', 'ravi.mygzb@gmail.com', '9560414211', 'This is my mgs.', '', NULL, NULL);

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
(1, 2, 1, 1, '2017-07-27 04:01:13', '2017-07-27 03:45:31'),
(2, 1, 2, 1, '2017-07-27 05:32:40', '2017-08-02 06:27:37');

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
(1, 1, 'Dinner Party', 'Along with helpful travel instructions to help them get to your place.', '08/012/2017', '01:30:00', '12:30:00', 'Noida', 'Noida', 'IN', '110009', 'India', 'Alcohol Ok', '2 Courses', 'Yes', 'any', 'Lunch', '["Vegetarian","Pescatarian","Kosher"]', 'Couples Only', 'Women Only', 18, 27, 'Gay', 'Smart', 'Outdoor', 'Sofa And/or Chairs', '10', '15', '2', '50', '98999004500', 'Along with helpful travel instructions to help them get to your place.', 200, 1, NULL, NULL),
(2, 1, 'Lunch Party', 'Along with helpful travel instructions to help them get to your place.', '08/25/2017', '01:30:00', '02:30:00', 'Noida', 'Noida', 'IN', '110009', 'India', 'Alcohol Ok', '2 Courses', 'Yes', 'any', 'Lunch', '["Vegetarian","Pescatarian","Kosher"]', 'Couples Only', 'Women Only', 18, 24, 'Gay', 'Smart', 'Outdoor', 'Sofa And/or Chairs', '10', '15', '2', '75', '98999004500', 'Along with helpful travel instructions to help them get to your place.', 200, 1, NULL, NULL),
(3, 2, 'Dinner Party By naseem', 'Along with helpful travel instructions to help them get to your place.', '08/22/2017', '02:45:00', '09:30:00', 'Noida', 'Noida', 'IN', '110009', 'India', 'Alcohol Ok', '3 Courses', 'Yes', 'any', 'Lunch', '["Vegetarian","Kosher"]', 'Singles Only', 'Men Only', 18, 22, 'Straight', 'Smart', 'Outdoor', 'Misc. Incl Sitting On Floor', '6', '10', '2', '50', '11222002211', 'Along with helpful travel instructions to help them get to your place.', 150, 1, NULL, NULL);

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
(2, 'Faq 1', 'fdgfdgfdgfdgfd', 1, NULL, NULL),
(3, 'Faq 2', 'fdgfdgfdgfdgfd', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `followed_users`
--

CREATE TABLE `followed_users` (
  `id` int(10) UNSIGNED NOT NULL,
  `follower_id` int(11) NOT NULL,
  `followed_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `followed_users`
--

INSERT INTO `followed_users` (`id`, `follower_id`, `followed_id`, `created_at`, `updated_at`) VALUES
(16, 1, 2, NULL, NULL),
(18, 1, 5, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `follows`
--

CREATE TABLE `follows` (
  `id` int(10) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Table structure for table `invitefriends`
--

CREATE TABLE `invitefriends` (
  `id` int(10) UNSIGNED NOT NULL,
  `transaction_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qty` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_price` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invitefriends`
--

INSERT INTO `invitefriends` (`id`, `transaction_id`, `user_id`, `name`, `email`, `price`, `qty`, `event_id`, `total_price`, `created_at`, `updated_at`) VALUES
(1, 19, 1, 'Ravi Verma', 'anaseem711@gmail.com', '206.25', '3', '1', '618.75', '2017-08-04 05:38:01', '2017-08-04 06:10:25');

-- --------------------------------------------------------

--
-- Table structure for table `invite_users`
--

CREATE TABLE `invite_users` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invite_users`
--

INSERT INTO `invite_users` (`id`, `user_id`, `friend_id`, `event_id`, `transaction_id`, `created_at`, `updated_at`) VALUES
(1, 1, '5', '1', '20', '2017-08-04 02:38:53', '2017-08-08 08:20:47'),
(2, 1, '5', '2', '21', '2017-08-04 05:38:48', '2017-08-04 06:31:22');

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
(1, 'how are you ?', 0, 0, 0, 1, 2, '2017-07-26 18:30:00', '2017-07-26 18:30:00'),
(2, 'fine', 0, 0, 0, 2, 1, '2017-07-27 05:32:40', '2017-07-27 05:32:40'),
(3, 'what are you doing?', 0, 0, 0, 1, 2, '2017-07-27 05:33:33', '2017-07-27 05:33:33'),
(4, 'nothing special', 0, 0, 0, 2, 1, '2017-07-27 05:40:30', '2017-07-27 05:40:30'),
(5, 'gdfgfdgfdg', 0, 0, 0, 2, 2, '2017-07-27 07:19:27', '2017-07-27 07:19:27'),
(6, 'what are you saying..', 0, 0, 0, 1, 2, '2017-07-27 07:21:29', '2017-07-27 07:21:29'),
(7, 'ok', 0, 0, 0, 2, 2, '2017-07-28 00:45:31', '2017-07-28 00:45:31'),
(8, 'okkk', 0, 0, 0, 2, 2, '2017-07-28 23:33:41', '2017-07-28 23:33:41'),
(9, 'hi', 0, 0, 0, 1, 2, '2017-08-02 06:27:02', '2017-08-02 06:27:02'),
(10, 'sdgfdhgf df gfdgdf fgfhdgklfd  fghfkdjg  jklgfdg h fhdgfjkdgh hjkhj  jkhgfdkjgh kjhkjh hjkhfgd fgfdg f gdgfh khkh khkhkj kjhkjh hjkhjk jkhjkhfdg   kjfhgkfdjgh  gfkdghfkd hgjkdfgh fgdfdkjgh     jkfghk fd  fdghfdkj', 0, 0, 0, 1, 2, '2017-08-02 06:27:36', '2017-08-02 06:27:36');

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
(21, '2017_07_12_085447_create_seos_table', 12),
(22, '2017_07_12_092903_create_events_table', 12),
(23, '2017_07_14_112948_create_transactions_table', 13),
(24, '2017_07_17_085745_create_friends_table', 14),
(25, '2017_07_17_093511_create_reviews_table', 15),
(26, '2015_10_05_110608_create_messages_table', 16),
(27, '2015_10_05_110622_create_conversations_table', 16),
(28, '2017_07_20_074156_create_invitefriends_table', 17),
(29, '2017_07_19_050957_create_followed_users_table', 18),
(30, '2017_07_21_072117_create_follows_table', 18),
(31, '2017_07_19_071653_create_contacts_table', 19),
(32, '2017_07_21_051140_create_charity_password_resets_table', 19),
(33, '2017_07_21_122412_create_invite_users_table', 19),
(34, '2017_07_22_120317_create_charity_reports_table', 19),
(35, '2017_07_26_084246_create_charity_transaction_reports_table', 19),
(36, '2017_07_29_115116_create_tickets_table', 20),
(38, '2017_08_01_120141_create_notifications_table', 21),
(39, '2017_08_10_053301_create_account_closes_table', 22);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `another_user` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `notification` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_id` int(11) NOT NULL,
  `notification_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_seen` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `another_user`, `notification`, `event_id`, `notification_type`, `is_seen`, `created_at`, `updated_at`) VALUES
(1, 5, '2', '<strong>Naseem</strong> invited you to his <strong>Dinner Party By naseem</strong> Gathering', 3, 'invite', 1, '2017-08-04 00:38:26', '2017-08-04 08:22:20'),
(2, 5, '2', '<strong>Naseem</strong> invited you to his <strong>Dinner Party By naseem</strong> Gathering', 3, 'invite', 1, '2017-08-04 00:38:01', '2017-08-04 08:22:20'),
(3, 5, '1', '<strong>Prashant</strong> invited you to his <strong>Dinner Party</strong> Gathering', 1, 'invite', 1, '2017-08-04 00:38:44', '2017-08-04 08:22:20'),
(4, 5, '1', '<strong>Prashant</strong> invited you to his <strong>Dinner Party</strong> Gathering', 1, 'invite', 1, '2017-08-04 02:38:53', '2017-08-04 08:22:20'),
(5, 5, '1', '<strong>Prashant</strong> invited you to his <strong>Lunch Party</strong> Gathering', 2, 'invite', 1, '2017-08-04 05:38:48', '2017-08-04 08:22:20');

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

CREATE TABLE `offers` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rule` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `offers`
--

INSERT INTO `offers` (`id`, `title`, `rule`, `from_date`, `to_date`, `status`, `created_at`, `updated_at`) VALUES
(2, 'TENDISCOUNT', '10', '2017-07-09', '2017-07-13', 1, NULL, '2017-07-11 06:12:07'),
(3, 'TWODISCOUNT', '5', '2017-07-01', '2017-07-26', 1, NULL, '2017-07-11 06:12:26');

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
('naseembca1990@gmail.com', '$2y$10$hRfJdM9UX4CajBegF/KICOuot6Dz02lfqwT5zBRUtn/W.oaCt0oVC', '2017-07-05 06:26:40'),
('anaseem711@gmail.com', '$2y$10$uUnkkZh5aS265YpG5y0oU.gBYg/jOu/k/Ot61VKEMRK2YMHuXGCPO', '2017-07-12 01:05:17');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(10) UNSIGNED NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reply_id` int(11) NOT NULL,
  `event` varchar(199) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rating` varchar(199) COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `review` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `post_id`, `user_id`, `reply_id`, `event`, `rating`, `review`, `status`, `created_at`, `updated_at`) VALUES
(4, 2, 2, 0, '1', '1', '12 I just had the same problem and solved it in a generic way. If you create an item it uses the default rules I just had the same problem and solved it in a generic way. If you create an item it uses the default rules I just had the same problem and solved it in a generic way. If you create an item it uses the default rules I just had the same problem and solved it in a generic way. If you create an item it uses the default rules I just had the same problem and solved it in a generic way. If you create an item it uses the default rules 12345', 0, '2017-07-04 18:30:00', '2017-07-19 05:18:08'),
(5, 5, 2, 0, '1', '3.49', '000 I just had the same problem and solved it in a generic way. If you create an item it uses the default rules I just had the same problem and solved it in a generic way. If you create an item it uses the default rules I just had the same problem and solved it in a generic way. If you create an item it uses the default rules I just had the same problem and solved it in a generic way.', 0, '2017-07-26 18:30:00', '2017-07-19 05:17:39'),
(8, 2, 2, 4, '1', '0', 'rtytntuyierbtbyynuyiyo', 0, NULL, NULL),
(9, 5, 2, 5, 'Give A Dinner Party', '0', 'it in a generic way. If you create an item it uses the default rules I just had the same problem and solved it in a generic way', 0, '2017-07-19 03:37:38', NULL);

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

--
-- Dumping data for table `seos`
--

INSERT INTO `seos` (`id`, `url`, `title`, `keyword`, `description`, `created_at`, `updated_at`) VALUES
(1, 'http://localhost/giveadinnerparty/public', 'My Account', 'my account keyword', 'description', NULL, '2017-07-12 23:57:41'),
(2, 'http://localhost/giveadinnerparty/public/user/edit_profile', 'edit profile', 'edit profile key', 'edit profile desc', NULL, NULL);

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
(1, 1, '1959063524377417', 'https://www.facebook.com/app_scoped_user_id/1959063524377417/', NULL, NULL),
(6, 2, '1539889042740095', 'https://www.facebook.com/app_scoped_user_id/1539889042740095/', NULL, NULL),
(7, 5, '1539889042740095', 'https://www.facebook.com/app_scoped_user_id/1539889042740095/', NULL, NULL),
(9, 8, '1539889042740095', 'https://www.facebook.com/app_scoped_user_id/1539889042740095/', NULL, NULL);

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
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` int(10) UNSIGNED NOT NULL,
  `event_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ticket_price` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `charity_id` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `charity_cut` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `booking_fee` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `final_amount` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cancel` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'no',
  `purchase` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'no',
  `user_type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `event_id`, `transaction_id`, `user_id`, `ticket_price`, `qty`, `charity_id`, `charity_cut`, `booking_fee`, `final_amount`, `status`, `cancel`, `purchase`, `user_type`, `created_at`, `updated_at`) VALUES
(1, '1', '13', '5', '200', 1, '2', '50', '6.25', '206.25', 'refaund', 'no', 'no', 'user', '2017-08-04 03:38:34', '2017-08-08 05:13:05'),
(2, '2', '19', 'anaseem711@gmail.com', '200', 1, '2', '50', '6.25', '206.25', 'approve', 'no', 'no', 'friend', '2017-08-04 05:38:03', NULL),
(3, '2', '21', '1', '200', 1, '2', '75', '6.25', '206.25', 'approve', 'no', 'no', 'friend', '2017-08-04 06:38:20', '2017-08-08 05:13:19'),
(4, '1', '21', '2', '200', 1, '2', '75', '6.25', '206.25', 'unapprove', 'no', 'no', 'friend', '2017-08-04 06:38:23', '2017-08-08 05:13:24'),
(10, '2', NULL, '2', '200', 1, '2', '75', '6.25', '206.25', 'approve', 'no', 'no', 'user', '2017-08-10 04:38:13', NULL);

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

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `payKey`, `transaction_id`, `user_id`, `event_id`, `amount`, `status`, `created_at`, `updated_at`) VALUES
(13, 'AP-65L26431NR867594R', '8WH61440MD808444P', '5', '2', '200', 'COMPLETED', NULL, '2017-08-04 06:32:23'),
(19, 'AP-3SP60904KK799074N', '2LF38255GH597262Y', 'anaseem711@gmail.com', '1', '200', 'COMPLETED', NULL, '2017-08-04 06:11:03'),
(20, 'AP-49G47559BR040315L', '', '5', '1', '200', '', NULL, NULL);

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
(1, '5', '1499691846Hydrangeas.jpg', 0, NULL, NULL),
(2, '5', '1499692015Desert.jpg', 0, NULL, NULL),
(3, '2', '1499768443Chrysanthemum.jpg', 0, NULL, NULL);

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
  `paypal_confirm` int(11) NOT NULL DEFAULT '0',
  `photos` text COLLATE utf8mb4_unicode_ci,
  `id_proof` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approve_id` int(11) NOT NULL DEFAULT '0',
  `address_proof` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `approve_address` int(11) NOT NULL DEFAULT '0',
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

INSERT INTO `users` (`id`, `name`, `email`, `password`, `last_name`, `dob`, `status`, `gender`, `ethnicity`, `sexuality`, `telephone`, `address`, `town`, `county`, `country`, `postcode`, `spoken_languages`, `hosting_option`, `notifications`, `invites`, `about`, `hobbies`, `profession`, `education`, `religion`, `paypal_fname`, `paypal_lname`, `paypal_email`, `paypal_confirm`, `photos`, `id_proof`, `approve_id`, `address_proof`, `approve_address`, `confirmed`, `confirmation_code`, `is_disabled`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Prashant', 'prashant2621993@live.com', '$2y$10$k0hV3jWQmyhiYgKHtJRjwexw3MadoOZ4BPP.RJryGt7zwrrl9.P/m', 'sefgfh', '07/13/2017', NULL, 'Male', NULL, NULL, NULL, 'H.No. 217, Okhla 1', 'Delhi', 'county', 'India', '110001', NULL, NULL, NULL, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.', '["Socialising & Friendship","Dating","Travel & Culture","Kids & Parenting","Charity & Fundraising","Religion & Spirituality","Meditation, Yoga & Healing","Board Games","Crafts & Hobbies"]', NULL, NULL, NULL, NULL, NULL, 'testmail0987654@gmail.com', 1, '0', NULL, 1, NULL, 0, 1, NULL, 0, 'S7eWmIotc0Zvzh1CBNchUakiaZgM7JbHJmjy3VnPqSvUMiPjN43N0hQZ2Dib', '2017-06-30 16:23:13', '2017-08-02 06:26:48'),
(2, 'Naseem', 'anaseem711@gmail.com', '$2y$10$6rVxHMcq81qH2qWmmKDuo.UhGDW2SrdlgrWlkwFk8hqdctjADaTXC', 'ahmad', '07/05/90', 'Not Specified', 'Female', 'Chinese', 'Lesbian', '9899004510', 'H.No. 217, Okhla 1', 'Delhi 2 ok', 'county 3', 'India 4', '110009', '["Arabic","Bengali","Czech","Dutch","French","Mandarin","Punjabi","Romanian","Swedish","Thai"]', '', NULL, NULL, 'You can add multiple-column unique indexes via phpMyAdmin.', '["Socialising & Friendship","Dating","Travel & Culture","Charity & Fundraising","Religion & Spirituality","Video Games","Card Games","Art & Antiques"]', 'php developer', 'bca', 'testing', '$2y$10$WBEDCFhAfcF2o0tpBTYIhe7ZtMLS20KA08QiIG4Hski.Hsfm.vCkm', NULL, 'testmail0987654@gmail.com', 1, '1', '1499859467Tulips.jpg', 1, '1499859461Tulips.jpg', 0, 1, '35467874323456789', 0, 'EALPiocrCx60kWYiuPMB57FdxQMFQlXNWOa30E5KIpIUtKbVF2EPAB1syKi2', '2017-07-04 18:30:00', '2017-08-03 06:18:36'),
(3, 'Rahul', 'phpdeveloper7@gmail.com', '$2y$10$7jnxL9SDOTY7oR8P6dPXW.fNAMODkKUdrYDM2VSUt2Mkb6Pjq6EHi', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, NULL, 0, 0, NULL, 0, 'CZWkG9pZuy2So6MwJDsFYeY1hLoDpQHpphd1dJCzThjbfh645aE8bAWaXn1i', '2017-07-10 01:59:47', '2017-07-10 01:59:47'),
(4, 'Arun', 'phpdeveloper71@gmail.com', '$2y$10$S/O2PeyjGDZ/JBsHvjseL.2QnItbBLnpufBBZ.5TcO9cU0HM/fI6G', NULL, '3/5/1990', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, NULL, 0, 0, '2497563081', 0, 'RbbjkibSegGkB5X96uG0UpQPPL3buWZZPJSiJNO0zR6vejJ889LP9Ahhn77I', '2017-07-10 02:11:41', '2017-07-10 02:11:41'),
(5, 'Praveen', 'phpdeveloper70@gmail.com', '$2y$10$1kxSA.mr48dAbzdlAfDKtOSJnsVc5n9j1pBmCrDxAaiUAH76mgE3.', NULL, '3/5/1990', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', NULL, NULL, NULL, NULL, 'sadfgfdggdfg fdgfdgfdgfd  fdgfdgfdgfd  fgdfdg', '["Socialising & Friendship","Dating","Travel & Culture","Kids & Parenting"]', NULL, NULL, NULL, NULL, NULL, NULL, 0, '1', NULL, 0, NULL, 0, 1, '8031925476', 0, 'AUrsJQokqgkDMlR7z7ew1I4KC62eFkjhpjTy9WTttw6GTuSnozmcmMUFI2dx', '2017-07-10 02:16:22', '2017-08-04 06:34:23'),
(7, 'Naseem Ahmad', 'naseembca19901@gmail.com', '$2y$10$S/O2PeyjGDZ/JBsHvjseL.2QnItbBLnpufBBZ.5TcO9cU0HM/fI6G', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, NULL, 0, 1, NULL, 0, '9G7bzywtnONj4im8UGNu8QkncI2aj1sYMbS44rkkhINeW4gSgnUa87wbxZVO', '2017-07-12 07:52:54', '2017-07-12 07:52:54'),
(8, 'Naseem', 'naseembca1990@gmail.com', '$2y$10$CyQ5G8ER2ruSH9c7CwZht.Spmg3qcMWn0t.zm/36Hs6xo5qwSK3sG', 'Ahmad', '07/19/2017', NULL, 'Male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, 0, NULL, 0, 1, NULL, 0, NULL, '2017-07-12 08:42:13', '2017-07-19 05:28:47');

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
-- Indexes for table `account_closes`
--
ALTER TABLE `account_closes`
  ADD PRIMARY KEY (`id`);

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
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `charity_password_resets`
--
ALTER TABLE `charity_password_resets`
  ADD KEY `charity_password_resets_email_index` (`email`),
  ADD KEY `charity_password_resets_token_index` (`token`);

--
-- Indexes for table `charity_reports`
--
ALTER TABLE `charity_reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `charity_transaction_reports`
--
ALTER TABLE `charity_transaction_reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cms`
--
ALTER TABLE `cms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
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
-- Indexes for table `followed_users`
--
ALTER TABLE `followed_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `follows`
--
ALTER TABLE `follows`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_index` (`user_id`,`friend_id`);

--
-- Indexes for table `invitefriends`
--
ALTER TABLE `invitefriends`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invite_users`
--
ALTER TABLE `invite_users`
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
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
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
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
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
-- AUTO_INCREMENT for table `account_closes`
--
ALTER TABLE `account_closes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `charity_reports`
--
ALTER TABLE `charity_reports`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `charity_transaction_reports`
--
ALTER TABLE `charity_transaction_reports`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `cms`
--
ALTER TABLE `cms`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=246;
--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `followed_users`
--
ALTER TABLE `followed_users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `follows`
--
ALTER TABLE `follows`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `invitefriends`
--
ALTER TABLE `invitefriends`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `invite_users`
--
ALTER TABLE `invite_users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;
--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `seos`
--
ALTER TABLE `seos`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `social_logins`
--
ALTER TABLE `social_logins`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
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
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT for table `userimages`
--
ALTER TABLE `userimages`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
