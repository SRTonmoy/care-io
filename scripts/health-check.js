import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {},
    };

    // Check MongoDB
    try {
      if (mongoose.connection.readyState === 1) {
        await mongoose.connection.db.admin().ping();
        health.services.mongodb = 'healthy';
      } else {
        health.services.mongodb = 'unhealthy';
        health.status = 'degraded';
      }
    } catch (error) {
      health.services.mongodb = 'unhealthy';
      health.status = 'unhealthy';
      health.mongodbError = error.message;
    }

    // Check Redis (if configured)
    if (process.env.REDIS_URL) {
      try {
        const redis = require('@/lib/redis');
        const pong = await redis.ping();
        health.services.redis = pong === 'PONG' ? 'healthy' : 'unhealthy';
      } catch (error) {
        health.services.redis = 'unhealthy';
        health.status = 'degraded';
      }
    }

    // Check Stripe (if configured)
    if (process.env.STRIPE_SECRET_KEY) {
      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        await stripe.balance.retrieve();
        health.services.stripe = 'healthy';
      } catch (error) {
        health.services.stripe = 'unhealthy';
        health.status = 'degraded';
      }
    }

    return NextResponse.json(health, {
      status: health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    }, { status: 503 });
  }
}