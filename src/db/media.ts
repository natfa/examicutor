import { query } from './index'

const saveOne = async (blob: Buffer, questionid: string): Promise<void> => {
  return new Promise(async(resolve, reject) => {
    try {
      const mediaInsertResult = await query({
        sql: `insert into media
        (content, questionid) values
        (?, ?)`,
        values: [blob, questionid],
      })

      return resolve()
    }
    catch(err) {
      return reject(err)
    }
  })
}

const getManyByQuestionid = async (questionid: string): Promise<Array<Buffer>> => {
  return new Promise<Array<Buffer>>(async(resolve, reject) => {
    try {
      const results = await query({
        sql: `select content
        from media
        where media.questionid = ?`,
        values: [questionid],
      })

      const array = results.map((result: any) => result.content)

      return resolve(array)
    }
    catch(err) {
      return reject(err)
    }
  })
}

export default {
  saveOne,
  getManyByQuestionid,
}
