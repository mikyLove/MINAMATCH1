CREATE TABLE "candidate_interviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"candidate_id" text NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidates" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"title" text NOT NULL,
	"institution" text NOT NULL,
	"img" text,
	"exp_years" integer DEFAULT 0,
	"english" text DEFAULT '',
	"languages" text DEFAULT '[]',
	"match_rating" real DEFAULT 0,
	"skills" text DEFAULT '[]',
	"altitude_fit" real DEFAULT 0,
	"social_fit" real DEFAULT 0,
	"certified" boolean DEFAULT false,
	"warning" text,
	"is_top5" boolean DEFAULT false,
	"has_osha" boolean DEFAULT false,
	"regional_radar" text,
	"bio" text
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"response_source" text,
	"created_at" text DEFAULT 'datetime(''now'')'
);
--> statement-breakpoint
CREATE TABLE "scenario_options" (
	"id" text PRIMARY KEY NOT NULL,
	"scenario_id" text NOT NULL,
	"text" text NOT NULL,
	"description" text,
	"calma" real DEFAULT 0,
	"seguridad" real DEFAULT 0,
	"tiempo" text,
	"tolerancia_frio" real DEFAULT 0,
	"cultural_fit_seguridad" real DEFAULT 0,
	"cultural_fit_etica" real DEFAULT 0,
	"cultural_fit_innovacion" real DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "scenarios" (
	"id" text PRIMARY KEY NOT NULL,
	"stage" text,
	"stage_num" integer,
	"category" text,
	"title" text,
	"description" text,
	"image_url" text,
	"alert_text" text
);
--> statement-breakpoint
CREATE TABLE "student_syllabus" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"course_id" text NOT NULL,
	"course_name" text NOT NULL,
	"completed" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"badge" text,
	"program" text,
	"status" text DEFAULT 'EN_CURSO',
	"verification_hash" text,
	"matching_score" real DEFAULT 0,
	"retention_months" integer DEFAULT 0,
	"signing_bonus" real DEFAULT 0,
	"timestamp" text,
	"validator_node" text,
	"avatar_url" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'user',
	"avatar" text,
	"created_at" text DEFAULT 'datetime(''now'')'
);
--> statement-breakpoint
ALTER TABLE "candidate_interviews" ADD CONSTRAINT "candidate_interviews_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenario_options" ADD CONSTRAINT "scenario_options_scenario_id_scenarios_id_fk" FOREIGN KEY ("scenario_id") REFERENCES "public"."scenarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_syllabus" ADD CONSTRAINT "student_syllabus_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "email_idx" ON "users" USING btree ("email");