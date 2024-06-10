CREATE TABLE IF NOT EXISTS `ambulance_invoice_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) COLLATE utf8_hungarian_ci DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

INSERT INTO `ambulance_invoice_types` (`id`, `label`, `amount`) VALUES
	(1, 'Medical Care', 670),
	(2, 'Hand breakage', 2000),
	(3, 'Leg fracture', 3000),
	(4, 'Gunshot wound care', 1650),
	(5, 'Head injury', 1340);
	
ALTER TABLE `users`
	ADD `is_dead` TINYINT(1) NULL DEFAULT '0'
;
