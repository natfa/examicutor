import { query } from './index'

import Subject from '../models/Subject'

const saveOne = async (model: Subject): Promise<Subject> => {
  return new Promise<Subject>(async (resolve, reject) => {
    try {
      const result = await query({
        sql: `insert into subjects
        (name) values (?)`,
        values: [model.name],
      })

      return resolve(new Subject(
        String(result.insertId),
        model.name,
      ))
    }
    catch (err) {
      return reject(err)
    }
  })
}

const getOneById = async (id: string): Promise<Subject|null> => {
  return new Promise<Subject|null>(async (resolve, reject) => {
    try {
      const results = await query({
        sql: 'select * from subjects where subjects.id = ?',
        values: [id],
      })

      if (results.length === 0)
        return resolve(null)

      const subject = { id: results[0].id, name: results[0].name }

      return resolve(new Subject(
        String(subject.id),
        subject.name,
      ))
    }
    catch (err) {
      return reject(err)
    }
  })
}

const getAll = async (): Promise<Array<Subject>> => {
  return new Promise<Array<Subject>>(async (resolve, reject) => {
    try {
      const results = await query({ sql: `select * from subjects` })

      const array = results.map((result: any) => new Subject(
        String(result.id),
        result.name,
      ))

      return resolve(array)
    }
    catch (err) {
      return reject(err)
    }
  })
}

const deleteOneById = async (id: string): Promise<boolean> => {
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      const result = await query({
        sql: `delete from subjects
        where subjects.id = ?`,
        values: [id],
      })

      if (result.affectedRows === 1)
        return resolve(true)
      else if (result.affectedRows === 0)
        return resolve(false)
      else
        throw new Error('Something is wrong with the database consistency')
    }
    catch (err) {
      return reject(err)
    }
  })
}

const getOneByName = async (name: string): Promise<Subject|null> => {
  return new Promise<Subject|null>(async(resolve, reject) => {
    try {
      const results = await query({
        sql: `select id, name
        from subjects
        where subjects.name = ?`,
        values: [name],
      })

      if (results.length === 0)
        return resolve(null)

      return resolve(new Subject(
        String(results[0].id),
        results[0].name,
      ))
    }
    catch(err) {
      return reject(err)
    }
  })
}

export default {
  saveOne,
  getOneById,
  getAll,
  deleteOneById,
  getOneByName,
}
