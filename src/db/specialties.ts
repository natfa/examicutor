import { PoolConnection } from 'mysql';
import { pool } from './index';

import { SpecialtyOld } from '../models/Specialty';

export interface SpecialtiesRowDataPacket {
  id: number;
  name: string;
}

export function buildSpecialty(dataPacket: SpecialtiesRowDataPacket): SpecialtyOld {
  return {
    id: String(dataPacket.id),
    name: dataPacket.name,
  };
}

function getAllSpecialties(): Promise<SpecialtyOld[]> {
  return new Promise<SpecialtyOld[]>((resolve, reject) => {
    pool.getConnection((connectionError: Error, connection: PoolConnection) => {
      if (connectionError) {
        reject(connectionError);
        return;
      }

      const sql = 'select * from specialties';

      connection.query(sql, (queryError: Error|null, results: SpecialtiesRowDataPacket[]) => {
        if (queryError) {
          reject(queryError);
          return;
        }

        connection.release();

        const specialties = results.map((result) => buildSpecialty(result));

        resolve(specialties);
      });
    });
  });
}

export default {
  getAllSpecialties,
};
