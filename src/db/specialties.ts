import { Connection } from 'mysql';
import { pool } from './index';

import { Specialty } from '../models/Specialty';

interface SpecialtiesRowDataPacket {
  id: number;
  name: string;
}

function buildSpecialty(dataPacket: SpecialtiesRowDataPacket): Specialty {
  return {
    id: String(dataPacket.id),
    name: dataPacket.name,
  };
}

function getAllSpecialties(): Promise<Specialty[]> {
  return new Promise<Specialty[]>((resolve, reject) => {
    pool.getConnection((connectionError: Error, connection: Connection) => {
      if (connectionError) {
        reject(connectionError);
        return;
      }

      const sql = 'select * from specialties';

      connection.query(sql, (queryError: Error, results: SpecialtiesRowDataPacket[]) => {
        if (queryError) {
          reject(queryError);
          return;
        }

        const specialties = results.map((result) => buildSpecialty(result));

        resolve(specialties);
      });
    });
  });
}

export default {
  getAllSpecialties,
};
