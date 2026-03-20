-- ================================================
-- KAMIKAZE BUTTERFLY WEDDINGS
-- PostgreSQL Database Schema
-- ================================================
 
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
 
-- ================================================
-- ENUMS
-- ================================================
 
CREATE TYPE user_role AS ENUM (
  'client',
  'vendor',
  'admin'
);
 
CREATE TYPE plan_status AS ENUM (
  'planning',
  'completed',
  'cancelled'
);
 
CREATE TYPE checklist_category AS ENUM (
  'venue',
  'catering',
  'cake',
  'photography',
  'videography',
  'flowers',
  'decor',
  'invitations',
  'makeup',
  'outfits',
  'entertainment',
  'officiant'
);
 
CREATE TYPE checklist_status AS ENUM (
  'pending',
  'in_progress',
  'complete'
);
 
CREATE TYPE service_type AS ENUM (
  'venue',
  'catering',
  'cake',
  'photography',
  'videography',
  'flowers',
  'decor',
  'invitations',
  'makeup',
  'outfits',
  'entertainment',
  'officiant'
);
 
CREATE TYPE request_status AS ENUM (
  'pending',
  'accepted',
  'rejected',
  'cancelled'
);
 
CREATE TYPE payment_status AS ENUM (
  'unpaid',
  'paid',
  'refunded'
);
 
-- ================================================
-- TABLE: users
-- Stores all users: clients, vendors, and admins
-- ================================================
 
CREATE TABLE users (
  id            UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password_hash TEXT          NOT NULL,
  role          user_role     NOT NULL DEFAULT 'client',
  created_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);
 
-- ================================================
-- TABLE: vendor_profiles
-- One vendor profile per user (vendors only)
-- ================================================
 
CREATE TABLE vendor_profiles (
  id           UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID          NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  service_type service_type  NOT NULL,
  description  TEXT,
  base_price   DECIMAL(12,2) NOT NULL DEFAULT 0,
  location     VARCHAR(200),
  is_verified  BOOLEAN       NOT NULL DEFAULT false,
  is_active    BOOLEAN       NOT NULL DEFAULT true,
  created_at   TIMESTAMP     NOT NULL DEFAULT NOW()
);
 
-- ================================================
-- TABLE: wedding_plans
-- A client's wedding plan
-- ================================================
 
CREATE TABLE wedding_plans (
  id           UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id    UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name         VARCHAR(100)  NOT NULL,
  budget       DECIMAL(12,2) NOT NULL DEFAULT 0,
  location     VARCHAR(200),
  guest_count  INTEGER       NOT NULL DEFAULT 0,
  theme        VARCHAR(100),
  wedding_date DATE,
  is_public    BOOLEAN       NOT NULL DEFAULT false,
  status       plan_status   NOT NULL DEFAULT 'planning',
  created_at   TIMESTAMP     NOT NULL DEFAULT NOW()
);
 
-- ================================================
-- TABLE: checklist_items
-- One row per planning category per wedding plan
-- ================================================
 
CREATE TABLE checklist_items (
  id         UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id    UUID              NOT NULL REFERENCES wedding_plans(id) ON DELETE CASCADE,
  category   checklist_category NOT NULL,
  status     checklist_status  NOT NULL DEFAULT 'pending',
  vendor_id  UUID              REFERENCES vendor_profiles(id) ON DELETE SET NULL,
  updated_at TIMESTAMP         NOT NULL DEFAULT NOW()
);
 
-- ================================================
-- TABLE: vendor_availability
-- Tracks which dates a vendor is available or booked
-- ================================================
 
CREATE TABLE vendor_availability (
  id        UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID    NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  date      DATE    NOT NULL,
  is_booked BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(vendor_id, date)
);
 
-- ================================================
-- TABLE: vendor_gallery
-- Photos uploaded by vendors to their profile
-- ================================================
 
CREATE TABLE vendor_gallery (
  id          UUID      PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id   UUID      NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  image_url   TEXT      NOT NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT NOW()
);
 
-- ================================================
-- TABLE: service_requests
-- A client requesting a vendor for a checklist item
-- ================================================
 
CREATE TABLE service_requests (
  id                UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id         UUID           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vendor_id         UUID           NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  plan_id           UUID           NOT NULL REFERENCES wedding_plans(id) ON DELETE CASCADE,
  checklist_item_id UUID           REFERENCES checklist_items(id) ON DELETE SET NULL,
  requested_date    DATE           NOT NULL,
  status            request_status NOT NULL DEFAULT 'pending',
  quoted_price      DECIMAL(12,2),
  created_at        TIMESTAMP      NOT NULL DEFAULT NOW()
);
 
-- ================================================
-- TABLE: invoices
-- Auto-generated when a service request is accepted
-- ================================================
 
CREATE TABLE invoices (
  id                 UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_request_id UUID           NOT NULL UNIQUE REFERENCES service_requests(id) ON DELETE CASCADE,
  amount             DECIMAL(12,2)  NOT NULL,
  payment_status     payment_status NOT NULL DEFAULT 'unpaid',
  issued_at          TIMESTAMP      NOT NULL DEFAULT NOW(),
  paid_at            TIMESTAMP
);
 
-- ================================================
-- TABLE: public_plans
-- Completed plans that clients chose to make public
-- ================================================
 
CREATE TABLE public_plans (
  id           UUID      PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id      UUID      NOT NULL UNIQUE REFERENCES wedding_plans(id) ON DELETE CASCADE,
  published_at TIMESTAMP NOT NULL DEFAULT NOW()
);
 
-- ================================================
-- INDEXES
-- Speed up common queries
-- ================================================
 
CREATE INDEX idx_wedding_plans_client    ON wedding_plans(client_id);
CREATE INDEX idx_checklist_plan          ON checklist_items(plan_id);
CREATE INDEX idx_checklist_vendor        ON checklist_items(vendor_id);
CREATE INDEX idx_vendor_profiles_user    ON vendor_profiles(user_id);
CREATE INDEX idx_vendor_availability     ON vendor_availability(vendor_id);
CREATE INDEX idx_service_requests_client ON service_requests(client_id);
CREATE INDEX idx_service_requests_vendor ON service_requests(vendor_id);
CREATE INDEX idx_service_requests_plan   ON service_requests(plan_id);
CREATE INDEX idx_invoices_request        ON invoices(service_request_id);