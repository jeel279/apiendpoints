create schema if not exists "public";
create table public.users
(
    user_id   serial
        constraint users_pk
            primary key,
    email     varchar not null,
    password  varchar not null,
    following jsonb,
    followers jsonb
);

alter table public.users
    owner to admin;

INSERT INTO users (user_id, email, password, following, followers) VALUES (1, 'johndoe@mail.com', '$2b$10$iVC98b44rv6Qlt/YvDv/7ONgUgEAb29exuR8UNCmbtU3jQGPymf4m', '{}', '{}');
INSERT INTO users (user_id, email, password, following, followers) VALUES (2, 'janedoe@mail.com', '$2b$10$0Z0jvHRuyhBIUeI.W69j9unxD0QhqljQgpshhJLh1pD2XYWCSxKwm', '{}', '{}');


create table public.posts
(
    id          serial
        constraint posts_pk
            primary key,
    title       varchar not null,
    description text,
    created_at  bigint  not null,
    posted_by   integer
        constraint posts_users_user_id_fk
            references public.users,
    likes       jsonb   not null
);

alter table public.posts
    owner to admin;

create table public.comments
(
    comment_id serial
        constraint comments_pk
            primary key,
    content    text not null,
    post_id    integer
        constraint comments_posts_id_fk
            references public.posts,
    user_id    integer
        constraint comments_users_user_id_fk
            references public.users
);

alter table public.comments
    owner to admin;



create schema if not exists "test";

create table test.users
(
    user_id   serial
        constraint users_pk_1
            primary key,
    email     varchar not null,
    password  varchar not null,
    following jsonb,
    followers jsonb
);

alter table test.users
    owner to admin;

INSERT INTO test.users (user_id, email, password, following, followers) VALUES (1, 'johndoe@mail.com', '$2b$10$iVC98b44rv6Qlt/YvDv/7ONgUgEAb29exuR8UNCmbtU3jQGPymf4m', '{}', '{}');
INSERT INTO test.users (user_id, email, password, following, followers) VALUES (2, 'janedoe@mail.com', '$2b$10$0Z0jvHRuyhBIUeI.W69j9unxD0QhqljQgpshhJLh1pD2XYWCSxKwm', '{}', '{}');

create table test.posts
(
    id          serial
        constraint posts_pk_1
            primary key,
    title       varchar not null,
    description text,
    created_at  bigint  not null,
    posted_by   integer
        constraint posts_users_user_id_fk_1
            references test.users,
    likes       jsonb   not null
);

alter table test.posts
    owner to admin;

create table test.comments
(
    comment_id serial
        constraint comments_pk_1
            primary key,
    content    text not null,
    post_id    integer
        constraint comments_posts_id_fk_1
            references test.posts,
    user_id    integer
        constraint comments_users_user_id_fk_1
            references test.users
);

alter table test.comments
    owner to admin;