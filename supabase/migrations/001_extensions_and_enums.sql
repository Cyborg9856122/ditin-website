-- Extensions
create extension if not exists "pgcrypto" with schema extensions;

-- Enums
create type public.app_role as enum ('owner', 'editor', 'viewer');

create type public.product_category as enum (
  'led_wall',
  'lcd_video_wall',
  'commercial_display',
  'interactive_touch',
  'outdoor_weatherproof'
);

create type public.placement_type as enum ('indoor', 'outdoor', 'both');

create type public.availability_type as enum ('rent', 'buy', 'both');

create type public.rent_or_buy_choice as enum ('rent', 'buy');

create type public.product_status as enum ('draft', 'published');

create type public.inquiry_status as enum ('new', 'contacted', 'quoted', 'won', 'lost');
