import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthPayload } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { jwtVerify } from 'jose';

