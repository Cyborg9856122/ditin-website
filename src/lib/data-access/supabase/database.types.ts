export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      inquiries: {
        Row: {
          approx_size: string | null
          budget: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          indoor_or_outdoor:
            | Database["public"]["Enums"]["placement_type"]
            | null
          name: string
          phone_whatsapp: string
          product_id: string | null
          purpose: string | null
          rent_or_buy: Database["public"]["Enums"]["rent_or_buy_choice"]
          rental_end_date: string | null
          rental_start_date: string | null
          screen_type: Database["public"]["Enums"]["product_category"] | null
          status: Database["public"]["Enums"]["inquiry_status"]
          updated_at: string
        }
        Insert: {
          approx_size?: string | null
          budget?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          indoor_or_outdoor?:
            | Database["public"]["Enums"]["placement_type"]
            | null
          name: string
          phone_whatsapp: string
          product_id?: string | null
          purpose?: string | null
          rent_or_buy: Database["public"]["Enums"]["rent_or_buy_choice"]
          rental_end_date?: string | null
          rental_start_date?: string | null
          screen_type?: Database["public"]["Enums"]["product_category"] | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          updated_at?: string
        }
        Update: {
          approx_size?: string | null
          budget?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          indoor_or_outdoor?:
            | Database["public"]["Enums"]["placement_type"]
            | null
          name?: string
          phone_whatsapp?: string
          product_id?: string | null
          purpose?: string | null
          rent_or_buy?: Database["public"]["Enums"]["rent_or_buy_choice"]
          rental_end_date?: string | null
          rental_start_date?: string | null
          screen_type?: Database["public"]["Enums"]["product_category"] | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          is_primary: boolean
          product_id: string
          sort_order: number
          storage_path: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          product_id: string
          sort_order?: number
          storage_path: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          product_id?: string
          sort_order?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_spec_values: {
        Row: {
          product_id: string
          spec_field_id: string
          value: string | null
        }
        Insert: {
          product_id: string
          spec_field_id: string
          value?: string | null
        }
        Update: {
          product_id?: string
          spec_field_id?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_spec_values_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_spec_values_spec_field_id_fkey"
            columns: ["spec_field_id"]
            isOneToOne: false
            referencedRelation: "spec_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          availability: Database["public"]["Enums"]["availability_type"]
          brightness_nits: number | null
          category: Database["public"]["Enums"]["product_category"]
          created_at: string
          created_by: string | null
          id: string
          is_placeholder: boolean
          name: string
          panel_size: string | null
          pixel_pitch_mm: number | null
          placement: Database["public"]["Enums"]["placement_type"]
          published_at: string | null
          resolution: string | null
          slug: string
          status: Database["public"]["Enums"]["product_status"]
          typical_use_case: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          availability: Database["public"]["Enums"]["availability_type"]
          brightness_nits?: number | null
          category: Database["public"]["Enums"]["product_category"]
          created_at?: string
          created_by?: string | null
          id?: string
          is_placeholder?: boolean
          name: string
          panel_size?: string | null
          pixel_pitch_mm?: number | null
          placement: Database["public"]["Enums"]["placement_type"]
          published_at?: string | null
          resolution?: string | null
          slug: string
          status?: Database["public"]["Enums"]["product_status"]
          typical_use_case?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          availability?: Database["public"]["Enums"]["availability_type"]
          brightness_nits?: number | null
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string
          created_by?: string | null
          id?: string
          is_placeholder?: boolean
          name?: string
          panel_size?: string | null
          pixel_pitch_mm?: number | null
          placement?: Database["public"]["Enums"]["placement_type"]
          published_at?: string | null
          resolution?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["product_status"]
          typical_use_case?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      spec_fields: {
        Row: {
          created_at: string
          id: string
          label: string
          sort_order: number
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          sort_order?: number
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          sort_order?: number
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "owner" | "editor" | "viewer"
      availability_type: "rent" | "buy" | "both"
      inquiry_status: "new" | "contacted" | "quoted" | "won" | "lost"
      placement_type: "indoor" | "outdoor" | "both"
      product_category:
        | "led_wall"
        | "lcd_video_wall"
        | "commercial_display"
        | "interactive_touch"
        | "outdoor_weatherproof"
      product_status: "draft" | "published"
      rent_or_buy_choice: "rent" | "buy"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["owner", "editor", "viewer"],
      availability_type: ["rent", "buy", "both"],
      inquiry_status: ["new", "contacted", "quoted", "won", "lost"],
      placement_type: ["indoor", "outdoor", "both"],
      product_category: [
        "led_wall",
        "lcd_video_wall",
        "commercial_display",
        "interactive_touch",
        "outdoor_weatherproof",
      ],
      product_status: ["draft", "published"],
      rent_or_buy_choice: ["rent", "buy"],
    },
  },
} as const
