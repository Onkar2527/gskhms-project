import { Patient } from "app/admin/patients/allpatients/patient.model";

export class EmergencyClinicalAssessment {
    id!: number;
    consultant!: string;
    appointmentNumber!: string;
    broughtByVehicle!: string;
    vehicleIdentity!: string;
    preHospitalCare!: string;
    preHospitalCareDetails!: string;
    allergies!: string;
    lastMealDetails!: string;
    lastMealTime!: string;
    medications!: string;
    pastMedicalHistory!: string;
    pastSergicalHistory!: string;
    eventsLeadingToTrauma!: string;
    painScore!: number;
    patientId!: number;
    hospitalId!: number;
    appointmentId!: number;
    assessmentVitalDTOList!: any[];
    patientDetails!: Patient;
    admitStatus!: string;
}