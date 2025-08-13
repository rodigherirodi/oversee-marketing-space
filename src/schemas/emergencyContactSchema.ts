
import { z } from 'zod';

export const emergencyContactSchema = z.object({
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  emergency_contact_relationship: z.string().optional(),
}).refine((data) => {
  // If any emergency contact field is filled, name becomes required
  const hasPhone = data.emergency_contact_phone && data.emergency_contact_phone.replace(/\D/g, '').length >= 10;
  const hasRelationship = data.emergency_contact_relationship && data.emergency_contact_relationship.trim().length > 0;
  
  if (hasPhone || hasRelationship) {
    return data.emergency_contact_name && data.emergency_contact_name.trim().length > 0;
  }
  
  return true;
}, {
  message: "Nome do contato de emergência é obrigatório quando telefone ou parentesco são preenchidos",
  path: ["emergency_contact_name"]
});

export type EmergencyContactData = z.infer<typeof emergencyContactSchema>;
