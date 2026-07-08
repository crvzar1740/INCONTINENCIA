CREATE TABLE `advanced_exercises_workbook` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`week` int NOT NULL DEFAULT 1,
	`exerciseId` varchar(100) NOT NULL,
	`completed` int NOT NULL DEFAULT 0,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `advanced_exercises_workbook_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emotional_guide` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` varchar(100) NOT NULL,
	`completed` int NOT NULL DEFAULT 0,
	`wellnessScore` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `emotional_guide_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `exclusive_community` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`postId` varchar(100) NOT NULL,
	`content` text,
	`groupId` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `exclusive_community_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expert_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sessionDate` timestamp,
	`expertName` varchar(255),
	`topic` varchar(255),
	`notes` text,
	`completed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `expert_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `personalized_action_protocol` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`diagnosis` text,
	`protocol` text,
	`adherence` int NOT NULL DEFAULT 0,
	`week` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `personalized_action_protocol_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `smart_shopping_checklist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` varchar(100) NOT NULL,
	`purchased` int NOT NULL DEFAULT 0,
	`price` varchar(50),
	`store` varchar(255),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `smart_shopping_checklist_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `advanced_exercises_workbook` ADD CONSTRAINT `advanced_exercises_workbook_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `emotional_guide` ADD CONSTRAINT `emotional_guide_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `exclusive_community` ADD CONSTRAINT `exclusive_community_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expert_sessions` ADD CONSTRAINT `expert_sessions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `personalized_action_protocol` ADD CONSTRAINT `personalized_action_protocol_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `smart_shopping_checklist` ADD CONSTRAINT `smart_shopping_checklist_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;