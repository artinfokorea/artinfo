* Supabase Env
SUPABASE_URL="https://ycuajmirzlqpgzuonzca.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdWFqbWlyemxxcGd6dW9uemNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ3MjU2ODIsImV4cCI6MjAwMDMwMTY4Mn0.Nsygzmv7jGh6Il8rg3XEvfoCiUU3h4Eb0h5uVXU-mnM"
SUPABASE_STROAGE_PREFIX_URL="https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/"

* Supabase Env Local
SUPABASE_URL="http://localhost:54321"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
SUPABASE_STROAGE_PREFIX_URL="http://localhost:54321/storage/v1/object/public/artinfo/"


* Supabase Cli: Generate Types
supabase gen types typescript --linked > ./src/types/supabase.ts
supabase gen types typescript --local > ./src/types/supabase.ts
supabaee accessToken : sbp_69d81662107c791f11e1766e9a23e3b48d3108b0

* Master Env
SUPABASE_URL="https://ycuajmirzlqpgzuonzca.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljdWFqbWlyemxxcGd6dW9uemNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ3MjU2ODIsImV4cCI6MjAwMDMwMTY4Mn0.Nsygzmv7jGh6Il8rg3XEvfoCiUU3h4Eb0h5uVXU-mnM"
GTAG_ID="G-T9J2RH0SRC"
FCM_VAPID_KEY="BAmSb8SmdCYbDsckO68O9ejK4A0QONSGZTOJI0SPBM6x0LlFYrP0U8IbQXv17CeakTD28xvMelWaCUIve_LK9rI"
SUPABASE_STROAGE_PREFIX_URL="https://ycuajmirzlqpgzuonzca.supabase.co/storage/v1/object/public/artinfo/"


* FCM
curl -i --location --request POST 'http://192.168.2.77:54321/functions/v1/' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
  --header 'Content-Type: application/json' \
  --data '{"title":"Functions Test", "body": "message content"}'


* Supabase Function
  1. increment_article_cnt
    begin
      update public.profiles
      set article_cnt = article_cnt + 1
      where id = new.profile_id;
      return new;
    end;

  2. increment_comment_cnt_by_user
    begin
      update public.profiles
      set comment_cnt = comment_cnt + 1
      where id = new.profile_id;
      return new;
    end;


* 채용작성 폼
  - title
  - organization_id(단체)
  - poster_images
  - position_1depth_category: * 단수로 모집대상(포지션)
  - amount: 모집인원
  - address(근무지)
  - coordinate(좌표)
  - content: 업무내용, 자격요건, 채용절차, 제출서류, 근무조건, 우대사항, 문의사항
          등
  - duedate: 채용기한(~까지, 상시-채용완료시)
  - submission_email: 제출이메일(?)
  - attachements: 첨부파일

업무내용: job_detail
자격요건: qualification
채용절차: process
근무조건: working_conditions
기타

응시자격
전형방법
오디션여부
문의사항(이메일, 전화번호)


* 궁금한것
연주단체일경우 ORCHESTRA 말고 지휘만 모집할 경우는 없는지??