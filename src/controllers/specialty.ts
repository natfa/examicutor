import { Specialty } from '../models/Specialty';

import specialtiesDB from '../db/specialties';

async function getAllSpecialties(): Promise<Specialty[]> {
  return specialtiesDB.getAllSpecialties();
}

export default {
  getAllSpecialties,
};
