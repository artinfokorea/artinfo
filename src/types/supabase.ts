export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      advertisements: {
        Row: {
          created_at: string
          id: number
          image_url: string
          name: string
          redirect_url: string | null
          type: string
        }
        Insert: {
          created_at?: string
          id?: number
          image_url: string
          name: string
          redirect_url?: string | null
          type: string
        }
        Update: {
          created_at?: string
          id?: number
          image_url?: string
          name?: string
          redirect_url?: string | null
          type?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          contents: string
          created_at: string
          debate_vote: boolean | null
          id: number
          parent_comment_idd: number | null
          post_id: number
          profile_id: string
          tag: string | null
          type: Database["public"]["Enums"]["comment_type"]
        }
        Insert: {
          contents: string
          created_at?: string
          debate_vote?: boolean | null
          id?: number
          parent_comment_idd?: number | null
          post_id: number
          profile_id: string
          tag?: string | null
          type: Database["public"]["Enums"]["comment_type"]
        }
        Update: {
          contents?: string
          created_at?: string
          debate_vote?: boolean | null
          id?: number
          parent_comment_idd?: number | null
          post_id?: number
          profile_id?: string
          tag?: string | null
          type?: Database["public"]["Enums"]["comment_type"]
        }
        Relationships: [
          {
            foreignKeyName: "comments_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      concerts: {
        Row: {
          category: Database["public"]["Enums"]["concert_category"]
          contents: string
          count_of_views: number
          created_at: string
          id: number
          location: string
          performance_time: string
          poster_url: string | null
          profile_id: string
          title: string
        }
        Insert: {
          category: Database["public"]["Enums"]["concert_category"]
          contents: string
          count_of_views?: number
          created_at?: string
          id?: number
          location: string
          performance_time: string
          poster_url?: string | null
          profile_id: string
          title: string
        }
        Update: {
          category?: Database["public"]["Enums"]["concert_category"]
          contents?: string
          count_of_views?: number
          created_at?: string
          id?: number
          location?: string
          performance_time?: string
          poster_url?: string | null
          profile_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "concerts_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      debate_answers: {
        Row: {
          created_at: string | null
          debate_id: number
          debate_vote: boolean
          id: number
          profile_id: string
        }
        Insert: {
          created_at?: string | null
          debate_id: number
          debate_vote: boolean
          id?: number
          profile_id: string
        }
        Update: {
          created_at?: string | null
          debate_id?: number
          debate_vote?: boolean
          id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "debate_answers_debate_id_fkey"
            columns: ["debate_id"]
            referencedRelation: "debates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "debate_answers_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      debates: {
        Row: {
          cons_cnt: number
          count_of_views: number
          created_at: string | null
          desc: string | null
          id: number
          poster_url: string
          profile_id: string
          pros_cnt: number
          title: string
        }
        Insert: {
          cons_cnt?: number
          count_of_views?: number
          created_at?: string | null
          desc?: string | null
          id?: number
          poster_url: string
          profile_id: string
          pros_cnt?: number
          title: string
        }
        Update: {
          cons_cnt?: number
          count_of_views?: number
          created_at?: string | null
          desc?: string | null
          id?: number
          poster_url?: string
          profile_id?: string
          pros_cnt?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "debates_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      educations: {
        Row: {
          category: Database["public"]["Enums"]["education_category"]
          contents: string
          count_of_views: number
          created_at: string
          id: number
          profile_id: string
          title: string
        }
        Insert: {
          category: Database["public"]["Enums"]["education_category"]
          contents: string
          count_of_views?: number
          created_at?: string
          id?: number
          profile_id: string
          title: string
        }
        Update: {
          category?: Database["public"]["Enums"]["education_category"]
          contents?: string
          count_of_views?: number
          created_at?: string
          id?: number
          profile_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "educations_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      feeds: {
        Row: {
          category: Database["public"]["Enums"]["feed_category"] | null
          content: string
          count_of_comments: number
          count_of_likes: number
          count_of_views: number
          created_at: string | null
          id: number
          image_urls: string[] | null
          profile_id: string
          title: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["feed_category"] | null
          content: string
          count_of_comments?: number
          count_of_likes?: number
          count_of_views?: number
          created_at?: string | null
          id?: number
          image_urls?: string[] | null
          profile_id: string
          title?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["feed_category"] | null
          content?: string
          count_of_comments?: number
          count_of_likes?: number
          count_of_views?: number
          created_at?: string | null
          id?: number
          image_urls?: string[] | null
          profile_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feeds_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      freedoms: {
        Row: {
          contents: string
          count_of_comments: number
          created_at: string | null
          id: number
          profile_id: string
          title: string
        }
        Insert: {
          contents: string
          count_of_comments?: number
          created_at?: string | null
          id?: number
          profile_id: string
          title: string
        }
        Update: {
          contents?: string
          count_of_comments?: number
          created_at?: string | null
          id?: number
          profile_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "freedoms_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      inquiries: {
        Row: {
          contents: string
          created_at: string | null
          email: string | null
          id: number
          title: string
        }
        Insert: {
          contents: string
          created_at?: string | null
          email?: string | null
          id?: number
          title: string
        }
        Update: {
          contents?: string
          created_at?: string | null
          email?: string | null
          id?: number
          title?: string
        }
        Relationships: []
      }
      issues: {
        Row: {
          category: Database["public"]["Enums"]["issue_category"]
          contents: string
          count_of_views: number
          created_at: string | null
          id: number
          profile_id: string | null
          title: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["issue_category"]
          contents: string
          count_of_views?: number
          created_at?: string | null
          id?: number
          profile_id?: string | null
          title: string
        }
        Update: {
          category?: Database["public"]["Enums"]["issue_category"]
          contents?: string
          count_of_views?: number
          created_at?: string | null
          id?: number
          profile_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "issues_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      job_positions: {
        Row: {
          amount: number | null
          created_at: string | null
          id: number
          job_id: number
          position_1depth_category: Database["public"]["Enums"]["art_organization_category"]
          position_2depth_category: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: number
          job_id: number
          position_1depth_category: Database["public"]["Enums"]["art_organization_category"]
          position_2depth_category?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: number
          job_id?: number
          position_1depth_category?: Database["public"]["Enums"]["art_organization_category"]
          position_2depth_category?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_positions_job_id_fkey"
            columns: ["job_id"]
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          }
        ]
      }
      jobs: {
        Row: {
          address: string
          attachements: Json[] | null
          coordinate: string[]
          count_of_views: number | null
          created_at: string | null
          duedate: string | null
          etc: string | null
          id: number
          is_active: boolean
          job_detail: string | null
          organization_id: number
          poster_images: string[] | null
          process: string | null
          qualification: string | null
          required_documents: string | null
          start_date: string | null
          submission_email: string | null
          submission_website: string | null
          title: string
          working_conditions: string | null
        }
        Insert: {
          address: string
          attachements?: Json[] | null
          coordinate: string[]
          count_of_views?: number | null
          created_at?: string | null
          duedate?: string | null
          etc?: string | null
          id?: number
          is_active?: boolean
          job_detail?: string | null
          organization_id: number
          poster_images?: string[] | null
          process?: string | null
          qualification?: string | null
          required_documents?: string | null
          start_date?: string | null
          submission_email?: string | null
          submission_website?: string | null
          title: string
          working_conditions?: string | null
        }
        Update: {
          address?: string
          attachements?: Json[] | null
          coordinate?: string[]
          count_of_views?: number | null
          created_at?: string | null
          duedate?: string | null
          etc?: string | null
          id?: number
          is_active?: boolean
          job_detail?: string | null
          organization_id?: number
          poster_images?: string[] | null
          process?: string | null
          qualification?: string | null
          required_documents?: string | null
          start_date?: string | null
          submission_email?: string | null
          submission_website?: string | null
          title?: string
          working_conditions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_organization_id_fkey"
            columns: ["organization_id"]
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          }
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: number
          profile_id: string
          table_id: number
          type: Database["public"]["Enums"]["table_type"]
        }
        Insert: {
          created_at?: string | null
          id?: number
          profile_id: string
          table_id: number
          type: Database["public"]["Enums"]["table_type"]
        }
        Update: {
          created_at?: string | null
          id?: number
          profile_id?: string
          table_id?: number
          type?: Database["public"]["Enums"]["table_type"]
        }
        Relationships: [
          {
            foreignKeyName: "likes_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      messages: {
        Row: {
          content: string | null
          created_at: string
          from_user: string
          id: number
          room_id: string
          to_user: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          from_user: string
          id?: number
          room_id: string
          to_user: string
        }
        Update: {
          content?: string | null
          created_at?: string
          from_user?: string
          id?: number
          room_id?: string
          to_user?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_from_user_fkey"
            columns: ["from_user"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_to_user_fkey"
            columns: ["to_user"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      notices: {
        Row: {
          contents: string
          count_of_views: number
          created_at: string | null
          id: number
          profile_id: string | null
          title: string
        }
        Insert: {
          contents: string
          count_of_views?: number
          created_at?: string | null
          id?: number
          profile_id?: string | null
          title: string
        }
        Update: {
          contents?: string
          count_of_views?: number
          created_at?: string | null
          id?: number
          profile_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notices_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      organizations: {
        Row: {
          address: string | null
          coordinate: string[] | null
          created_at: string | null
          desc: string | null
          email: string | null
          id: number
          logo_image: string | null
          name: string
          phone: string | null
          site: string | null
        }
        Insert: {
          address?: string | null
          coordinate?: string[] | null
          created_at?: string | null
          desc?: string | null
          email?: string | null
          id?: number
          logo_image?: string | null
          name: string
          phone?: string | null
          site?: string | null
        }
        Update: {
          address?: string | null
          coordinate?: string[] | null
          created_at?: string | null
          desc?: string | null
          email?: string | null
          id?: number
          logo_image?: string | null
          name?: string
          phone?: string | null
          site?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          alarm_recruit: boolean | null
          article_cnt: number | null
          comment_cnt: number | null
          created_at: string
          email: string
          fcm_web_token: string | null
          grade: Database["public"]["Enums"]["user_type"]
          icon_image_url: string | null
          id: string
          intro: string | null
          major: Database["public"]["Enums"]["major_category"] | null
          name: string
          school: string | null
        }
        Insert: {
          alarm_recruit?: boolean | null
          article_cnt?: number | null
          comment_cnt?: number | null
          created_at?: string
          email: string
          fcm_web_token?: string | null
          grade?: Database["public"]["Enums"]["user_type"]
          icon_image_url?: string | null
          id: string
          intro?: string | null
          major?: Database["public"]["Enums"]["major_category"] | null
          name: string
          school?: string | null
        }
        Update: {
          alarm_recruit?: boolean | null
          article_cnt?: number | null
          comment_cnt?: number | null
          created_at?: string
          email?: string
          fcm_web_token?: string | null
          grade?: Database["public"]["Enums"]["user_type"]
          icon_image_url?: string | null
          id?: string
          intro?: string | null
          major?: Database["public"]["Enums"]["major_category"] | null
          name?: string
          school?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recruits: {
        Row: {
          art_organization_category:
            | Database["public"]["Enums"]["art_organization_category"]
            | null
          category: Database["public"]["Enums"]["recruit_category"]
          company_name: string
          contents: string
          count_of_views: number
          created_at: string
          id: number
          isActive: boolean
          obri_category: Database["public"]["Enums"]["obri_category"] | null
          profile_id: string
          religion_category:
            | Database["public"]["Enums"]["religion_category"]
            | null
          title: string
        }
        Insert: {
          art_organization_category?:
            | Database["public"]["Enums"]["art_organization_category"]
            | null
          category: Database["public"]["Enums"]["recruit_category"]
          company_name?: string
          contents: string
          count_of_views?: number
          created_at?: string
          id?: number
          isActive?: boolean
          obri_category?: Database["public"]["Enums"]["obri_category"] | null
          profile_id: string
          religion_category?:
            | Database["public"]["Enums"]["religion_category"]
            | null
          title: string
        }
        Update: {
          art_organization_category?:
            | Database["public"]["Enums"]["art_organization_category"]
            | null
          category?: Database["public"]["Enums"]["recruit_category"]
          company_name?: string
          contents?: string
          count_of_views?: number
          created_at?: string
          id?: number
          isActive?: boolean
          obri_category?: Database["public"]["Enums"]["obri_category"] | null
          profile_id?: string
          religion_category?:
            | Database["public"]["Enums"]["religion_category"]
            | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "recruits_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_user_permission: {
        Args: {
          user_id: string
          permission: Database["public"]["Enums"]["user_type"]
        }
        Returns: boolean
      }
      get_advertisement_banners: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          id: number
          image_url: string
          name: string
          redirect_url: string | null
          type: string
        }[]
      }
      get_advertisement_posters: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string
          id: number
          image_url: string
          name: string
          redirect_url: string | null
          type: string
        }[]
      }
      get_feed: {
        Args: {
          feed_id: number
        }
        Returns: {
          id: number
          category: Database["public"]["Enums"]["feed_category"]
          title: string
          content: string
          image_urls: string[]
          profile_id: string
          created_at: string
          like: boolean
          profiles: Json
        }[]
      }
      get_jobs: {
        Args: {
          position_1depth: string
          position_2depths: string[]
          limit_count: number
        }
        Returns: {
          id: number
          title: string
          poster_images: string[]
          address: string
          start_date: string
          duedate: string
          created_at: string
          organizations: Json
          job_positions: Json
        }[]
      }
      get_posts: {
        Args: {
          item_count: number
          page_number: number
        }
        Returns: {
          id: number
          category: Database["public"]["Enums"]["feed_category"]
          title: string
          content: string
          image_urls: string[]
          profile_id: string
          created_at: string
          like: boolean
          profiles: Json
        }[]
      }
    }
    Enums: {
      art_organization_category:
        | "ORCHESTRA"
        | "CHORUS"
        | "ADMINISTRATION"
        | "ETC"
        | "UNIVERSITY"
        | "RELIGION"
        | "KOREAN_MUSIC"
      chorus_category:
        | "CONDUCTOR"
        | "SOPRANO"
        | "ALTO"
        | "TENOR"
        | "BASS"
        | "ACCOMPANIST"
      comment_type:
        | "ISSUE"
        | "RECRUIT"
        | "CONCERT"
        | "EDUCATION"
        | "NOTICE"
        | "DEBATE"
        | "FREEDOM"
        | "POST"
      concert_category: "ORCHESTRA" | "CHORUS" | "ENSEMBLE" | "SOLO" | "ETC"
      education_category: "CONCOURS" | "LESSON" | "SEMINAR"
      feed_category: "INFORMATION" | "REVIEW" | "QUESTION" | "RECRUIT"
      issue_category: "FREE" | "NEWS" | "ISSUE" | "REVIEW"
      korean_music_category: "CONDUCTOR" | "CONCERT_MASTER"
      major_category:
        | "CONDUCT"
        | "VOCAL"
        | "VIOLIN"
        | "VIOLA"
        | "CELLO"
        | "DOUBLE_BASS"
        | "FLUTE"
        | "OBOE"
        | "CLARINET"
        | "BASSOON"
        | "HORN"
        | "TRUMPET"
        | "TROMBONE"
        | "TUBA"
        | "PERCUSSION"
        | "PIANO"
        | "ORGAN"
        | "HARP"
        | "COMPOSITION"
        | "ACCOMPANIMENT"
      obri_category:
        | "CONDUCTOR"
        | "SOPRANO"
        | "ALTO"
        | "TENOR"
        | "BASS"
        | "VIOLIN"
        | "VIOLA"
        | "CELLO"
        | "DOUBLE_BASS"
        | "FLUTE"
        | "OBOE"
        | "CLARINET"
        | "BASSOON"
        | "HORN"
        | "TRUMPET"
        | "TROMBONE"
        | "TUBA"
        | "PERCUSSION"
        | "PIANO"
        | "ORGAN"
        | "HARP"
      orchestra_category:
        | "CONDUCTOR"
        | "VIOLIN"
        | "VIOLA"
        | "CELLO"
        | "DOUBLE_BASS"
        | "FLUTE"
        | "OBOE"
        | "CLARINET"
        | "BASSOON"
        | "HORN"
        | "TRUMPET"
        | "TROMBONE"
        | "TUBA"
        | "PERCUSSION"
        | "HARP"
        | "COMPOSITION"
      recruit_category:
        | "ART_ORGANIZATION"
        | "RELIGION"
        | "ETC"
        | "OBRI"
        | "TEACHER"
        | "ART_ORGANIZATION_YOUTH"
        | "ART_ORGANIZATION_ADULT"
      religion_category: "CONDUCTOR" | "ACCOMPANIMENT" | "VOCAL" | "INSTRUMENT"
      table_type:
        | "POST"
        | "NOTICE"
        | "CONCERT"
        | "RECRUIT"
        | "JOB"
        | "COMMENT"
        | "FEED"
      user_type: "MASTER" | "EXPERT" | "ARTIST" | "BASIC"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
