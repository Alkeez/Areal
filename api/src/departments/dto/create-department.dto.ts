export class CreateDepartmentDto {
  organization_id: number; // ID организации
  parent_id?: number;      // ID родительского отдела (может быть null)
  name: string;
  comment?: string;
}