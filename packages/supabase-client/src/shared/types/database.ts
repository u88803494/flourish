export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number;
          checksum: string;
          finished_at: string | null;
          id: string;
          logs: string | null;
          migration_name: string;
          rolled_back_at: string | null;
          started_at: string;
        };
        Insert: {
          applied_steps_count?: number;
          checksum: string;
          finished_at?: string | null;
          id: string;
          logs?: string | null;
          migration_name: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Update: {
          applied_steps_count?: number;
          checksum?: string;
          finished_at?: string | null;
          id?: string;
          logs?: string | null;
          migration_name?: string;
          rolled_back_at?: string | null;
          started_at?: string;
        };
        Relationships: [];
      };
      cards: {
        Row: {
          bank: string;
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          last4: string;
          name: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          bank: string;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          last4: string;
          name: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          bank?: string;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          last4?: string;
          name?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'cards_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      categories: {
        Row: {
          color: string | null;
          created_at: string | null;
          id: string;
          is_active: boolean | null;
          name: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          color?: string | null;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          name: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          color?: string | null;
          created_at?: string | null;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'categories_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      recurring_expenses: {
        Row: {
          amount: number;
          category_id: string | null;
          created_at: string | null;
          description: string | null;
          end_date: string | null;
          frequency: Database['public']['Enums']['recurring_frequency'];
          id: string;
          is_active: boolean | null;
          name: string;
          start_date: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          category_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          frequency: Database['public']['Enums']['recurring_frequency'];
          id?: string;
          is_active?: boolean | null;
          name: string;
          start_date: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          category_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          frequency?: Database['public']['Enums']['recurring_frequency'];
          id?: string;
          is_active?: boolean | null;
          name?: string;
          start_date?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'recurring_expenses_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'recurring_expenses_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      saving_rules: {
        Row: {
          amount: number;
          created_at: string | null;
          frequency: string;
          id: string;
          is_active: boolean | null;
          name: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          frequency: string;
          id?: string;
          is_active?: boolean | null;
          name: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          frequency?: string;
          id?: string;
          is_active?: boolean | null;
          name?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'saving_rules_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      statements: {
        Row: {
          card_id: string;
          created_at: string | null;
          extracted_count: number | null;
          id: string;
          imported_count: number | null;
          pdf_url: string | null;
          statement_date: string;
          status: Database['public']['Enums']['statement_status'] | null;
          updated_at: string | null;
          upload_date: string | null;
          user_id: string;
        };
        Insert: {
          card_id: string;
          created_at?: string | null;
          extracted_count?: number | null;
          id?: string;
          imported_count?: number | null;
          pdf_url?: string | null;
          statement_date: string;
          status?: Database['public']['Enums']['statement_status'] | null;
          updated_at?: string | null;
          upload_date?: string | null;
          user_id: string;
        };
        Update: {
          card_id?: string;
          created_at?: string | null;
          extracted_count?: number | null;
          id?: string;
          imported_count?: number | null;
          pdf_url?: string | null;
          statement_date?: string;
          status?: Database['public']['Enums']['statement_status'] | null;
          updated_at?: string | null;
          upload_date?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'statements_card_id_fkey';
            columns: ['card_id'];
            isOneToOne: false;
            referencedRelation: 'cards';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'statements_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      transactions: {
        Row: {
          amount: number;
          category_id: string | null;
          confidence: number | null;
          created_at: string | null;
          date: string;
          description: string | null;
          id: string;
          is_manual_entry: boolean | null;
          merchant_name: string;
          raw_text: string | null;
          statement_id: string | null;
          type: Database['public']['Enums']['transaction_type'];
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          amount: number;
          category_id?: string | null;
          confidence?: number | null;
          created_at?: string | null;
          date: string;
          description?: string | null;
          id?: string;
          is_manual_entry?: boolean | null;
          merchant_name: string;
          raw_text?: string | null;
          statement_id?: string | null;
          type: Database['public']['Enums']['transaction_type'];
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          category_id?: string | null;
          confidence?: number | null;
          created_at?: string | null;
          date?: string;
          description?: string | null;
          id?: string;
          is_manual_entry?: boolean | null;
          merchant_name?: string;
          raw_text?: string | null;
          statement_id?: string | null;
          type?: Database['public']['Enums']['transaction_type'];
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'transactions_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transactions_statement_id_fkey';
            columns: ['statement_id'];
            isOneToOne: false;
            referencedRelation: 'statements';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'transactions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          created_at: string | null;
          email: string;
          id: string;
          name: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id: string;
          name?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: string;
          name?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_category_spending_by_range: {
        Args: {
          p_category_id: string;
          p_end_date: string;
          p_start_date: string;
          p_user_id: string;
        };
        Returns: number;
      };
      get_category_total: {
        Args: { p_category_id: string; p_user_id: string };
        Returns: number;
      };
      get_monthly_spending: {
        Args: { p_month: number; p_user_id: string; p_year: number };
        Returns: number;
      };
    };
    Enums: {
      recurring_frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'BIANNUAL' | 'ANNUAL';
      statement_status: 'PENDING' | 'EXTRACTED' | 'IMPORTED' | 'ARCHIVED';
      transaction_type: 'EXPENSE' | 'INCOME' | 'REFUND';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      recurring_frequency: ['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'BIANNUAL', 'ANNUAL'],
      statement_status: ['PENDING', 'EXTRACTED', 'IMPORTED', 'ARCHIVED'],
      transaction_type: ['EXPENSE', 'INCOME', 'REFUND'],
    },
  },
} as const;
