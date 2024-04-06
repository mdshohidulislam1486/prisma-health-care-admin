export type MedicalReport = {
  reportName: string;
  reportLink: string;
};

export type PatientHealthData = {
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  hasAllergies?: boolean;
  hasDiabetes?: boolean;
  height?: string;
  weight?: string;
  smokingStatus?: boolean;
  dietaryPreferences?: string | null;
  pregnancyStatus?: boolean;
  mentalHealthHistory?: string | null;
  immunizationStatus?: string | null;
  hasPastSurgeries?: boolean;
  recentAnxiety?: boolean;
  recentDepression?: boolean;
  maritalStatus?: string | null;
};

export type PatientPaylod = {
  name: string;
  email: string;
  profilePhoto?: string;
  contactNumber: string;
  address: string;
  isDeleted: boolean;
  patientHealthData: PatientHealthData;
  medicalReports: MedicalReport[];
};
