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
		PostgrestVersion: "14.1";
	};
	public: {
		Tables: {
			bank_adjustments: {
				Row: {
					adjustment_amount: number;
					bank_id: string;
					created_at: string;
					id: string;
					new_balance: number;
					previous_balance: number;
					reason: string | null;
					user_id: string;
				};
				Insert: {
					adjustment_amount: number;
					bank_id: string;
					created_at?: string;
					id?: string;
					new_balance: number;
					previous_balance: number;
					reason?: string | null;
					user_id: string;
				};
				Update: {
					adjustment_amount?: number;
					bank_id?: string;
					created_at?: string;
					id?: string;
					new_balance?: number;
					previous_balance?: number;
					reason?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "bank_adjustments_bank_id_fkey";
						columns: ["bank_id"];
						isOneToOne: false;
						referencedRelation: "banks";
						referencedColumns: ["id"];
					},
				];
			};
			banks: {
				Row: {
					balance: number;
					created_at: string;
					id: string;
					name: string;
					owner: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					balance?: number;
					created_at?: string;
					id?: string;
					name: string;
					owner: string;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					balance?: number;
					created_at?: string;
					id?: string;
					name?: string;
					owner?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			budget_categories: {
				Row: {
					color: string | null;
					created_at: string;
					id: string;
					last_reset_month: string | null;
					monthly_limit: number | null;
					name: string;
					percentage: number | null;
					rollover_balance: number | null;
					spent: number | null;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					color?: string | null;
					created_at?: string;
					id?: string;
					last_reset_month?: string | null;
					monthly_limit?: number | null;
					name: string;
					percentage?: number | null;
					rollover_balance?: number | null;
					spent?: number | null;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					color?: string | null;
					created_at?: string;
					id?: string;
					last_reset_month?: string | null;
					monthly_limit?: number | null;
					name?: string;
					percentage?: number | null;
					rollover_balance?: number | null;
					spent?: number | null;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			profiles: {
				Row: {
					created_at: string;
					email: string;
					full_name: string | null;
					id: string;
					monthly_income: number | null;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					email: string;
					full_name?: string | null;
					id?: string;
					monthly_income?: number | null;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					email?: string;
					full_name?: string | null;
					id?: string;
					monthly_income?: number | null;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			purposes: {
				Row: {
					category_id: string;
					created_at: string;
					id: string;
					name: string;
					user_id: string;
				};
				Insert: {
					category_id: string;
					created_at?: string;
					id?: string;
					name: string;
					user_id: string;
				};
				Update: {
					category_id?: string;
					created_at?: string;
					id?: string;
					name?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "purposes_category_id_fkey";
						columns: ["category_id"];
						isOneToOne: false;
						referencedRelation: "budget_categories";
						referencedColumns: ["id"];
					},
				];
			};
			transactions: {
				Row: {
					amount: number;
					bank_id: string;
					created_at: string;
					id: string;
					purpose_id: string | null;
					remarks: string | null;
					transaction_date: string;
					type: Database["public"]["Enums"]["transaction_type"];
					user_id: string;
				};
				Insert: {
					amount: number;
					bank_id: string;
					created_at?: string;
					id?: string;
					purpose_id?: string | null;
					remarks?: string | null;
					transaction_date?: string;
					type: Database["public"]["Enums"]["transaction_type"];
					user_id: string;
				};
				Update: {
					amount?: number;
					bank_id?: string;
					created_at?: string;
					id?: string;
					purpose_id?: string | null;
					remarks?: string | null;
					transaction_date?: string;
					type?: Database["public"]["Enums"]["transaction_type"];
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "transactions_bank_id_fkey";
						columns: ["bank_id"];
						isOneToOne: false;
						referencedRelation: "banks";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "transactions_purpose_id_fkey";
						columns: ["purpose_id"];
						isOneToOne: false;
						referencedRelation: "purposes";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			transaction_type: "income" | "expense";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

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
			transaction_type: ["income", "expense"],
		},
	},
} as const;