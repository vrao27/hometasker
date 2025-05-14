//static page describing the game - not a protected route

// src/pages/About.tsx
// Static page describing the game—no auth required

import React from 'react';

const About: React.FC = () => (
  <main className="container py-4">
    {/* Mint wrapper with purple header */}
    <div className="card bg-mint shadow-sm rounded-3 mx-auto" style={{ maxWidth: 800 }}>
      <div className="header-banner">
        <h1 className="h4 mb-0">About HomeTasker</h1>
      </div>
      <div className="card-body">
        {/* App Overview */}
        <section className="mb-4">
          <h5 className="game-section-header">App Overview</h5>
          <p>
            HomeTasker turns everyday chores into a fun, points-based game.
            Assign yourself (or your housemates) point values for each task,
            complete them, and watch your score climb on the live leaderboard!
          </p>
        </section>

        {/* Key Features */}
        <section className="mb-4">
          <h5 className="game-section-header">Key Features</h5>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Create, complete, and delete household tasks</li>
            <li className="list-group-item">Earn points and compete on the live leaderboard</li>
            <li className="list-group-item">Simple point assignment makes chores rewarding</li>
            <li className="list-group-item">Responsive design—works on desktop and mobile</li>
          </ul>
        </section>

        {/* How It Works */}
        <section>
          <h5 className="game-section-header">How It Works</h5>
          <ol className="ps-3">
            <li>Sign up or log in to your HomeTasker account.</li>
            <li>Add tasks with point values—whoever completes more wins!</li>
            <li>Complete your chores and watch your points—and bragging rights—grow.</li>
          </ol>
        </section>
      </div>
    </div>
  </main>
);

export default About;
