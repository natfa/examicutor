import { query } from './index'

import Theme from '../models/Theme'

const saveOne = (theme: Theme): Promise<Theme> => {
  return new Promise<Theme>(async(resolve, reject) => {
    try {
      const result = await query({
        sql: `insert into themes
        (name, subjectid) values
        (?, ?)`,
        values: [theme.name, theme.subjectid],
      })

      return resolve(new Theme(
        String(result.insertId),
        theme.name,
        theme.subjectid,
      ))
    }
    catch (err) {
      return reject(err)
    }
  })
}

const getOneById = (id: string): Promise<Theme|null> => {
  return new Promise<Theme|null>(async(resolve, reject) => {
    try {
      const results = await query({
        sql: `select id, name, subjectid
        from themes
        where themes.id = ?`,
        values: [id],
      })

      if (results.length === 0)
        return resolve(null)

      const theme = { id: results[0].id, name: results[0].name, subjectid: results[0].subjectid}

      return resolve(new Theme(
        String(theme.id),
        theme.name,
        String(theme.subjectid),
      ))
    }
    catch(err) {
      return reject(err)
    }
  })
}

const getAll = (): Promise<Array<Theme>> => {
  return new Promise<Array<Theme>>(async(resolve, reject) => {
    try {
      const results = await query({
        sql: `select id, name, subjectid
        from themes`,
      })

      const array = results.map((result: any) => {
        return new Theme(
          String(result.id),
          result.name,
          String(result.subjectid),
        )
      })

      return resolve(array)
    }
    catch(err) {
      return reject(err)
    }
  })
}

const deleteOneById = (id: string): Promise<boolean> => {
  return new Promise<boolean>(async(resolve, reject) => {
    try {
      const result = await query({
        sql: `delete from themes
        where themes.id = ?`,
        values: [id],
      })

      if (result.affectedRows === 1)
        return resolve(true)
      else if (result.affectedRows === 0)
        return resolve(false)
      else
        throw new Error('Something is wrong with the database consistency')
    }
    catch(err) {
      return reject(err)
    }
  })
}

const getManyBySubjectid = (id: string): Promise<Array<Theme>> => {
  return new Promise<Array<Theme>>(async(resolve, reject) => {
    try {
      const results = await query({
        sql: `select id, name, subjectid
        from themes
        where themes.subjectid = ?`,
        values: [id],
      })

      const array = results.map((result: any) => {
        return new Theme(
          String(result.id),
          result.name,
          String(result.subjectid),
        )
      })

      return resolve(array)
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
  getManyBySubjectid,
}
