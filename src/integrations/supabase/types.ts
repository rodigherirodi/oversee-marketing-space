export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          manager_id: string | null
          name: string
          type: Database["public"]["Enums"]["department_type"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name: string
          type: Database["public"]["Enums"]["department_type"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          manager_id?: string | null
          name?: string
          type?: Database["public"]["Enums"]["department_type"]
        }
        Relationships: [
          {
            foreignKeyName: "departments_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active_projects_count: number | null
          address: string | null
          avatar: string | null
          birth_date: string | null
          border_color: string | null
          border_pattern: string | null
          completed_projects_count: number | null
          created_at: string
          department: Database["public"]["Enums"]["department_type"]
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          hire_date: string | null
          hours_worked_week: number | null
          id: string
          level: number | null
          name: string
          phone: string | null
          points: number | null
          position: string | null
          status: string | null
          task_completion_rate: number | null
          updated_at: string
        }
        Insert: {
          active_projects_count?: number | null
          address?: string | null
          avatar?: string | null
          birth_date?: string | null
          border_color?: string | null
          border_pattern?: string | null
          completed_projects_count?: number | null
          created_at?: string
          department?: Database["public"]["Enums"]["department_type"]
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          hire_date?: string | null
          hours_worked_week?: number | null
          id: string
          level?: number | null
          name: string
          phone?: string | null
          points?: number | null
          position?: string | null
          status?: string | null
          task_completion_rate?: number | null
          updated_at?: string
        }
        Update: {
          active_projects_count?: number | null
          address?: string | null
          avatar?: string | null
          birth_date?: string | null
          border_color?: string | null
          border_pattern?: string | null
          completed_projects_count?: number | null
          created_at?: string
          department?: Database["public"]["Enums"]["department_type"]
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          hire_date?: string | null
          hours_worked_week?: number | null
          id?: string
          level?: number | null
          name?: string
          phone?: string | null
          points?: number | null
          position?: string | null
          status?: string | null
          task_completion_rate?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          badge: string
          created_at: string | null
          date: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          badge: string
          created_at?: string | null
          date?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          badge?: string
          created_at?: string | null
          date?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_goals: {
        Row: {
          completed: boolean | null
          created_at: string
          current_value: number | null
          deadline: string | null
          description: string
          id: string
          target_date: string | null
          target_value: number | null
          title: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string
          current_value?: number | null
          deadline?: string | null
          description: string
          id?: string
          target_date?: string | null
          target_value?: number | null
          title?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string
          current_value?: number | null
          deadline?: string | null
          description?: string
          id?: string
          target_date?: string | null
          target_value?: number | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points_history: {
        Row: {
          activity: string
          created_at: string | null
          date: string | null
          id: string
          points: number
          user_id: string
        }
        Insert: {
          activity: string
          created_at?: string | null
          date?: string | null
          id?: string
          points: number
          user_id: string
        }
        Update: {
          activity?: string
          created_at?: string | null
          date?: string | null
          id?: string
          points?: number
          user_id?: string
        }
        Relationships: []
      }
      user_productivity: {
        Row: {
          active_projects: number | null
          active_streak: number | null
          avg_completion_time: number | null
          client_satisfaction: number | null
          collaboration_index: number | null
          collaborative_projects: number | null
          completed_projects: number | null
          created_at: string | null
          hours_worked_month: number | null
          id: string
          individual_projects: number | null
          innovation_score: number | null
          productivity_score: number | null
          punctuality_index: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_projects?: number | null
          active_streak?: number | null
          avg_completion_time?: number | null
          client_satisfaction?: number | null
          collaboration_index?: number | null
          collaborative_projects?: number | null
          completed_projects?: number | null
          created_at?: string | null
          hours_worked_month?: number | null
          id?: string
          individual_projects?: number | null
          innovation_score?: number | null
          productivity_score?: number | null
          punctuality_index?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_projects?: number | null
          active_streak?: number | null
          avg_completion_time?: number | null
          client_satisfaction?: number | null
          collaboration_index?: number | null
          collaborative_projects?: number | null
          completed_projects?: number | null
          created_at?: string | null
          hours_worked_month?: number | null
          id?: string
          individual_projects?: number | null
          innovation_score?: number | null
          productivity_score?: number | null
          punctuality_index?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          created_at: string
          id: string
          level: number | null
          skill: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          level?: number | null
          skill: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: number | null
          skill?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_permissions: {
        Row: {
          can_access: boolean | null
          can_admin: boolean | null
          created_at: string
          id: string
          user_id: string
          workspace_id: string
        }
        Insert: {
          can_access?: boolean | null
          can_admin?: boolean | null
          created_at?: string
          id?: string
          user_id: string
          workspace_id: string
        }
        Update: {
          can_access?: boolean | null
          can_admin?: boolean | null
          created_at?: string
          id?: string
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "team_lead" | "user"
      department_type:
        | "operacao"
        | "academy"
        | "cultura"
        | "comercial"
        | "gestao"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "manager", "team_lead", "user"],
      department_type: [
        "operacao",
        "academy",
        "cultura",
        "comercial",
        "gestao",
      ],
    },
  },
} as const
