export interface IUpdateProfileReq {
  name: string
  phone: string
  avatar?: string
  address?: string
}

export interface IProfileRes {
  id: number
  name: string
  email: string
  phone: string
  avatar: string
  address: string
}
