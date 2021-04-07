-- CREATE TABLE "user" 
-- ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
-- "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
-- "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
-- "provider" "user_provider_enum" NOT NULL DEFAULT 'local', 
-- "social_id" character varying(255), "email" character varying(255) NOT NULL, 
-- "is_verified" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), 
-- CONSTRAINT "CHK_756f5c59fa669ea2ba342f0f7e" 
-- CHECK 
-- ( COALESCE((provider = 'local')::integer, 0) + COALESCE(LENGTH(social_id::text)::boolean::integer, 0 ) = 1), 
-- CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))


-- INSERT INTO user(email, is_verified, profile) 
-- VALUES ("super_admin", true, {"admin"});
