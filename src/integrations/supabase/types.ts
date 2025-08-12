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
      cliente_acessos: {
        Row: {
          atualizado_em: string | null
          categoria: string | null
          cliente_id: string
          criado_em: string | null
          id: string
          notas: string | null
          plataforma: string
          senha: string | null
          status: boolean | null
          url: string | null
          usuario: string | null
        }
        Insert: {
          atualizado_em?: string | null
          categoria?: string | null
          cliente_id: string
          criado_em?: string | null
          id?: string
          notas?: string | null
          plataforma: string
          senha?: string | null
          status?: boolean | null
          url?: string | null
          usuario?: string | null
        }
        Update: {
          atualizado_em?: string | null
          categoria?: string | null
          cliente_id?: string
          criado_em?: string | null
          id?: string
          notas?: string | null
          plataforma?: string
          senha?: string | null
          status?: boolean | null
          url?: string | null
          usuario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cliente_acessos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      cliente_anotacoes: {
        Row: {
          atualizado_em: string
          autor_id: string | null
          cliente_id: string
          conteudo: string
          criado_em: string
          id: string
        }
        Insert: {
          atualizado_em?: string
          autor_id?: string | null
          cliente_id: string
          conteudo: string
          criado_em?: string
          id?: string
        }
        Update: {
          atualizado_em?: string
          autor_id?: string | null
          cliente_id?: string
          conteudo?: string
          criado_em?: string
          id?: string
        }
        Relationships: []
      }
      cliente_contatos: {
        Row: {
          atualizado_em: string | null
          cargo: string | null
          cliente_id: string
          criado_em: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          nome: string
          observacoes: string | null
          telefone: string | null
          tipo: Database["public"]["Enums"]["contact_type"] | null
        }
        Insert: {
          atualizado_em?: string | null
          cargo?: string | null
          cliente_id: string
          criado_em?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          nome: string
          observacoes?: string | null
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["contact_type"] | null
        }
        Update: {
          atualizado_em?: string | null
          cargo?: string | null
          cliente_id?: string
          criado_em?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          nome?: string
          observacoes?: string | null
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["contact_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "cliente_contatos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      cliente_reunioes: {
        Row: {
          atualizado_em: string | null
          cliente_id: string
          criado_em: string | null
          criado_por: string | null
          data_hora: string
          duracao: number | null
          id: string
          link_gravacao: string | null
          observacoes: string | null
          participantes: string[] | null
          resumo: string | null
          tipo: string | null
          titulo: string
        }
        Insert: {
          atualizado_em?: string | null
          cliente_id: string
          criado_em?: string | null
          criado_por?: string | null
          data_hora: string
          duracao?: number | null
          id?: string
          link_gravacao?: string | null
          observacoes?: string | null
          participantes?: string[] | null
          resumo?: string | null
          tipo?: string | null
          titulo: string
        }
        Update: {
          atualizado_em?: string | null
          cliente_id?: string
          criado_em?: string | null
          criado_por?: string | null
          data_hora?: string
          duracao?: number | null
          id?: string
          link_gravacao?: string | null
          observacoes?: string | null
          participantes?: string[] | null
          resumo?: string | null
          tipo?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "cliente_reunioes_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cliente_reunioes_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          atualizado_em: string | null
          cidade: string | null
          cliente_desde: string | null
          criado_em: string | null
          descricao: string | null
          endereco: string | null
          gestor_id: string | null
          id: string
          logo_url: string | null
          nome: string
          nps_atual: number | null
          nps_atual_data: string | null
          porte: Database["public"]["Enums"]["company_size"] | null
          redes_sociais: Json | null
          segmento: string | null
          site: string | null
          status: Database["public"]["Enums"]["client_status"] | null
          tags: string[] | null
          temperatura: Database["public"]["Enums"]["client_temperature"] | null
          tipo_contrato: Database["public"]["Enums"]["contract_type"] | null
          uf: string | null
        }
        Insert: {
          atualizado_em?: string | null
          cidade?: string | null
          cliente_desde?: string | null
          criado_em?: string | null
          descricao?: string | null
          endereco?: string | null
          gestor_id?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          nps_atual?: number | null
          nps_atual_data?: string | null
          porte?: Database["public"]["Enums"]["company_size"] | null
          redes_sociais?: Json | null
          segmento?: string | null
          site?: string | null
          status?: Database["public"]["Enums"]["client_status"] | null
          tags?: string[] | null
          temperatura?: Database["public"]["Enums"]["client_temperature"] | null
          tipo_contrato?: Database["public"]["Enums"]["contract_type"] | null
          uf?: string | null
        }
        Update: {
          atualizado_em?: string | null
          cidade?: string | null
          cliente_desde?: string | null
          criado_em?: string | null
          descricao?: string | null
          endereco?: string | null
          gestor_id?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
          nps_atual?: number | null
          nps_atual_data?: string | null
          porte?: Database["public"]["Enums"]["company_size"] | null
          redes_sociais?: Json | null
          segmento?: string | null
          site?: string | null
          status?: Database["public"]["Enums"]["client_status"] | null
          tags?: string[] | null
          temperatura?: Database["public"]["Enums"]["client_temperature"] | null
          tipo_contrato?: Database["public"]["Enums"]["contract_type"] | null
          uf?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_gestor_id_fkey"
            columns: ["gestor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
      kanban_configs: {
        Row: {
          color: string
          created_at: string
          department: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          department?: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          department?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      notebooks: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          content_json: Json
          created_at: string
          deleted_at: string | null
          id: string
          is_pinned: boolean | null
          notebook_id: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          version: number | null
        }
        Insert: {
          content_json?: Json
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_pinned?: boolean | null
          notebook_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id: string
          version?: number | null
        }
        Update: {
          content_json?: Json
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_pinned?: boolean | null
          notebook_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_notes_notebook"
            columns: ["notebook_id"]
            isOneToOne: false
            referencedRelation: "notebooks"
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
      projetos: {
        Row: {
          atualizado_em: string | null
          briefing: string | null
          cliente: string | null
          cliente_id: string | null
          criado_em: string | null
          data_entrega: string | null
          data_inicio: string | null
          equipe: string | null
          escopo: string | null
          id: string
          materiais: Json | null
          observacoes: string | null
          prioridade: string | null
          progresso: number | null
          responsavel: string | null
          status: string | null
          tags: string[] | null
          titulo: string
        }
        Insert: {
          atualizado_em?: string | null
          briefing?: string | null
          cliente?: string | null
          cliente_id?: string | null
          criado_em?: string | null
          data_entrega?: string | null
          data_inicio?: string | null
          equipe?: string | null
          escopo?: string | null
          id?: string
          materiais?: Json | null
          observacoes?: string | null
          prioridade?: string | null
          progresso?: number | null
          responsavel?: string | null
          status?: string | null
          tags?: string[] | null
          titulo: string
        }
        Update: {
          atualizado_em?: string | null
          briefing?: string | null
          cliente?: string | null
          cliente_id?: string | null
          criado_em?: string | null
          data_entrega?: string | null
          data_inicio?: string | null
          equipe?: string | null
          escopo?: string | null
          id?: string
          materiais?: Json | null
          observacoes?: string | null
          prioridade?: string | null
          progresso?: number | null
          responsavel?: string | null
          status?: string | null
          tags?: string[] | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "projetos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      tarefas: {
        Row: {
          anexos: Json | null
          atualizado_em: string
          campos_customizados: Json | null
          cliente: string | null
          concluido_em: string | null
          criado_em: string
          criado_por: string | null
          data_entrega: string | null
          descricao: string | null
          id: string
          observadores: string[] | null
          prioridade: Database["public"]["Enums"]["task_priority"]
          projeto: string | null
          responsavel: string
          squad: string | null
          status: Database["public"]["Enums"]["task_status"]
          tags: string[] | null
          tipo: string | null
          tipo_id: string | null
          titulo: string
        }
        Insert: {
          anexos?: Json | null
          atualizado_em?: string
          campos_customizados?: Json | null
          cliente?: string | null
          concluido_em?: string | null
          criado_em?: string
          criado_por?: string | null
          data_entrega?: string | null
          descricao?: string | null
          id?: string
          observadores?: string[] | null
          prioridade?: Database["public"]["Enums"]["task_priority"]
          projeto?: string | null
          responsavel: string
          squad?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          tags?: string[] | null
          tipo?: string | null
          tipo_id?: string | null
          titulo: string
        }
        Update: {
          anexos?: Json | null
          atualizado_em?: string
          campos_customizados?: Json | null
          cliente?: string | null
          concluido_em?: string | null
          criado_em?: string
          criado_por?: string | null
          data_entrega?: string | null
          descricao?: string | null
          id?: string
          observadores?: string[] | null
          prioridade?: Database["public"]["Enums"]["task_priority"]
          projeto?: string | null
          responsavel?: string
          squad?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          tags?: string[] | null
          tipo?: string | null
          tipo_id?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_responsavel_profile"
            columns: ["responsavel"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tarefas_tipo"
            columns: ["tipo_id"]
            isOneToOne: false
            referencedRelation: "task_types"
            referencedColumns: ["id"]
          },
        ]
      }
      task_attachments: {
        Row: {
          file_size: number
          file_type: string
          id: string
          name: string
          task_id: string
          uploaded_at: string
          uploaded_by: string
          url: string
        }
        Insert: {
          file_size: number
          file_type: string
          id?: string
          name: string
          task_id: string
          uploaded_at?: string
          uploaded_by: string
          url: string
        }
        Update: {
          file_size?: number
          file_type?: string
          id?: string
          name?: string
          task_id?: string
          uploaded_at?: string
          uploaded_by?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_attachments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tarefas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_attachments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tarefas_com_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_attachments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "v_tarefas_detalhes"
            referencedColumns: ["id"]
          },
        ]
      }
      task_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          task_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          task_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tarefas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tarefas_com_responsavel"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "v_tarefas_detalhes"
            referencedColumns: ["id"]
          },
        ]
      }
      task_stages: {
        Row: {
          color: string
          created_at: string
          id: string
          kanban_config_id: string
          name: string
          order_position: number
          updated_at: string
        }
        Insert: {
          color?: string
          created_at?: string
          id: string
          kanban_config_id: string
          name: string
          order_position: number
          updated_at?: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          kanban_config_id?: string
          name?: string
          order_position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_stages_kanban_config_id_fkey"
            columns: ["kanban_config_id"]
            isOneToOne: false
            referencedRelation: "kanban_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      task_types: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
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
      tarefas_com_responsavel: {
        Row: {
          atualizado_em: string | null
          campos_customizados: Json | null
          cliente: string | null
          concluido_em: string | null
          criado_em: string | null
          criado_por: string | null
          data_entrega: string | null
          descricao: string | null
          id: string | null
          observadores: string[] | null
          prioridade: Database["public"]["Enums"]["task_priority"] | null
          projeto: string | null
          responsavel_nome: string | null
          squad: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          tags: string[] | null
          tipo: string | null
          titulo: string | null
        }
        Relationships: []
      }
      v_tarefas_detalhes: {
        Row: {
          atualizado_em: string | null
          campos_customizados: Json | null
          cliente: string | null
          concluido_em: string | null
          criado_em: string | null
          criado_por: string | null
          data_entrega: string | null
          descricao: string | null
          id: string | null
          observadores: string[] | null
          prioridade: Database["public"]["Enums"]["task_priority"] | null
          projeto: string | null
          responsavel: string | null
          responsavel_nome: string | null
          squad: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          tags: string[] | null
          tipo_id: string | null
          tipo_nome: string | null
          titulo: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_responsavel_profile"
            columns: ["responsavel"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_tarefas_tipo"
            columns: ["tipo_id"]
            isOneToOne: false
            referencedRelation: "task_types"
            referencedColumns: ["id"]
          },
        ]
      }
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
      client_status: "ativo" | "inativo" | "prospect"
      client_temperature: "frio" | "morno" | "quente"
      company_size: "micro" | "pequeno" | "medio" | "grande"
      contact_type: "principal" | "financeiro" | "operacional" | "outro"
      contract_type: "recorrente" | "pontual" | "projeto_unico"
      department_type:
        | "operacao"
        | "academy"
        | "cultura"
        | "comercial"
        | "gestao"
      task_priority: "low" | "medium" | "high"
      task_status: "todo" | "in_progress" | "review" | "completed" | "cancelled"
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
      client_status: ["ativo", "inativo", "prospect"],
      client_temperature: ["frio", "morno", "quente"],
      company_size: ["micro", "pequeno", "medio", "grande"],
      contact_type: ["principal", "financeiro", "operacional", "outro"],
      contract_type: ["recorrente", "pontual", "projeto_unico"],
      department_type: [
        "operacao",
        "academy",
        "cultura",
        "comercial",
        "gestao",
      ],
      task_priority: ["low", "medium", "high"],
      task_status: ["todo", "in_progress", "review", "completed", "cancelled"],
    },
  },
} as const
