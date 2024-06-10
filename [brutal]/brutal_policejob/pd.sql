
ALTER TABLE `players` ADD COLUMN `mdt_photo` text NULL DEFAULT NULL;
ALTER TABLE `players` ADD COLUMN `mdt_notes` text NULL DEFAULT NULL;
ALTER TABLE `players` ADD COLUMN `jail_time` int NULL DEFAULT NULL;
ALTER TABLE `players` ADD COLUMN `jail_reason` text NULL DEFAULT NULL;

ALTER TABLE `player_vehicles` ADD COLUMN `mdt_photo` text NULL DEFAULT NULL;
ALTER TABLE `player_vehicles` ADD COLUMN `mdt_notes` text NULL DEFAULT NULL;

CREATE TABLE `brutal_policejob_incidents` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`title` TEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`date` TEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`creator` TEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`involveds` TEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	`content` TEXT NULL DEFAULT NULL COLLATE 'utf8_general_ci',
	PRIMARY KEY (`id`) USING BTREE
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=43
;