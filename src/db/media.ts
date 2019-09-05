import { query } from './index'

function deleteById(mediaId: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    query({
      sql: 'delete from media where media.id = ?',
      values: [mediaId],
    })
      .then((results) => {
        if (results.affectedRows !== 1)
          return resolve(false)
        return resolve(true)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

function saveNewMedia(questionId: string, blob: Buffer): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    query({
      sql: `insert into media
      (content, questionid) values
      (?, ?)`,
      values: [blob, questionId]
    })
      .then((results) => {
        if (results.affectedRows !== 1)
          return resolve(false)
        return resolve(true)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export default {
  deleteById,
  saveNewMedia,
}
