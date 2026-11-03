create table public.home_image_sources(id bigint generated always as identity primary key,image_url text not null,source_url text not null,photographer text not null,title text not null);
create table public.home_image_candidates(id uuid primary key default gen_random_uuid(),slot bigint not null unique,source_id bigint not null references public.home_image_sources(id),scheduled_at timestamptz not null,status text not null default 'pending' check(status in ('pending','approved','rejected')),reviewed_at timestamptz);
alter table public.home_image_sources enable row level security;alter table public.home_image_candidates enable row level security;
grant select on public.home_image_sources,public.home_image_candidates to authenticated;
create policy "Admins read home sources" on public.home_image_sources for select to authenticated using(exists(select 1 from public.admin_members where user_id=(select auth.uid())));
create policy "Admins read home queue" on public.home_image_candidates for select to authenticated using(exists(select 1 from public.admin_members where user_id=(select auth.uid())));
insert into public.home_image_sources(image_url,source_url,photographer,title) values
('https://images.pexels.com/photos/9183718/pexels-photo-9183718.jpeg?auto=compress&cs=tinysrgb&w=1600','https://www.pexels.com/photo/a-man-hiking-a-mountain-9183718/','Jordan Bergendahl','Strength through the journey'),
('https://images.pexels.com/photos/11899204/pexels-photo-11899204.jpeg?auto=compress&cs=tinysrgb&w=1600','https://www.pexels.com/photo/man-hiking-on-a-mountain-11899204/','Tanya Kash','Move with intention'),
('https://images.pexels.com/photos/20028538/pexels-photo-20028538.jpeg?auto=compress&cs=tinysrgb&w=1600','https://www.pexels.com/photo/back-view-of-man-hiking-with-backpack-20028538/','Evans Joel','Find your direction'),
('https://images.pexels.com/photos/9056593/pexels-photo-9056593.jpeg?auto=compress&cs=tinysrgb&w=1600','https://www.pexels.com/photo/a-man-praying-9056593/','Matheus Bertelli','Make room for stillness');
create function public.prepare_home_image_candidates() returns void language plpgsql security definer set search_path=public,pg_temp as $$declare current_slot bigint;target bigint;source_key bigint;n integer;begin
current_slot:=floor(extract(epoch from now())/172800);select count(*) into n from public.home_image_sources;if n=0 then return;end if;
for target in current_slot..current_slot+1 loop select id into source_key from public.home_image_sources order by id offset (target % n) limit 1;
insert into public.home_image_candidates(slot,source_id,scheduled_at) values(target,source_key,to_timestamp(target*172800)) on conflict(slot) do nothing;end loop;end$$;
revoke all on function public.prepare_home_image_candidates() from public,anon,authenticated;
create function public.review_home_image(candidate_id uuid,decision text) returns void language plpgsql security definer set search_path=public,pg_temp as $$declare c public.home_image_candidates;s public.home_image_sources;begin
if not exists(select 1 from public.admin_members where user_id=(select auth.uid())) then raise exception 'Unauthorized';end if;
if decision not in ('approved','rejected') then raise exception 'Invalid decision';end if;
select * into c from public.home_image_candidates where id=candidate_id for update;
if not found or c.status<>'pending' then raise exception 'Candidate already reviewed';end if;
select * into s from public.home_image_sources where id=c.source_id;
if decision='approved' then insert into public.atmosphere_images(storage_path,public_url,prompt,published_at) values('pexels-slot-'||c.slot,s.image_url,'Photo by '||s.photographer||' on Pexels · '||s.source_url,greatest(now(),c.scheduled_at));end if;
update public.home_image_candidates set status=decision,reviewed_at=now() where id=candidate_id;end$$;
revoke all on function public.review_home_image(uuid,text) from public,anon;grant execute on function public.review_home_image(uuid,text) to authenticated;
select cron.alter_job(jobid,active:=false) from cron.job where jobname='treksor-atmosphere-daily-check';
select cron.schedule('treksor-home-photo-approval-queue','0 * * * *','select public.prepare_home_image_candidates()');
select public.prepare_home_image_candidates();
