'use server'

import { PrismaClient } from '@prisma/client'
import { generateToken } from '@/app/lib/jwt'

const prisma = new PrismaClient()

export async function authenticateUser(username, password) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
        password: password
      }
    })

    if (!user) {
      return { success: false, error: 'Invalid username or password' }
    }

    const token = generateToken(user)
    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
        userType: user.userType
      },
      token
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return { success: false, error: 'An error occurred during authentication' }
  }
} 