declare global {
  namespace NodeJS {
    interface ProcessEnv {
			SECRET_NAME: string,
      TABLE_NAME: string,
    }
  }
}

export const { SECRET_NAME, TABLE_NAME } = process.env