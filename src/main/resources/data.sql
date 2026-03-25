insert into application_user (id, username,name,hashed_password,has_profile_picture,s3_file_name,profile_picture_mime_type) values ('1','user','John Normal','$2a$10$xdbKoM48VySZqVSU/cSlVeJn0Z04XCZ7KZBjUBC00eKo5uLswyOpe',false,'','');
insert into user_roles (user_id, roles) values ('1', 'USER');
insert into application_user (id, username,name,hashed_password,has_profile_picture,s3_file_name,profile_picture_mime_type) values ('2','admin','Emma Executive','$2a$10$jpLNVNeA7Ar/ZQ2DKbKCm.MuT2ESe.Qop96jipKMq7RaUgCoQedV.',FALSE,'','');
insert into user_roles (user_id, roles) values ('2', 'USER');
insert into user_roles (user_id, roles) values ('2', 'ADMIN');
