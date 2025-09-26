// FIX: Import React to resolve 'Cannot find namespace React' error for React.ReactNode type.
import React from 'react';

export interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  price?: string;
}

export interface User {
  email: string;
  password: string; // In a real app, this would be a hash
  role: 'user' | 'admin';
}

export interface YouTubePlan {
  channelBranding: {
    title: string;
    description: string;
    nameIdeas: string[];
    taglineIdeas: string[];
    visualIdentity: string;
  };
  contentStrategy: {
    title: string;
    description: string;
    contentPillars: {
      pillar: string;
      ideas: string[];
    }[];
    videoFormats: string[];
  };
  videoIdeas: {
    title: string;
    description: string;
    ideas: {
      title: string;
      description: string;
    }[];
  };
  automationWorkflow: {
    title: string;
    description: string;
    steps: {
      step: string;
      details: string;
      tools: string[];
    }[];
  };
  socialMediaPromotion: {
    title: string;
    description: string;
    twitterPosts: string[];
    instagramCaptions: string[];
    tiktokIdeas: string[];
    facebookPosts: string[];
  };
  trafficGeneration: {
    title: string;
    description: string;
    strategies: {
      strategy: string;
      details: string;
    }[];
  };
  monetization: {
    title: string;
    description: string;
    methods: {
      method: string;
      details: string;
      cta: string;
    }[];
  };
  merchandiseOfferings: {
    title: string;
    description: string;
    products: {
      product: string;
      details: string;
      fulfillment: string;
    }[];
  };
}

export interface SavedPlan {
  id: number;
  request: string;
  plan: YouTubePlan;
  createdAt: string;
}